import secrets

from sqlalchemy import select
from sqlalchemy.orm import Session

ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"


def random_slug(length: int = 10) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))


def unique_slug(db: Session, model, tries: int = 5) -> str:
    for _ in range(tries):
        slug = random_slug()
        if db.scalar(select(model.id).where(model.slug == slug)) is None:
            return slug
    raise RuntimeError("Could not create a unique link")
