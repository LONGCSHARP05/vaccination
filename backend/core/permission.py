from fastapi import Depends, HTTPException
from core.deps import get_current_user
from core.security_models import CurrentUser


def require_permission(required_permission: str):

    def checker(current_user: CurrentUser = Depends(get_current_user)):

        if required_permission not in current_user.permissions:
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions"
            )

        return current_user

    return checker
