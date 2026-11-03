import re
from datetime import date, datetime
from datetime import date as Day
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PHOTO_PATTERN = re.compile(r"^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$")
PHOTO_MAX_LENGTH = 1_500_000

Occasion = Literal["wedding", "birthday", "graduation", "anniversary", "engagement", "baby-shower", "other"]
MessageCategory = Literal[
    "birthday", "graduation", "wedding", "anniversary", "engagement", "baby", "congratulations", "thank-you", "other"
]
Status = Literal["draft", "published"]

CUSTOMIZATION_KEYS = {
    "primaryColor",
    "accentColor",
    "backgroundColor",
    "textColor",
    "font",
    "layout",
    "supportsPhoto",
    "decorative",
    "borderRadius",
    "headingFont",
    "accentFont",
    "pattern",
    "emblem",
}


def check_password(v: str) -> str:
    if not re.search(r"[A-Za-z]", v) or not re.search(r"\d", v):
        raise ValueError("Password must have at least one letter and one number")
    return v


def check_name(v: str) -> str:
    v = v.strip()
    if not v:
        raise ValueError("Name is required")
    return v


def check_email(v: str) -> str:
    v = v.strip().lower()
    if not EMAIL_PATTERN.match(v):
        raise ValueError("Enter a valid email address")
    return v


class Model(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class RegisterIn(Model):
    name: str = Field(min_length=1, max_length=80)
    email: str = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    remember: bool = True

    @field_validator("name")
    @classmethod
    def clean_name(cls, v: str) -> str:
        return check_name(v)

    @field_validator("password")
    @classmethod
    def strong_password(cls, v: str) -> str:
        return check_password(v)

    @field_validator("email")
    @classmethod
    def clean_email(cls, v: str) -> str:
        return check_email(v)


class LoginIn(Model):
    email: str
    password: str
    remember: bool = False

    @field_validator("email")
    @classmethod
    def clean_email(cls, v: str) -> str:
        return v.strip().lower()


class UserOut(Model):
    id: int
    name: str
    email: str


class AuthOut(Model):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class UpdateMeIn(Model):
    name: str = Field(min_length=1, max_length=80)

    @field_validator("name")
    @classmethod
    def clean_name(cls, v: str) -> str:
        return check_name(v)


class ChangePasswordIn(Model):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)

    @field_validator("new_password")
    @classmethod
    def strong_password(cls, v: str) -> str:
        return check_password(v)


class DeleteAccountIn(Model):
    password: str


class EventIn(Model):
    label: str = Field(default="", max_length=60)
    date: Day | None = None
    time: str = Field(default="", max_length=20)
    venue: str = Field(default="", max_length=160)
    address: str = Field(default="", max_length=240)

    @field_validator("label", "time", "venue", "address")
    @classmethod
    def strip_text(cls, v: str) -> str:
        return v.strip()


class ExtrasIn(Model):
    intro: str = Field(default="", max_length=120)
    event_label: str = Field(default="", max_length=60)
    closing: str = Field(default="", max_length=300)
    signature: str = Field(default="", max_length=120)
    second_event: EventIn | None = None

    @field_validator("intro", "event_label", "closing", "signature")
    @classmethod
    def strip_text(cls, v: str) -> str:
        return v.strip()


class InvitationIn(Model):
    occasion: Occasion
    template_id: str | None = Field(default=None, max_length=80)
    title: str = Field(default="", max_length=120)
    name: str = Field(default="", max_length=120)
    event_date: date | None = None
    event_time: str = Field(default="", max_length=20)
    venue: str = Field(default="", max_length=160)
    address: str = Field(default="", max_length=240)
    message: str = Field(default="", max_length=2000)
    photo_url: str | None = Field(default=None, max_length=PHOTO_MAX_LENGTH)
    customization: dict = Field(default_factory=dict)
    extras: ExtrasIn = Field(default_factory=ExtrasIn)

    def to_columns(self) -> dict:
        values = self.model_dump(exclude={"extras"})
        values["extras"] = self.extras.model_dump(mode="json")
        return values

    @field_validator("title", "name", "event_time", "venue", "address", "message")
    @classmethod
    def strip_text(cls, v: str) -> str:
        return v.strip()

    @field_validator("photo_url")
    @classmethod
    def check_photo(cls, v: str | None) -> str | None:
        if v in (None, ""):
            return None
        if not PHOTO_PATTERN.match(v):
            raise ValueError("Photo must be a JPEG, PNG or WebP image")
        return v

    @field_validator("customization")
    @classmethod
    def check_customization(cls, v: dict) -> dict:
        clean = {}
        for key, value in v.items():
            if key not in CUSTOMIZATION_KEYS:
                raise ValueError(f"Unknown design option: {key}")
            if isinstance(value, bool):
                clean[key] = value
            elif isinstance(value, str) and len(value) <= 100:
                clean[key] = value
            else:
                raise ValueError(f"Design option {key} is not valid")
        return clean


class InvitationOut(Model):
    id: str
    occasion: str
    template_id: str | None
    title: str
    name: str
    event_date: date | None
    event_time: str
    venue: str
    address: str
    message: str
    photo_url: str | None
    customization: dict
    extras: dict
    slug: str | None
    status: Status
    created_at: datetime
    updated_at: datetime

    @field_validator("extras", mode="before")
    @classmethod
    def empty_extras(cls, v):
        return v or {}


class MessageIn(Model):
    category: MessageCategory
    recipient_name: str = Field(default="", max_length=80)
    title: str = Field(default="", max_length=120)
    message: str = Field(default="", max_length=4000)
    sender_name: str = Field(default="", max_length=80)
    font: str | None = Field(default=None, max_length=100)

    @field_validator("recipient_name", "title", "message", "sender_name")
    @classmethod
    def strip_text(cls, v: str) -> str:
        return v.strip()


class MessageOut(Model):
    id: str
    category: str
    recipient_name: str
    title: str
    message: str
    sender_name: str
    font: str | None
    slug: str | None
    status: Status
    created_at: datetime
    updated_at: datetime


class ContactIn(Model):
    name: str = Field(min_length=1, max_length=80)
    email: str = Field(max_length=255)
    subject: str = Field(min_length=1, max_length=150)
    message: str = Field(min_length=1, max_length=5000)

    @field_validator("name", "subject", "message")
    @classmethod
    def required_text(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("This field is required")
        return v

    @field_validator("email")
    @classmethod
    def clean_email(cls, v: str) -> str:
        return check_email(v)
