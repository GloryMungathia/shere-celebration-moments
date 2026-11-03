import pytest

from app.config import Settings, check_settings, normalize_db_url, split_origins
from app.ratelimit import LoginLimiter, wait_message
from app.security import verify_password
from conftest import register


def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}


def test_register_returns_token_and_user(client):
    res = register(client)
    assert res.status_code == 201
    body = res.json()
    assert body["access_token"]
    assert body["user"] == {"id": 1, "name": "Amani", "email": "amani@example.com"}


def test_register_lowercases_email(client):
    res = register(client, email="  Amani@Example.COM ")
    assert res.json()["user"]["email"] == "amani@example.com"


def test_same_email_cannot_register_twice(client):
    register(client)
    res = register(client, email="AMANI@example.com")
    assert res.status_code == 409
    assert res.json()["detail"] == "An account with this email already exists"


@pytest.mark.parametrize(
    "body",
    [
        {"name": "Amani", "email": "not-an-email", "password": "secret123"},
        {"name": "Amani", "email": "a@b.co", "password": "short1"},
        {"name": "Amani", "email": "a@b.co", "password": "onlyletters"},
        {"name": "Amani", "email": "a@b.co", "password": "12345678"},
        {"name": "   ", "email": "a@b.co", "password": "secret123"},
    ],
)
def test_register_rejects_bad_input(client, body):
    assert client.post("/api/auth/register", json=body).status_code == 422


def test_login_works(client):
    register(client)
    res = client.post("/api/auth/login", json={"email": "AMANI@example.com", "password": "secret123"})
    assert res.status_code == 200
    assert res.json()["user"]["name"] == "Amani"


def test_login_wrong_password(client):
    register(client)
    res = client.post("/api/auth/login", json={"email": "amani@example.com", "password": "wrong1234"})
    assert res.status_code == 401
    assert res.json()["detail"] == "Wrong email or password"


def test_login_unknown_email(client):
    res = client.post("/api/auth/login", json={"email": "nobody@example.com", "password": "secret123"})
    assert res.status_code == 401


def test_login_pauses_after_five_wrong_tries(client):
    register(client)
    for _ in range(5):
        client.post("/api/auth/login", json={"email": "amani@example.com", "password": "wrong1234"})
    res = client.post("/api/auth/login", json={"email": "amani@example.com", "password": "secret123"})
    assert res.status_code == 429
    assert res.json()["detail"] == "Too many wrong attempts. Try again in 3 minutes."
    assert res.headers["Retry-After"]


def test_good_login_resets_failures(client):
    register(client)
    for _ in range(4):
        client.post("/api/auth/login", json={"email": "amani@example.com", "password": "wrong1234"})
    assert client.post("/api/auth/login", json={"email": "amani@example.com", "password": "secret123"}).status_code == 200
    client.post("/api/auth/login", json={"email": "amani@example.com", "password": "wrong1234"})
    assert client.post("/api/auth/login", json={"email": "amani@example.com", "password": "secret123"}).status_code == 200


def test_limiter_unlocks_after_wait():
    now = [100.0]
    limiter = LoginLimiter(max_attempts=2, lock_seconds=60, clock=lambda: now[0])
    limiter.record_failure("a")
    limiter.record_failure("a")
    assert limiter.seconds_left("a") == 61
    now[0] += 61
    assert limiter.seconds_left("a") == 0
    assert limiter.failures == {}


def test_wait_message_units():
    assert wait_message(30) == "Too many wrong attempts. Try again in 1 minute."
    assert wait_message(180) == "Too many wrong attempts. Try again in 3 minutes."


def test_me_needs_token(client):
    assert client.get("/api/auth/me").status_code == 401


def test_me_rejects_bad_token(client):
    res = client.get("/api/auth/me", headers={"Authorization": "Bearer not-a-token"})
    assert res.status_code == 401
    assert res.json()["detail"] == "Please log in again"


def test_me_returns_user(client, auth_headers):
    assert client.get("/api/auth/me", headers=auth_headers).json()["email"] == "amani@example.com"


def test_token_for_deleted_user_is_rejected(client, auth_headers):
    client.post("/api/auth/delete-account", json={"password": "secret123"}, headers=auth_headers)
    assert client.get("/api/auth/me", headers=auth_headers).status_code == 401


def test_update_name(client, auth_headers):
    res = client.patch("/api/auth/me", json={"name": "  Amani K  "}, headers=auth_headers)
    assert res.json()["name"] == "Amani K"
    assert client.patch("/api/auth/me", json={"name": "  "}, headers=auth_headers).status_code == 422


def test_change_password(client, auth_headers):
    res = client.post(
        "/api/auth/change-password",
        json={"current_password": "secret123", "new_password": "newpass456"},
        headers=auth_headers,
    )
    assert res.status_code == 204
    assert client.post("/api/auth/login", json={"email": "amani@example.com", "password": "newpass456"}).status_code == 200


def test_change_password_wrong_current(client, auth_headers):
    res = client.post(
        "/api/auth/change-password",
        json={"current_password": "wrong1234", "new_password": "newpass456"},
        headers=auth_headers,
    )
    assert res.status_code == 400
    assert res.json()["detail"] == "Current password is wrong"


def test_change_password_must_differ(client, auth_headers):
    res = client.post(
        "/api/auth/change-password",
        json={"current_password": "secret123", "new_password": "secret123"},
        headers=auth_headers,
    )
    assert res.status_code == 400


def test_delete_account_needs_right_password(client, auth_headers):
    res = client.post("/api/auth/delete-account", json={"password": "wrong1234"}, headers=auth_headers)
    assert res.status_code == 400


def test_password_is_not_stored_plain(client):
    from app.models import User
    from app.database import get_db
    from app.main import app

    register(client)
    db = next(app.dependency_overrides[get_db]())
    user = db.query(User).first()
    assert "secret123" not in user.password_hash
    assert verify_password("secret123", user.password_hash)
    assert not verify_password("secret123", "broken")
    assert not verify_password("secret123", "md5$a$b")


def test_settings_helpers():
    assert normalize_db_url("postgres://u:p@h/db") == "postgresql+psycopg://u:p@h/db"
    assert normalize_db_url("postgresql://u:p@h/db") == "postgresql+psycopg://u:p@h/db"
    assert normalize_db_url("sqlite:///x.db") == "sqlite:///x.db"
    assert split_origins("https://a.app/, https://b.app") == ["https://a.app", "https://b.app"]


def test_hosted_database_needs_secret():
    with pytest.raises(RuntimeError):
        check_settings(Settings(database_url="postgresql+psycopg://h/db", secret_key="change-me-in-production"))
    assert check_settings(Settings(database_url="postgresql+psycopg://h/db", secret_key="real-secret"))


def test_get_db_opens_and_closes_a_session():
    from app.database import get_db as real_get_db

    gen = real_get_db()
    session = next(gen)
    assert session.is_active
    with pytest.raises(StopIteration):
        next(gen)
