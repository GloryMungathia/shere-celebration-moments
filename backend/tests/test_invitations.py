import pytest

from conftest import PHOTO, invitation_body


def create(client, headers, **changes):
    return client.post("/api/invitations", json=invitation_body(**changes), headers=headers)


def test_needs_login(client):
    assert client.get("/api/invitations").status_code == 401
    assert client.post("/api/invitations", json=invitation_body()).status_code == 401


def test_starts_empty(client, auth_headers):
    assert client.get("/api/invitations", headers=auth_headers).json() == []


def test_create_saves_all_fields_as_draft(client, auth_headers):
    res = create(client, auth_headers)
    assert res.status_code == 201
    inv = res.json()
    assert inv["status"] == "draft"
    assert inv["slug"] is None
    assert inv["title"] == "Amani turns 25"
    assert inv["event_date"] == "2026-12-12"
    assert inv["customization"]["font"] == "'Pacifico', cursive"
    assert inv["customization"]["supportsPhoto"] is True
    assert "user_id" not in inv


def test_create_with_only_occasion(client, auth_headers):
    res = client.post("/api/invitations", json={"occasion": "wedding"}, headers=auth_headers)
    assert res.status_code == 201
    assert res.json()["title"] == ""
    assert res.json()["customization"] == {}


def test_text_is_trimmed(client, auth_headers):
    assert create(client, auth_headers, title="  Party  ").json()["title"] == "Party"


@pytest.mark.parametrize(
    "changes",
    [
        {"occasion": "funeral"},
        {"title": "x" * 121},
        {"message": "x" * 2001},
        {"event_date": "not-a-date"},
        {"customization": {"script": "alert(1)"}},
        {"customization": {"font": "x" * 101}},
        {"customization": {"font": 12}},
        {"photo_url": "https://example.com/photo.jpg"},
        {"photo_url": "data:image/gif;base64,R0lGOD=="},
    ],
)
def test_rejects_bad_input(client, auth_headers, changes):
    assert create(client, auth_headers, **changes).status_code == 422


def test_photo_is_saved_and_removed(client, auth_headers):
    inv = create(client, auth_headers, photo_url=PHOTO).json()
    assert inv["photo_url"] == PHOTO
    res = client.put(f"/api/invitations/{inv['id']}", json=invitation_body(photo_url=""), headers=auth_headers)
    assert res.json()["photo_url"] is None


def test_get_and_update(client, auth_headers):
    inv = create(client, auth_headers).json()
    assert client.get(f"/api/invitations/{inv['id']}", headers=auth_headers).json()["id"] == inv["id"]
    res = client.put(
        f"/api/invitations/{inv['id']}",
        json=invitation_body(venue="Ole Sereni", customization={"backgroundColor": "#ffffff"}),
        headers=auth_headers,
    )
    assert res.status_code == 200
    assert res.json()["venue"] == "Ole Sereni"
    assert res.json()["customization"] == {"backgroundColor": "#ffffff"}


def test_list_shows_newest_first(client, auth_headers):
    first = create(client, auth_headers, title="First").json()
    create(client, auth_headers, title="Second")
    client.put(f"/api/invitations/{first['id']}", json=invitation_body(title="First edited"), headers=auth_headers)
    titles = [i["title"] for i in client.get("/api/invitations", headers=auth_headers).json()]
    assert titles == ["First edited", "Second"]


def test_publish_gives_a_link_and_keeps_it(client, auth_headers):
    inv = create(client, auth_headers).json()
    published = client.post(f"/api/invitations/{inv['id']}/publish", headers=auth_headers).json()
    assert published["status"] == "published"
    slug = published["slug"]
    assert len(slug) == 10
    client.put(f"/api/invitations/{inv['id']}", json=invitation_body(title="New title"), headers=auth_headers)
    again = client.post(f"/api/invitations/{inv['id']}/publish", headers=auth_headers).json()
    assert again["slug"] == slug
    assert again["title"] == "New title"


def test_saving_a_published_invitation_keeps_it_published(client, auth_headers):
    inv = create(client, auth_headers).json()
    client.post(f"/api/invitations/{inv['id']}/publish", headers=auth_headers)
    res = client.put(f"/api/invitations/{inv['id']}", json=invitation_body(title="Edit"), headers=auth_headers)
    assert res.json()["status"] == "published"


def test_public_page_only_shows_published(client, auth_headers):
    inv = create(client, auth_headers).json()
    slug = client.post(f"/api/invitations/{inv['id']}/publish", headers=auth_headers).json()["slug"]
    public = client.get(f"/api/public/invitations/{slug}")
    assert public.status_code == 200
    assert public.json()["title"] == "Amani turns 25"
    client.post(f"/api/invitations/{inv['id']}/unpublish", headers=auth_headers)
    assert client.get(f"/api/public/invitations/{slug}").status_code == 404
    assert client.get("/api/public/invitations/doesnotexist").status_code == 404


def test_delete(client, auth_headers):
    inv = create(client, auth_headers).json()
    assert client.delete(f"/api/invitations/{inv['id']}", headers=auth_headers).status_code == 204
    assert client.get(f"/api/invitations/{inv['id']}", headers=auth_headers).status_code == 404


def test_other_users_cannot_touch_my_invitation(client, auth_headers, other_headers):
    inv = create(client, auth_headers).json()
    path = f"/api/invitations/{inv['id']}"
    assert client.get("/api/invitations", headers=other_headers).json() == []
    assert client.get(path, headers=other_headers).status_code == 404
    assert client.put(path, json=invitation_body(), headers=other_headers).status_code == 404
    assert client.post(f"{path}/publish", headers=other_headers).status_code == 404
    assert client.delete(path, headers=other_headers).status_code == 404
    assert client.get(path, headers=auth_headers).status_code == 200


def test_deleting_account_removes_invitations(client, auth_headers):
    create(client, auth_headers)
    client.post("/api/auth/delete-account", json={"password": "secret123"}, headers=auth_headers)
    from app.database import get_db
    from app.main import app
    from app.models import Invitation

    db = next(app.dependency_overrides[get_db]())
    assert db.query(Invitation).count() == 0


def test_extras_are_saved_with_a_second_event(client, auth_headers):
    extras = {
        "intro": " Graduation invite ",
        "event_label": "Graduation Ceremony",
        "closing": "Thank you for being part of my story.",
        "signature": "Dorcas",
        "second_event": {"label": "Celebration Party", "date": "2026-11-22", "time": "14:00", "venue": "AIC Milimani", "address": "Nakuru"},
    }
    inv = create(client, auth_headers, extras=extras).json()
    assert inv["extras"]["intro"] == "Graduation invite"
    assert inv["extras"]["second_event"]["date"] == "2026-11-22"
    again = client.get(f"/api/invitations/{inv['id']}", headers=auth_headers).json()
    assert again["extras"]["second_event"]["venue"] == "AIC Milimani"
    res = client.put(f"/api/invitations/{inv['id']}", json=invitation_body(extras={"intro": "Hi"}), headers=auth_headers)
    assert res.json()["extras"]["second_event"] is None
    slug = client.post(f"/api/invitations/{inv['id']}/publish", headers=auth_headers).json()["slug"]
    assert client.get(f"/api/public/invitations/{slug}").json()["extras"]["intro"] == "Hi"


def test_extras_default_to_empty(client, auth_headers):
    extras = create(client, auth_headers).json()["extras"]
    assert extras["intro"] == ""
    assert extras["second_event"] is None


@pytest.mark.parametrize(
    "extras",
    [
        {"intro": "x" * 121},
        {"closing": "x" * 301},
        {"second_event": {"date": "nope"}},
        {"second_event": {"label": "x" * 61}},
    ],
)
def test_extras_reject_bad_input(client, auth_headers, extras):
    assert create(client, auth_headers, extras=extras).status_code == 422


def test_new_design_options_are_allowed(client, auth_headers):
    custom = {"headingFont": "'Great Vibes', cursive", "accentFont": "'Allura', cursive", "pattern": "florals", "emblem": "none", "layout": "card"}
    assert create(client, auth_headers, customization=custom).json()["customization"] == custom


def test_old_rows_without_extras_show_empty(client, auth_headers):
    from app.database import get_db
    from app.main import app
    from app.models import Invitation

    inv = create(client, auth_headers).json()
    db = next(app.dependency_overrides[get_db]())
    row = db.get(Invitation, inv["id"])
    row.extras = None
    db.commit()
    assert client.get(f"/api/invitations/{inv['id']}", headers=auth_headers).json()["extras"] == {}


def test_missing_extras_column_is_added():
    from sqlalchemy import create_engine, inspect, text

    from app.main import add_missing_columns

    engine = create_engine("sqlite://")
    with engine.begin() as conn:
        conn.execute(text("CREATE TABLE invitations (id VARCHAR(36) PRIMARY KEY)"))
    add_missing_columns(engine)
    add_missing_columns(engine)
    assert "extras" in {c["name"] for c in inspect(engine).get_columns("invitations")}
