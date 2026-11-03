import pytest

from app.models import CelebrationMessage
from app.slugs import ALPHABET, random_slug, unique_slug
from conftest import message_body


def create(client, headers, **changes):
    return client.post("/api/messages", json=message_body(**changes), headers=headers)


def test_needs_login(client):
    assert client.get("/api/messages").status_code == 401


def test_create_and_list(client, auth_headers):
    res = create(client, auth_headers)
    assert res.status_code == 201
    msg = res.json()
    assert msg["status"] == "draft"
    assert msg["font"] == "'Dancing Script', cursive"
    assert [m["id"] for m in client.get("/api/messages", headers=auth_headers).json()] == [msg["id"]]


@pytest.mark.parametrize(
    "changes",
    [{"category": "funeral"}, {"message": "x" * 4001}, {"recipient_name": "x" * 81}, {"font": "x" * 101}],
)
def test_rejects_bad_input(client, auth_headers, changes):
    assert create(client, auth_headers, **changes).status_code == 422


def test_update(client, auth_headers):
    msg = create(client, auth_headers).json()
    res = client.put(f"/api/messages/{msg['id']}", json=message_body(title="Well done"), headers=auth_headers)
    assert res.json()["title"] == "Well done"
    assert client.get(f"/api/messages/{msg['id']}", headers=auth_headers).json()["title"] == "Well done"


def test_publish_keeps_link_and_public_page(client, auth_headers):
    msg = create(client, auth_headers).json()
    slug = client.post(f"/api/messages/{msg['id']}/publish", headers=auth_headers).json()["slug"]
    assert client.post(f"/api/messages/{msg['id']}/publish", headers=auth_headers).json()["slug"] == slug
    assert client.get(f"/api/public/messages/{slug}").json()["recipient_name"] == "Wanjiru"
    client.post(f"/api/messages/{msg['id']}/unpublish", headers=auth_headers)
    assert client.get(f"/api/public/messages/{slug}").status_code == 404


def test_draft_has_no_public_page(client, auth_headers):
    create(client, auth_headers)
    assert client.get("/api/public/messages/anything").status_code == 404


def test_delete(client, auth_headers):
    msg = create(client, auth_headers).json()
    assert client.delete(f"/api/messages/{msg['id']}", headers=auth_headers).status_code == 204
    assert client.get("/api/messages", headers=auth_headers).json() == []


def test_other_users_cannot_touch_my_message(client, auth_headers, other_headers):
    msg = create(client, auth_headers).json()
    path = f"/api/messages/{msg['id']}"
    assert client.get(path, headers=other_headers).status_code == 404
    assert client.put(path, json=message_body(), headers=other_headers).status_code == 404
    assert client.post(f"{path}/unpublish", headers=other_headers).status_code == 404
    assert client.delete(path, headers=other_headers).status_code == 404


def test_random_slug_uses_clear_letters():
    slug = random_slug()
    assert len(slug) == 10
    assert all(c in ALPHABET for c in slug)


def test_unique_slug_gives_up_after_many_clashes(monkeypatch):
    class AlwaysTaken:
        def scalar(self, query):
            return "taken"

    with pytest.raises(RuntimeError):
        unique_slug(AlwaysTaken(), CelebrationMessage)
