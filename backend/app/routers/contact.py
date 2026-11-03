from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app import email as mailer
from app.config import get_settings
from app.database import get_db
from app.models import ContactMessage
from app.ratelimit import LoginLimiter
from app.schemas import ContactIn

router = APIRouter(prefix="/api/contact", tags=["contact"])

contact_limiter = LoginLimiter(max_attempts=5, lock_seconds=600)


def client_key(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@router.post("", status_code=status.HTTP_201_CREATED)
def send_contact(data: ContactIn, request: Request, db: Session = Depends(get_db)):
    key = client_key(request)
    if contact_limiter.seconds_left(key):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="You have sent a lot of messages. Please try again in a few minutes.",
        )
    contact_limiter.record_failure(key)
    record = ContactMessage(name=data.name, email=data.email, subject=data.subject, message=data.message)
    db.add(record)
    db.commit()
    record.emailed = mailer.send_contact_email(get_settings(), data.name, data.email, data.subject, data.message)
    db.commit()
    return {"message": "Thank you. Your message has been sent."}
