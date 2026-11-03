from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Invitation, User
from app.schemas import InvitationIn, InvitationOut
from app.security import get_current_user
from app.slugs import unique_slug

router = APIRouter(prefix="/api/invitations", tags=["invitations"])
public = APIRouter(prefix="/api/public/invitations", tags=["public"])


def own_invitation(invitation_id: str, user: User, db: Session) -> Invitation:
    invitation = db.get(Invitation, invitation_id)
    if invitation is None or invitation.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invitation not found")
    return invitation


@router.get("", response_model=list[InvitationOut])
def list_invitations(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = select(Invitation).where(Invitation.user_id == user.id).order_by(Invitation.updated_at.desc())
    return db.scalars(query).all()


@router.post("", response_model=InvitationOut, status_code=status.HTTP_201_CREATED)
def create_invitation(data: InvitationIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    invitation = Invitation(user_id=user.id, **data.to_columns())
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return invitation


@router.get("/{invitation_id}", response_model=InvitationOut)
def get_invitation(invitation_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return own_invitation(invitation_id, user, db)


@router.put("/{invitation_id}", response_model=InvitationOut)
def update_invitation(
    invitation_id: str, data: InvitationIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    invitation = own_invitation(invitation_id, user, db)
    for key, value in data.to_columns().items():
        setattr(invitation, key, value)
    db.commit()
    db.refresh(invitation)
    return invitation


@router.post("/{invitation_id}/publish", response_model=InvitationOut)
def publish_invitation(invitation_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    invitation = own_invitation(invitation_id, user, db)
    if not invitation.slug:
        invitation.slug = unique_slug(db, Invitation)
    invitation.status = "published"
    db.commit()
    db.refresh(invitation)
    return invitation


@router.post("/{invitation_id}/unpublish", response_model=InvitationOut)
def unpublish_invitation(invitation_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    invitation = own_invitation(invitation_id, user, db)
    invitation.status = "draft"
    db.commit()
    db.refresh(invitation)
    return invitation


@router.delete("/{invitation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invitation(invitation_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.delete(own_invitation(invitation_id, user, db))
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@public.get("/{slug}", response_model=InvitationOut)
def public_invitation(slug: str, db: Session = Depends(get_db)):
    invitation = db.scalar(select(Invitation).where(Invitation.slug == slug, Invitation.status == "published"))
    if invitation is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invitation not found")
    return invitation
