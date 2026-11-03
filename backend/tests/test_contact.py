import json
import urllib.error

import pytest

from app import email as mailer
from app.config import Settings
from app.database import get_db
from app.main import app
from app.models import ContactMessage

BODY = {"name": "Achieng", "email": "achieng@example.com", "subject": "Hello", "message": "Love the invitations"}


def saved(client):
    db = next(app.dependency_overrides[get_db]())
    return db.query(ContactMessage).all()


class FakeResponse:
    def __init__(self, status):
        self.status = status

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False


def test_contact_is_saved_even_without_email_setup(client, monkeypatch):
    monkeypatch.setattr(mailer, "send_contact_email", lambda *a, **k: False)
    res = client.post("/api/contact", json=BODY)
    assert res.status_code == 201
    assert res.json()["message"] == "Thank you. Your message has been sent."
    rows = saved(client)
    assert len(rows) == 1
    assert rows[0].emailed is False


def test_contact_marks_emailed(client, monkeypatch):
    calls = []
    monkeypatch.setattr(mailer, "send_contact_email", lambda *a, **k: calls.append(a) or True)
    client.post("/api/contact", json=BODY)
    assert saved(client)[0].emailed is True
    assert calls[0][1:] == ("Achieng", "achieng@example.com", "Hello", "Love the invitations")


@pytest.mark.parametrize(
    "changes",
    [{"email": "bad"}, {"name": "  "}, {"subject": ""}, {"message": "   "}, {"message": "x" * 5001}],
)
def test_contact_rejects_bad_input(client, changes):
    assert client.post("/api/contact", json={**BODY, **changes}).status_code == 422


def test_contact_limit(client, monkeypatch):
    monkeypatch.setattr(mailer, "send_contact_email", lambda *a, **k: False)
    for _ in range(5):
        assert client.post("/api/contact", json=BODY).status_code == 201
    res = client.post("/api/contact", json=BODY)
    assert res.status_code == 429
    assert client.post("/api/contact", json=BODY, headers={"X-Forwarded-For": "10.0.0.9, 1.1.1.1"}).status_code == 201


def settings(**changes):
    base = {"resend_api_key": "re_test", "admin_email": "owner@example.com", "resend_from_email": "SHERÉ <hi@resend.dev>"}
    base.update(changes)
    return Settings(**base)


def test_send_skips_without_key():
    assert mailer.send_contact_email(settings(resend_api_key=""), "a", "b@c.d", "s", "m") is False
    assert mailer.send_contact_email(settings(admin_email=""), "a", "b@c.d", "s", "m") is False


def test_send_builds_resend_request():
    seen = {}

    def opener(request, timeout):
        seen["request"] = request
        seen["timeout"] = timeout
        return FakeResponse(200)

    assert mailer.send_contact_email(settings(), "Achieng", "achieng@example.com", "Hello", "Hi there", opener=opener) is True
    request = seen["request"]
    payload = json.loads(request.data)
    assert request.full_url == "https://api.resend.com/emails"
    assert request.get_header("Authorization") == "Bearer re_test"
    assert payload["to"] == ["owner@example.com"]
    assert payload["reply_to"] == "achieng@example.com"
    assert payload["subject"] == "Contact form: Hello"
    assert "Hi there" in payload["text"]
    assert seen["timeout"] == 10


def test_send_reports_failure():
    def broken(request, timeout):
        raise urllib.error.URLError("down")

    assert mailer.send_contact_email(settings(), "a", "b@c.d", "s", "m", opener=broken) is False
    assert mailer.send_contact_email(settings(), "a", "b@c.d", "s", "m", opener=lambda r, timeout: FakeResponse(500)) is False
