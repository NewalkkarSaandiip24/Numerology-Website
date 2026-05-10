"""Backend tests for Mobile Compatibility admin + check-authorized APIs."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://cosmic-numbers-pro.preview.emergentagent.com").rstrip("/")
ADMIN_MOBILE = "9929059153"
ADMIN_PASSWORD = "2193"
SEEDED_MOBILE = "9876543210"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def token(session):
    r = session.post(f"{BASE_URL}/api/admin/login", json={"mobile": ADMIN_MOBILE, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and isinstance(data["token"], str)
    assert data["mobile"] == ADMIN_MOBILE
    return data["token"]


@pytest.fixture(scope="module")
def auth(token):
    return {"Authorization": f"Bearer {token}"}


# ---- Admin login ----
class TestAdminLogin:
    def test_login_wrong_password(self, session):
        r = session.post(f"{BASE_URL}/api/admin/login", json={"mobile": ADMIN_MOBILE, "password": "0000"})
        assert r.status_code == 401

    def test_login_disallowed_mobile(self, session):
        r = session.post(f"{BASE_URL}/api/admin/login", json={"mobile": "9999999999", "password": ADMIN_PASSWORD})
        assert r.status_code == 401

    def test_login_success_returns_token(self, token):
        assert token and len(token) > 20


# ---- Auth on protected endpoints ----
class TestAuthGuard:
    def test_users_without_token(self, session):
        r = session.get(f"{BASE_URL}/api/admin/users")
        assert r.status_code == 401

    def test_users_with_invalid_token(self, session):
        r = session.get(f"{BASE_URL}/api/admin/users", headers={"Authorization": "Bearer junk.token.value"})
        assert r.status_code == 401


# ---- Authorized users CRUD + duplicate + history ----
class TestAuthorizedUsersCRUD:
    def test_list_users(self, session, auth):
        r = session.get(f"{BASE_URL}/api/admin/users", headers=auth)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)

    def test_add_then_duplicate_then_delete_then_history(self, session, auth):
        test_mobile = "7011220033"
        # Cleanup if previously left active
        r = session.get(f"{BASE_URL}/api/admin/users", headers=auth)
        for u in r.json():
            if u["mobile"] == test_mobile:
                session.delete(f"{BASE_URL}/api/admin/users/{u['id']}", headers=auth)

        # Create
        payload = {"mobile": test_mobile, "name": "TEST_User_QA", "expires_on": "2026-12-31"}
        r = session.post(f"{BASE_URL}/api/admin/users", headers=auth, json=payload)
        assert r.status_code == 200, r.text
        user = r.json()
        assert user["mobile"] == test_mobile
        assert user["name"] == "TEST_User_QA"
        assert user["status"] == "active"
        assert "id" in user
        user_id = user["id"]

        # Verify in list
        r = session.get(f"{BASE_URL}/api/admin/users", headers=auth)
        assert any(u["id"] == user_id for u in r.json())

        # Duplicate active mobile -> 400
        r2 = session.post(f"{BASE_URL}/api/admin/users", headers=auth, json=payload)
        assert r2.status_code == 400

        # Public check-authorized -> True with name + expires_on
        r3 = session.get(f"{BASE_URL}/api/check-authorized/{test_mobile}")
        assert r3.status_code == 200
        d3 = r3.json()
        assert d3["authorized"] is True
        assert d3["name"] == "TEST_User_QA"
        assert d3["expires_on"] == "2026-12-31"

        # Delete (soft)
        r4 = session.delete(f"{BASE_URL}/api/admin/users/{user_id}", headers=auth)
        assert r4.status_code == 200
        assert r4.json().get("ok") is True

        # No longer in active list
        r5 = session.get(f"{BASE_URL}/api/admin/users", headers=auth)
        assert all(u["id"] != user_id for u in r5.json())

        # Now in history
        r6 = session.get(f"{BASE_URL}/api/admin/users/history", headers=auth)
        assert any(u["id"] == user_id and u["status"] == "removed" for u in r6.json())

        # Public check-authorized on the removed mobile -> not_authorized
        r7 = session.get(f"{BASE_URL}/api/check-authorized/{test_mobile}")
        assert r7.status_code == 200
        assert r7.json()["authorized"] is False
        assert r7.json()["reason"] == "not_authorized"

    def test_delete_nonexistent_returns_404(self, session, auth):
        r = session.delete(f"{BASE_URL}/api/admin/users/does-not-exist-id", headers=auth)
        assert r.status_code == 404


# ---- Public check-authorized ----
class TestCheckAuthorizedPublic:
    def test_seeded_mobile_authorized(self, session):
        r = session.get(f"{BASE_URL}/api/check-authorized/{SEEDED_MOBILE}")
        assert r.status_code == 200
        d = r.json()
        assert d["authorized"] is True
        assert d["name"]
        assert d["expires_on"]

    def test_unknown_mobile_not_authorized(self, session):
        r = session.get(f"{BASE_URL}/api/check-authorized/1111111111")
        assert r.status_code == 200
        d = r.json()
        assert d["authorized"] is False
        assert d["reason"] == "not_authorized"

    def test_invalid_mobile_short(self, session):
        r = session.get(f"{BASE_URL}/api/check-authorized/123")
        assert r.status_code == 200
        d = r.json()
        assert d["authorized"] is False
        assert d["reason"] == "invalid"
