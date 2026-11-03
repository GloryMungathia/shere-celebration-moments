from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.config import get_settings
from app.database import Base, engine
from app.routers import auth, contact, invitations, messages


NEW_COLUMNS = {"invitations": {"extras": "JSON"}}


def add_missing_columns(bind) -> None:
    inspector = inspect(bind)
    for table, columns in NEW_COLUMNS.items():
        existing = {c["name"] for c in inspector.get_columns(table)}
        for name, kind in columns.items():
            if name not in existing:
                with bind.begin() as conn:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {kind}"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    add_missing_columns(engine)
    yield


app = FastAPI(title="SHERÉ Moments API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth.router)
app.include_router(invitations.router)
app.include_router(invitations.public)
app.include_router(messages.router)
app.include_router(messages.public)
app.include_router(contact.router)


@app.get("/api/health", tags=["health"])
def health():
    return {"status": "ok"}
