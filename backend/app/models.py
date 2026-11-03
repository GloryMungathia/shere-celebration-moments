import uuid
from datetime import date, datetime, timezone

from sqlalchemy import JSON, Boolean, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def new_id() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    invitations: Mapped[list["Invitation"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    messages: Mapped[list["CelebrationMessage"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Invitation(Base):
    __tablename__ = "invitations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    occasion: Mapped[str] = mapped_column(String(30))
    template_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    title: Mapped[str] = mapped_column(String(120), default="")
    name: Mapped[str] = mapped_column(String(120), default="")
    event_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    event_time: Mapped[str] = mapped_column(String(20), default="")
    venue: Mapped[str] = mapped_column(String(160), default="")
    address: Mapped[str] = mapped_column(String(240), default="")
    message: Mapped[str] = mapped_column(Text, default="")
    photo_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    customization: Mapped[dict] = mapped_column(JSON, default=dict)
    extras: Mapped[dict | None] = mapped_column(JSON, nullable=True, default=dict)
    slug: Mapped[str | None] = mapped_column(String(32), unique=True, index=True, nullable=True)
    status: Mapped[str] = mapped_column(String(10), default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    user: Mapped[User] = relationship(back_populates="invitations")


class CelebrationMessage(Base):
    __tablename__ = "celebration_messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    category: Mapped[str] = mapped_column(String(30))
    recipient_name: Mapped[str] = mapped_column(String(80), default="")
    title: Mapped[str] = mapped_column(String(120), default="")
    message: Mapped[str] = mapped_column(Text, default="")
    sender_name: Mapped[str] = mapped_column(String(80), default="")
    font: Mapped[str | None] = mapped_column(String(100), nullable=True)
    slug: Mapped[str | None] = mapped_column(String(32), unique=True, index=True, nullable=True)
    status: Mapped[str] = mapped_column(String(10), default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    user: Mapped[User] = relationship(back_populates="messages")


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    email: Mapped[str] = mapped_column(String(255))
    subject: Mapped[str] = mapped_column(String(150))
    message: Mapped[str] = mapped_column(Text)
    emailed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
