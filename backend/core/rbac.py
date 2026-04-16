from fastapi import Depends, HTTPException
from core.deps import get_current_user
from core.security_models import CurrentUser


def require_role(required_role: str):

    def checker(current_user: CurrentUser = Depends(get_current_user)):

        if required_role not in current_user.roles:
            raise HTTPException(403, "Insufficient permissions")

        return current_user

    return checker
