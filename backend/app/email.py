import json
import logging
import urllib.error
import urllib.request

from app.config import Settings

logger = logging.getLogger(__name__)

RESEND_URL = "https://api.resend.com/emails"


def contact_email_body(name: str, email: str, subject: str, message: str) -> str:
    return (
        "New message from the SHERÉ Moments contact form\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Subject: {subject}\n\n"
        f"{message}\n"
    )


def build_request(settings: Settings, payload: dict) -> urllib.request.Request:
    return urllib.request.Request(
        RESEND_URL,
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {settings.resend_api_key}",
            "Content-Type": "application/json",
            "User-Agent": "shere-moments-api",
        },
        method="POST",
    )


def send_contact_email(settings: Settings, name: str, email: str, subject: str, message: str, opener=urllib.request.urlopen) -> bool:
    if not settings.resend_api_key or not settings.admin_email:
        logger.warning("Contact email skipped: RESEND_API_KEY or ADMIN_EMAIL is not set")
        return False
    payload = {
        "from": settings.resend_from_email,
        "to": [settings.admin_email],
        "reply_to": email,
        "subject": f"Contact form: {subject}",
        "text": contact_email_body(name, email, subject, message),
    }
    try:
        with opener(build_request(settings, payload), timeout=10) as response:
            return 200 <= response.status < 300
    except (urllib.error.URLError, TimeoutError) as err:
        logger.error("Contact email failed: %s", err)
        return False
