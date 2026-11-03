from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import CelebrationMessage, User
from app.schemas import MessageIn, MessageOut
from app.security import get_current_user
from app.slugs import unique_slug

router = APIRouter(prefix="/api/messages", tags=["messages"])
public = APIRouter(prefix="/api/public/messages", tags=["public"])


def own_message(message_id: str, user: User, db: Session) -> CelebrationMessage:
    message = db.get(CelebrationMessage, message_id)
    if message is None or message.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    return message


@router.get("", response_model=list[MessageOut])
def list_messages(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = (
        select(CelebrationMessage)
        .where(CelebrationMessage.user_id == user.id)
        .order_by(CelebrationMessage.updated_at.desc())
    )
    return db.scalars(query).all()


@router.post("", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def create_message(data: MessageIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    message = CelebrationMessage(user_id=user.id, **data.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("/{message_id}", response_model=MessageOut)
def get_message(message_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return own_message(message_id, user, db)


@router.put("/{message_id}", response_model=MessageOut)
def update_message(message_id: str, data: MessageIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    message = own_message(message_id, user, db)
    for key, value in data.model_dump().items():
        setattr(message, key, value)
    db.commit()
    db.refresh(message)
    return message


@router.post("/{message_id}/publish", response_model=MessageOut)
def publish_message(message_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    message = own_message(message_id, user, db)
    if not message.slug:
        message.slug = unique_slug(db, CelebrationMessage)
    message.status = "published"
    db.commit()
    db.refresh(message)
    return message


@router.post("/{message_id}/unpublish", response_model=MessageOut)
def unpublish_message(message_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    message = own_message(message_id, user, db)
    message.status = "draft"
    db.commit()
    db.refresh(message)
    return message


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(message_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.delete(own_message(message_id, user, db))
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@public.get("/{slug}", response_model=MessageOut)
def public_message(slug: str, db: Session = Depends(get_db)):
    message = db.scalar(
        select(CelebrationMessage).where(CelebrationMessage.slug == slug, CelebrationMessage.status == "published")
    )
    if message is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    return message
