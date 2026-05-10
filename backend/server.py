from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt as pyjwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALG = "HS256"
ADMIN_MOBILES = {"9929059153", "9829312193"}
DEFAULT_PASSWORD = "2193"
TOKEN_TTL_HOURS = 12

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ============ Helpers ============
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def hash_pw(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


def verify_pw(p: str, h: str) -> bool:
    try:
        return bcrypt.checkpw(p.encode(), h.encode())
    except Exception:
        return False


def make_token(mobile: str) -> str:
    payload = {
        "sub": mobile,
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_TTL_HOURS),
        "type": "admin",
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def decode_token(token: str) -> Optional[str]:
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        if payload.get("type") != "admin":
            return None
        mob = payload.get("sub")
        return mob if mob in ADMIN_MOBILES else None
    except Exception:
        return None


async def require_admin(request: Request) -> str:
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    mobile = decode_token(token)
    if not mobile:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return mobile


# ============ Models ============
class LoginIn(BaseModel):
    mobile: str
    password: str


class LoginOut(BaseModel):
    token: str
    mobile: str


class AuthorizedUserIn(BaseModel):
    mobile: str = Field(min_length=10, max_length=10)
    name: str
    expires_on: str  # ISO date YYYY-MM-DD


class AuthorizedUserOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    mobile: str
    name: str
    authorized_at: str
    expires_on: str
    status: str
    removed_at: Optional[str] = None


class CheckAuthOut(BaseModel):
    authorized: bool
    name: Optional[str] = None
    expires_on: Optional[str] = None
    reason: Optional[str] = None


# ============ Seed admin password on startup ============
async def seed_admin():
    doc = await db.admin_meta.find_one({"_id": "password"}, {"_id": 0})
    if not doc:
        await db.admin_meta.insert_one({
            "_id": "password",
            "hash": hash_pw(DEFAULT_PASSWORD),
            "created_at": now_iso(),
        })


@app.on_event("startup")
async def _startup():
    await seed_admin()
    await db.authorized_users.create_index("mobile")


# ============ Public ============
@api_router.get("/")
async def root():
    return {"message": "Newalkkar Saandiip API", "ok": True}


@api_router.get("/check-authorized/{mobile}", response_model=CheckAuthOut)
async def check_authorized(mobile: str):
    """Public endpoint — used by /mobile-compatibility page."""
    mobile = "".join(filter(str.isdigit, mobile))[-10:]
    if len(mobile) != 10:
        return CheckAuthOut(authorized=False, reason="invalid")
    user = await db.authorized_users.find_one(
        {"mobile": mobile, "status": "active"}, {"_id": 0}
    )
    if not user:
        return CheckAuthOut(authorized=False, reason="not_authorized")
    # expiry check
    try:
        exp_date = datetime.fromisoformat(user["expires_on"]).replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) > exp_date + timedelta(days=1):
            return CheckAuthOut(authorized=False, reason="expired")
    except Exception:
        pass
    return CheckAuthOut(authorized=True, name=user.get("name"), expires_on=user.get("expires_on"))


# ============ Admin auth ============
@api_router.post("/admin/login", response_model=LoginOut)
async def admin_login(payload: LoginIn):
    mobile = payload.mobile.strip()
    if mobile not in ADMIN_MOBILES:
        raise HTTPException(status_code=401, detail="This mobile is not allowed.")
    doc = await db.admin_meta.find_one({"_id": "password"}, {"_id": 0})
    if not doc or not verify_pw(payload.password, doc["hash"]):
        raise HTTPException(status_code=401, detail="Wrong password.")
    return LoginOut(token=make_token(mobile), mobile=mobile)


@api_router.get("/admin/me")
async def admin_me(mobile: str = Depends(require_admin)):
    return {"mobile": mobile}


# ============ Authorized users CRUD ============
@api_router.get("/admin/users", response_model=List[AuthorizedUserOut])
async def list_users(_: str = Depends(require_admin)):
    docs = await db.authorized_users.find({"status": "active"}, {"_id": 0}).sort("authorized_at", -1).to_list(500)
    return docs


@api_router.get("/admin/users/history", response_model=List[AuthorizedUserOut])
async def history_users(_: str = Depends(require_admin)):
    docs = await db.authorized_users.find({"status": "removed"}, {"_id": 0}).sort("removed_at", -1).to_list(500)
    return docs


@api_router.post("/admin/users", response_model=AuthorizedUserOut)
async def add_user(payload: AuthorizedUserIn, _: str = Depends(require_admin)):
    mobile = "".join(filter(str.isdigit, payload.mobile))[-10:]
    if len(mobile) != 10:
        raise HTTPException(status_code=400, detail="Mobile must be 10 digits.")
    existing = await db.authorized_users.find_one({"mobile": mobile, "status": "active"}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="This mobile is already authorized.")
    doc = {
        "id": str(uuid.uuid4()),
        "mobile": mobile,
        "name": payload.name.strip(),
        "authorized_at": now_iso(),
        "expires_on": payload.expires_on,
        "status": "active",
        "removed_at": None,
    }
    await db.authorized_users.insert_one(doc.copy())
    return doc


@api_router.delete("/admin/users/{user_id}")
async def remove_user(user_id: str, _: str = Depends(require_admin)):
    result = await db.authorized_users.update_one(
        {"id": user_id, "status": "active"},
        {"$set": {"status": "removed", "removed_at": now_iso()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"ok": True}


# ============ Wire ============
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
