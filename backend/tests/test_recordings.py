"""Backend tests for Recorded Sessions feature.

Covers:
- Public gate POST /api/recordings/access: invalid mobile (400), unauthorized (403),
  expired (403), authorized w/ filtering (200).
- Admin CRUD for sections & videos including cascade delete + invalid YT URL.
- Regression check: mobile compatibility /api/check-authorized still works.
"""
import os
import time
import pytest
import requests
from datetime import date, timedelta

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
assert BASE_URL, "REACT_APP_BACKEND_URL must be set"
API = f"{BASE_URL}/api"

ADMIN_MOBILE = "9929059153"
ADMIN_PASSWORD = "2193"

# Mobile to use for the auth-gated client test (will be added & cleaned up).
QA_AUTHORIZED_MOBILE = "9000099000"
QA_RESTRICTED_MOBILE = "9999999999"  # not authorized — used only inside allowed_mobiles whitelist
QA_EXPIRED_MOBILE = "9000099111"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/admin/login", json={"mobile": ADMIN_MOBILE, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    tok = r.json().get("token")
    assert tok
    return tok


@pytest.fixture(scope="module")
def auth(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---------- Tracking for cleanup ----------
_created_section_ids = []
_created_video_ids = []
_created_user_ids = []


@pytest.fixture(scope="module", autouse=True)
def _cleanup(admin_token):
    yield
    h = {"Authorization": f"Bearer {admin_token}"}
    for vid in list(_created_video_ids):
        requests.delete(f"{API}/admin/recordings/videos/{vid}", headers=h, timeout=10)
    for sid in list(_created_section_ids):
        requests.delete(f"{API}/admin/recordings/sections/{sid}", headers=h, timeout=10)
    for uid in list(_created_user_ids):
        requests.delete(f"{API}/admin/users/{uid}", headers=h, timeout=10)


# ============ Public gate ============
class TestPublicGate:
    def test_invalid_short_mobile_returns_400(self):
        r = requests.post(f"{API}/recordings/access", json={"mobile": "123"}, timeout=10)
        assert r.status_code == 400
        assert "10-digit" in r.json().get("detail", "").lower() or "valid" in r.json().get("detail", "").lower()

    def test_unauthorized_mobile_returns_403(self):
        r = requests.post(f"{API}/recordings/access", json={"mobile": "1234567890"}, timeout=10)
        assert r.status_code == 403
        assert "not authorized" in r.json().get("detail", "").lower()

    def test_authorized_admin_mobile_returns_200(self):
        r = requests.post(f"{API}/recordings/access", json={"mobile": ADMIN_MOBILE}, timeout=10)
        assert r.status_code == 200
        body = r.json()
        assert body.get("mobile") == ADMIN_MOBILE
        assert "sections" in body and isinstance(body["sections"], list)


# ============ Admin CRUD ============
class TestAdminCRUD:
    def test_list_sections_initial(self, auth):
        r = requests.get(f"{API}/admin/recordings/sections", headers=auth, timeout=10)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_section_and_video_flow(self, auth):
        # Create section
        r = requests.post(f"{API}/admin/recordings/sections", headers=auth,
                          json={"name": "TEST_QA_Section"}, timeout=10)
        assert r.status_code == 200, r.text
        sec = r.json()
        assert sec["name"] == "TEST_QA_Section"
        assert sec.get("id")
        sec_id = sec["id"]
        _created_section_ids.append(sec_id)

        # Reject invalid YouTube URL
        bad = requests.post(f"{API}/admin/recordings/videos", headers=auth, json={
            "section_id": sec_id, "title": "Bad", "youtube_url": "https://example.com/foo",
            "description": "", "allowed_mobiles": []
        }, timeout=10)
        assert bad.status_code == 400

        # Valid video
        r = requests.post(f"{API}/admin/recordings/videos", headers=auth, json={
            "section_id": sec_id, "title": "TEST_QA Video",
            "youtube_url": "https://youtu.be/dQw4w9WgXcQ", "description": "qa",
            "allowed_mobiles": []
        }, timeout=10)
        assert r.status_code == 200, r.text
        vid = r.json()
        assert vid["youtube_id"] == "dQw4w9WgXcQ"
        assert vid["title"] == "TEST_QA Video"
        vid_id = vid["id"]
        _created_video_ids.append(vid_id)

        # PATCH title
        r = requests.patch(f"{API}/admin/recordings/videos/{vid_id}", headers=auth,
                           json={"title": "TEST_QA Video Updated"}, timeout=10)
        assert r.status_code == 200

        # Verify update via list
        r = requests.get(f"{API}/admin/recordings/videos", headers=auth, timeout=10)
        assert r.status_code == 200
        found = [v for v in r.json() if v["id"] == vid_id]
        assert found and found[0]["title"] == "TEST_QA Video Updated"

        # DELETE video
        r = requests.delete(f"{API}/admin/recordings/videos/{vid_id}", headers=auth, timeout=10)
        assert r.status_code == 200
        _created_video_ids.remove(vid_id)

        # DELETE section
        r = requests.delete(f"{API}/admin/recordings/sections/{sec_id}", headers=auth, timeout=10)
        assert r.status_code == 200
        _created_section_ids.remove(sec_id)

    def test_cascade_delete_section_removes_videos(self, auth):
        # New section
        r = requests.post(f"{API}/admin/recordings/sections", headers=auth,
                          json={"name": "TEST_Cascade_Section"}, timeout=10)
        assert r.status_code == 200
        sec_id = r.json()["id"]
        _created_section_ids.append(sec_id)

        # 2 videos
        ids = []
        for i in range(2):
            r = requests.post(f"{API}/admin/recordings/videos", headers=auth, json={
                "section_id": sec_id, "title": f"TEST_Cascade_{i}",
                "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "description": "", "allowed_mobiles": []
            }, timeout=10)
            assert r.status_code == 200
            ids.append(r.json()["id"])
            _created_video_ids.append(r.json()["id"])

        # Delete section -> videos should disappear
        r = requests.delete(f"{API}/admin/recordings/sections/{sec_id}", headers=auth, timeout=10)
        assert r.status_code == 200
        _created_section_ids.remove(sec_id)

        all_vids = requests.get(f"{API}/admin/recordings/videos", headers=auth, timeout=10).json()
        remaining = [v for v in all_vids if v["id"] in ids]
        assert remaining == []
        for vid_id in ids:
            if vid_id in _created_video_ids:
                _created_video_ids.remove(vid_id)


# ============ Authorization filtering ============
class TestAuthFiltering:
    def test_filtering_visible_and_hidden(self, auth):
        # 1. Authorize a brand-new mobile with future expiry
        future = (date.today() + timedelta(days=30)).isoformat()
        r = requests.post(f"{API}/admin/users", headers=auth, json={
            "mobile": QA_AUTHORIZED_MOBILE, "name": "TEST_QA_Client", "expires_on": future
        }, timeout=10)
        assert r.status_code in (200, 201), r.text
        user = r.json()
        if user.get("id"):
            _created_user_ids.append(user["id"])

        # 2. Create QA Restricted section with restricted + open videos
        r = requests.post(f"{API}/admin/recordings/sections", headers=auth,
                          json={"name": "TEST_QA_Restricted"}, timeout=10)
        assert r.status_code == 200
        sec_id = r.json()["id"]
        _created_section_ids.append(sec_id)

        # Restricted video — only QA_RESTRICTED_MOBILE allowed (not our test mobile)
        r = requests.post(f"{API}/admin/recordings/videos", headers=auth, json={
            "section_id": sec_id, "title": "TEST_Restricted",
            "youtube_url": "https://youtu.be/dQw4w9WgXcQ",
            "description": "", "allowed_mobiles": [QA_RESTRICTED_MOBILE],
        }, timeout=10)
        assert r.status_code == 200
        restricted_id = r.json()["id"]
        _created_video_ids.append(restricted_id)

        # Open video — empty allowed_mobiles
        r = requests.post(f"{API}/admin/recordings/videos", headers=auth, json={
            "section_id": sec_id, "title": "TEST_Open",
            "youtube_url": "https://youtu.be/dQw4w9WgXcQ",
            "description": "", "allowed_mobiles": [],
        }, timeout=10)
        assert r.status_code == 200
        open_id = r.json()["id"]
        _created_video_ids.append(open_id)

        # 3. Access with new authorized mobile — should see open, not restricted
        r = requests.post(f"{API}/recordings/access", json={"mobile": QA_AUTHORIZED_MOBILE}, timeout=10)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["mobile"] == QA_AUTHORIZED_MOBILE
        # Find our section
        sections = body["sections"]
        our = [s for s in sections if s["id"] == sec_id]
        assert our, "TEST_QA_Restricted section should be visible (has 1 open video)"
        vids = our[0]["videos"]
        vid_ids = [v["id"] for v in vids]
        assert open_id in vid_ids
        assert restricted_id not in vid_ids
        # Ensure allowed_mobiles not leaked
        assert all("allowed_mobiles" not in v for v in vids)

    def test_section_with_no_visible_videos_is_hidden(self, auth):
        # Section with only restricted (whitelist excludes our test mobile)
        r = requests.post(f"{API}/admin/recordings/sections", headers=auth,
                          json={"name": "TEST_AllRestricted"}, timeout=10)
        sec_id = r.json()["id"]
        _created_section_ids.append(sec_id)

        r = requests.post(f"{API}/admin/recordings/videos", headers=auth, json={
            "section_id": sec_id, "title": "TEST_OnlyRestricted",
            "youtube_url": "https://youtu.be/dQw4w9WgXcQ",
            "description": "", "allowed_mobiles": [QA_RESTRICTED_MOBILE],
        }, timeout=10)
        vid_id = r.json()["id"]
        _created_video_ids.append(vid_id)

        # Access — section should not be returned
        r = requests.post(f"{API}/recordings/access", json={"mobile": QA_AUTHORIZED_MOBILE}, timeout=10)
        assert r.status_code == 200
        section_ids_in_resp = [s["id"] for s in r.json()["sections"]]
        assert sec_id not in section_ids_in_resp


# ============ Expiry ============
class TestExpiry:
    def test_expired_mobile_returns_403(self, auth):
        yesterday = (date.today() - timedelta(days=1)).isoformat()
        r = requests.post(f"{API}/admin/users", headers=auth, json={
            "mobile": QA_EXPIRED_MOBILE, "name": "TEST_Expired", "expires_on": yesterday
        }, timeout=10)
        assert r.status_code in (200, 201), r.text
        if r.json().get("id"):
            _created_user_ids.append(r.json()["id"])

        r = requests.post(f"{API}/recordings/access", json={"mobile": QA_EXPIRED_MOBILE}, timeout=10)
        assert r.status_code == 403, r.text
        detail = r.json().get("detail", "").lower()
        # Either "expired" message OR the generic "not authorized" if backend filters by status
        assert "expired" in detail or "not authorized" in detail


# ============ Regression — Mobile compatibility check still works ============
class TestRegression:
    def test_check_authorized_still_works(self):
        r = requests.get(f"{API}/check-authorized/{ADMIN_MOBILE}", timeout=10)
        assert r.status_code == 200
        body = r.json()
        assert body.get("authorized") is True

    def test_check_unauthorized_random_number(self):
        r = requests.get(f"{API}/check-authorized/1234567890", timeout=10)
        assert r.status_code == 200
        body = r.json()
        assert body.get("authorized") is False
