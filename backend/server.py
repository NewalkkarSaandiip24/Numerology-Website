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
ADMIN_MOBILES = {m.strip() for m in os.environ['ADMIN_MOBILES'].split(',') if m.strip()}
DEFAULT_PASSWORD = os.environ['ADMIN_DEFAULT_PASSWORD']
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


# ============ Blog models ============
import re

def slugify(s: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", s.lower()).strip()
    s = re.sub(r"\s+", "-", s)[:80]
    return s or "untitled"


class BlogIn(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    content: str = Field(min_length=2, max_length=20000)
    image_base64: Optional[str] = None  # data URL or raw base64; <2MB enforced server-side


class BlogOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    content: str
    image_base64: Optional[str] = None
    created_at: str
    updated_at: str


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
    await db.blogs.create_index("slug", unique=True)
    await db.blogs.create_index("created_at")


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


# ============ Blogs (public list + admin CRUD) ============
def _validate_image_size(image_b64: Optional[str]):
    if not image_b64:
        return
    # Strip data URL prefix if present
    raw = image_b64.split(",", 1)[1] if image_b64.startswith("data:") else image_b64
    # Rough check: base64 length * 0.75 = bytes. Cap at 2MB.
    if len(raw) * 0.75 > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large. Please use an image under 2 MB.")


async def _unique_slug(base: str) -> str:
    slug = base
    i = 2
    while await db.blogs.find_one({"slug": slug}, {"_id": 0, "slug": 1}):
        slug = f"{base}-{i}"
        i += 1
    return slug


@api_router.get("/blogs", response_model=List[BlogOut])
async def list_blogs_public():
    """Public — used by /blogs page."""
    docs = await db.blogs.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return docs


@api_router.get("/blogs/{slug}", response_model=BlogOut)
async def get_blog_public(slug: str):
    doc = await db.blogs.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found.")
    return doc


@api_router.post("/admin/blogs", response_model=BlogOut)
async def create_blog(payload: BlogIn, _: str = Depends(require_admin)):
    _validate_image_size(payload.image_base64)
    base_slug = slugify(payload.title)
    slug = await _unique_slug(base_slug)
    now = now_iso()
    doc = {
        "id": str(uuid.uuid4()),
        "slug": slug,
        "title": payload.title.strip(),
        "content": payload.content.strip(),
        "image_base64": payload.image_base64,
        "created_at": now,
        "updated_at": now,
    }
    await db.blogs.insert_one(doc.copy())
    return doc


@api_router.delete("/admin/blogs/{blog_id}")
async def delete_blog(blog_id: str, _: str = Depends(require_admin)):
    result = await db.blogs.delete_one({"id": blog_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found.")
    return {"ok": True}


# ============ Course leads (ad landing pages) ============
class CourseLeadIn(BaseModel):
    course: str = Field(min_length=1, max_length=60)
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=200)
    mobile: str = Field(min_length=10, max_length=15)


@api_router.post("/course-leads")
async def add_course_lead(payload: CourseLeadIn):
    """Public — captures registration form submissions from ad landing pages."""
    doc = {
        "id": str(uuid.uuid4()),
        "course": payload.course.strip().lower(),
        "name": payload.name.strip(),
        "email": payload.email.strip().lower(),
        "mobile": "".join(ch for ch in payload.mobile if ch.isdigit())[-10:],
        "created_at": now_iso(),
    }
    await db.course_leads.insert_one(doc.copy())
    return {"ok": True, "id": doc["id"]}


@api_router.get("/admin/course-leads")
async def list_course_leads(_: str = Depends(require_admin), course: Optional[str] = None):
    q = {}
    if course:
        q["course"] = course.lower()
    docs = await db.course_leads.find(q, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


# ============ Video Recordings (YouTube-embedded) ============
import re as _re

YT_REGEX = _re.compile(
    r"(?:youtu\.be/|youtube\.com/(?:watch\?v=|embed/|v/|shorts/))([\w-]{11})"
)

def extract_youtube_id(url: str) -> str:
    m = YT_REGEX.search(url or "")
    if not m:
        raise HTTPException(status_code=400, detail="Please paste a valid YouTube URL (https://youtu.be/... or https://youtube.com/watch?v=...).")
    return m.group(1)


def normalize_mobile(m: str) -> str:
    return "".join(ch for ch in (m or "") if ch.isdigit())[-10:]


class SectionIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)


class SectionUpdate(BaseModel):
    name: Optional[str] = None


class VideoIn(BaseModel):
    section_id: str
    title: str = Field(min_length=2, max_length=200)
    youtube_url: str = Field(min_length=10, max_length=400)
    description: Optional[str] = Field(default=None, max_length=2000)
    # "landscape" (16:9, default) or "portrait" (9:16 for vertical phone recordings)
    orientation: Optional[str] = "landscape"


class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    orientation: Optional[str] = None


@api_router.get("/admin/recordings/sections")
async def list_sections_admin(_: str = Depends(require_admin)):
    docs = await db.video_sections.find({}, {"_id": 0}).sort("created_at", 1).to_list(200)
    return docs


@api_router.post("/admin/recordings/sections")
async def create_section(payload: SectionIn, _: str = Depends(require_admin)):
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "slug": slugify(payload.name),
        "created_at": now_iso(),
    }
    await db.video_sections.insert_one(doc.copy())
    return doc


@api_router.patch("/admin/recordings/sections/{section_id}")
async def update_section(section_id: str, payload: SectionUpdate, _: str = Depends(require_admin)):
    updates: dict = {}
    if payload.name is not None:
        nm = payload.name.strip()
        if len(nm) < 2:
            raise HTTPException(status_code=400, detail="Section name is too short.")
        updates["name"] = nm
        updates["slug"] = slugify(nm)
    if not updates:
        raise HTTPException(status_code=400, detail="Nothing to update.")
    res = await db.video_sections.update_one({"id": section_id}, {"$set": updates})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Section not found.")
    return {"ok": True}


@api_router.delete("/admin/recordings/sections/{section_id}")
async def delete_section(section_id: str, _: str = Depends(require_admin)):
    await db.videos.delete_many({"section_id": section_id})
    res = await db.video_sections.delete_one({"id": section_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Section not found.")
    return {"ok": True}


@api_router.post("/admin/recordings/videos")
async def create_video(payload: VideoIn, _: str = Depends(require_admin)):
    yt_id = extract_youtube_id(payload.youtube_url)
    section = await db.video_sections.find_one({"id": payload.section_id}, {"_id": 0, "id": 1})
    if not section:
        raise HTTPException(status_code=404, detail="Section not found.")
    doc = {
        "id": str(uuid.uuid4()),
        "section_id": payload.section_id,
        "title": payload.title.strip(),
        "youtube_id": yt_id,
        "description": (payload.description or "").strip(),
        "orientation": payload.orientation if payload.orientation in ("landscape", "portrait") else "landscape",
        "uploaded_at": now_iso(),
    }
    await db.videos.insert_one(doc.copy())
    return doc


@api_router.patch("/admin/recordings/videos/{video_id}")
async def update_video(video_id: str, payload: VideoUpdate, _: str = Depends(require_admin)):
    updates = {}
    if payload.title is not None: updates["title"] = payload.title.strip()
    if payload.description is not None: updates["description"] = payload.description.strip()
    if payload.orientation is not None and payload.orientation in ("landscape", "portrait"):
        updates["orientation"] = payload.orientation
    if not updates:
        raise HTTPException(status_code=400, detail="Nothing to update.")
    res = await db.videos.update_one({"id": video_id}, {"$set": updates})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Video not found.")
    return {"ok": True}


@api_router.delete("/admin/recordings/videos/{video_id}")
async def delete_video(video_id: str, _: str = Depends(require_admin)):
    res = await db.videos.delete_one({"id": video_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Video not found.")
    return {"ok": True}


@api_router.get("/admin/recordings/videos")
async def list_all_videos_admin(_: str = Depends(require_admin)):
    docs = await db.videos.find({}, {"_id": 0}).sort("uploaded_at", -1).to_list(1000)
    return docs


# ----- Public recordings access -----
class RecordingsGate(BaseModel):
    mobile: str


@api_router.post("/recordings/access")
async def access_recordings(payload: RecordingsGate):
    """Mobile-gated. Returns sections + videos that this mobile is allowed to watch."""
    m = normalize_mobile(payload.mobile)
    if len(m) != 10:
        raise HTTPException(status_code=400, detail="Please enter a valid 10-digit mobile number.")

    # Same auth check as Mobile Compatibility
    user = await db.authorized_users.find_one(
        {"mobile": m, "status": "active"},
        {"_id": 0, "mobile": 1, "name": 1, "expires_on": 1},
    )
    if not user:
        raise HTTPException(status_code=403, detail="This mobile number is not authorized yet. Please contact the administrator — Newalkkar Saandiip ji at +91 99290 59153 — to register your details.")

    # Expiry check
    try:
        if user.get("expires_on"):
            exp = datetime.fromisoformat(user["expires_on"]).date()
            if exp < datetime.now(timezone.utc).date():
                raise HTTPException(status_code=403, detail="Your access has expired. Please contact the administrator to renew.")
    except HTTPException:
        raise
    except Exception:
        pass

    sections = await db.video_sections.find({}, {"_id": 0}).sort("created_at", 1).to_list(200)
    videos = await db.videos.find({}, {"_id": 0}).sort("uploaded_at", -1).to_list(1000)

    # Any active authorized mobile (same list used by Mobile Compatibility) gets full access.
    by_section: dict = {}
    for v in videos:
        v_out = {k: v.get(k) for k in ("id", "section_id", "title", "youtube_id", "description", "uploaded_at", "orientation")}
        v_out["orientation"] = v_out.get("orientation") or "landscape"
        by_section.setdefault(v["section_id"], []).append(v_out)

    sections_out = []
    for s in sections:
        sections_out.append({
            "id": s["id"],
            "name": s["name"],
            "slug": s.get("slug"),
            "videos": by_section.get(s["id"], []),
        })

    return {
        "name": user.get("name"),
        "mobile": user["mobile"],
        "sections": sections_out,
    }


# ============ Course Schedules ============
COURSE_SLUG_LABELS = {
    "mobile-numerology": "Mobile Numerology Masterclass",
    "numerology": "Numerology Workshop",
    "vastu": "Vaastu Mastery Workshop",
    "personal-year": "Personal Year Forecasting",
}


class CourseScheduleIn(BaseModel):
    event_date: Optional[str] = None     # YYYY-MM-DD
    event_time: Optional[str] = None     # free-form, e.g. "07:30 PM"
    timezone_label: Optional[str] = None # e.g. "IST"
    notes: Optional[str] = None


def _schedule_doc(slug: str, doc):
    src = doc or {}
    return {
        "course_slug": slug,
        "course_label": COURSE_SLUG_LABELS.get(slug, slug.replace("-", " ").title()),
        "event_date": src.get("event_date") or "",
        "event_time": src.get("event_time") or "",
        "timezone_label": src.get("timezone_label") or "IST",
        "notes": src.get("notes") or "",
        "updated_at": src.get("updated_at") or "",
    }


@api_router.get("/course-schedules")
async def list_course_schedules_public():
    out = []
    for slug in COURSE_SLUG_LABELS.keys():
        doc = await db.course_schedules.find_one({"course_slug": slug}, {"_id": 0})
        out.append(_schedule_doc(slug, doc))
    return out


@api_router.get("/course-schedules/{slug}")
async def get_course_schedule_public(slug: str):
    doc = await db.course_schedules.find_one({"course_slug": slug}, {"_id": 0})
    return _schedule_doc(slug, doc)


@api_router.patch("/admin/course-schedules/{slug}")
async def update_course_schedule(slug: str, payload: CourseScheduleIn, _: str = Depends(require_admin)):
    if slug not in COURSE_SLUG_LABELS:
        raise HTTPException(status_code=404, detail="Unknown course.")
    if payload.event_date:
        try:
            datetime.strptime(payload.event_date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="event_date must be in YYYY-MM-DD format.")
    update = {
        "course_slug": slug,
        "event_date": (payload.event_date or "").strip(),
        "event_time": (payload.event_time or "").strip(),
        "timezone_label": (payload.timezone_label or "IST").strip(),
        "notes": (payload.notes or "").strip(),
        "updated_at": now_iso(),
    }
    await db.course_schedules.update_one(
        {"course_slug": slug}, {"$set": update}, upsert=True
    )
    return _schedule_doc(slug, update)


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
