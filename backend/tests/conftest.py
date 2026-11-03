import os

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["SECRET_KEY"] = "test-secret-key-that-is-long-enough-1234"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.ratelimit import login_limiter
from app.routers.contact import contact_limiter

PHOTO = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q=="


@pytest.fixture
def client():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(bind=engine)
    TestSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

    def override_get_db():
        db = TestSession()
        try:
            yield db
        finally:
            db.close()

    login_limiter.clear()
    contact_limiter.clear()
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


def register(client, email="amani@example.com", password="secret123", name="Amani"):
    return client.post("/api/auth/register", json={"name": name, "email": email, "password": password})


@pytest.fixture
def auth_headers(client):
    token = register(client).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def other_headers(client):
    token = register(client, email="baraka@example.com", name="Baraka").json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def invitation_body(**changes):
    body = {
        "occasion": "birthday",
        "template_id": "birthday-festive-confetti",
        "title": "Amani turns 25",
        "name": "Amani",
        "event_date": "2026-12-12",
        "event_time": "18:00",
        "venue": "The Alchemist",
        "address": "Westlands, Nairobi",
        "message": "Come celebrate with me",
        "customization": {"primaryColor": "#be123c", "font": "'Pacifico', cursive", "supportsPhoto": True},
    }
    body.update(changes)
    return body


def message_body(**changes):
    body = {
        "category": "graduation",
        "recipient_name": "Wanjiru",
        "title": "Congratulations!",
        "message": "You did it. So proud of you.",
        "sender_name": "Amani",
        "font": "'Dancing Script', cursive",
    }
    body.update(changes)
    return body
