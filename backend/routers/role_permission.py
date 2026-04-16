from fastapi import Depends
from core.deps import get_db
from models import Role, Permission, RolePermission
from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException
from schemas.role import RoleBase, RoleRequest, RoleListResponse
from pydantic import BaseModel
from core.permission import require_permission
from schemas.permission import PermissionResponse, RolePermissionUpdate
from schemas.role import UserRoleUpdate
from schemas.role import RoleResponse
from models import UserAccount, UserRole


router = APIRouter(prefix="/api/v1/roles", tags=["roles"])



@router.get("/{role_id}/permissions", response_model=list[PermissionResponse])
def get_role_permissions(
    role_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("read"))
):
    
    role = db.query(Role).filter(
        Role.RoleID == role_id,
        Role.IsActive == True
    ).first()

    if not role:
        raise HTTPException(404, "Role not found")

    permissions = (
        db.query(Permission)
        .join(RolePermission, Permission.PermissionID == RolePermission.PermissionID)
        .filter(RolePermission.RoleID == role_id)
        .all()
    )

    return permissions


@router.post("/{role_id}/assign-permissions")
def assign_permissions_to_role(
    role_id: int,
    data: RolePermissionUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("edit"))
):

    role = db.query(Role).filter(
        Role.RoleID == role_id,
        Role.IsActive == True
    ).first()

    if not role:
        raise HTTPException(404, "Role not found")

    # Xóa permission cũ
    db.query(RolePermission).filter(
        RolePermission.RoleID == role_id
    ).delete()

    # Validate permission tồn tại
    permissions = db.query(Permission).filter(
        Permission.PermissionID.in_(data.PermissionIDs)
    ).all()

    if len(permissions) != len(data.PermissionIDs):
        raise HTTPException(400, "Invalid permission id")

    # Thêm permission mới
    for permission in permissions:
        new_mapping = RolePermission(
            RoleID=role_id,
            PermissionID=permission.PermissionID
        )
        db.add(new_mapping)

    db.commit()

    return {"message": "Role permissions updated successfully"}


@router.get("/user/{user_id}/roles", response_model=list[RoleResponse])
def get_user_roles(
    user_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("read"))
):

    user = db.query(UserAccount).filter(
        UserAccount.UserID == user_id,
        UserAccount.IsActive == True
    ).first()

    if not user:
        raise HTTPException(404, "User not found")

    roles = (
        db.query(Role)
        .join(UserRole, Role.RoleID == UserRole.RoleID)
        .filter(
            UserRole.UserID == user.UserID,
            Role.IsActive == True
        )
        .all()
    )

    return roles


@router.post("/{user_uuid}/assign-roles")
def assign_roles_to_user(
    user_id: str,
    data: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission("edit"))
):

    user = db.query(UserAccount).filter(
        UserAccount.UserID == user_id,
        UserAccount.IsActive == True
    ).first()

    if not user:
        raise HTTPException(404, "User not found")

    # Xóa role cũ
    db.query(UserRole).filter(
        UserRole.UserID == user.UserID
    ).delete()

    # Validate role tồn tại
    roles = db.query(Role).filter(
        Role.RoleID.in_(data.RoleIDs),
        Role.IsActive == True
    ).all()

    if len(roles) != len(data.RoleIDs):
        raise HTTPException(400, "Invalid role id")

    # Thêm role mới
    for role in roles:
        new_mapping = UserRole(
            UserID=user.UserID,
            RoleID=role.RoleID
        )
        db.add(new_mapping)

    db.commit()

    return {"message": "User roles updated successfully"}
