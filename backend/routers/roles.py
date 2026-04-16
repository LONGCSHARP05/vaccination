from fastapi import Depends
from core.deps import get_db
from models import Role, Permission, RolePermission
from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException
from schemas.role import RoleBase, RoleRequest, RoleListResponse
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/roles", tags=["roles"])

# * **GET** `/api/v1/roles/` – Danh sách role
# * **POST** `/api/v1/roles/` – Tạo role
# * **GET** `/api/v1/roles/{role_id}` – Lấy role
# * **PATCH** `/api/v1/roles/{role_id}` – Cập nhật role
# * **DELETE** `/api/v1/roles/{role_id}` – Xóa role
# * **GET** `/api/v1/roles/{role_id}/permissions` – Lấy quyền của role
# * **PUT** `/api/v1/roles/{role_id}/permissions` – Gán quyền cho role
# * **GET** `/api/v1/roles/users/{user_uuid}/roles` – Lấy role của user
# * **PUT** `/api/v1/roles/users/{user_uuid}/roles` – Cập nhật role cho user

@router.post("/", response_model=RoleBase)
def create_role(data: RoleRequest, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.RoleName == data.RoleName.strip()).first()
    if role:
        raise HTTPException(status_code = 400, detail="RoleName đã tồn tại")
    if not data.RoleName:
        raise {"Vui lòng điền RoleName"}
    if not data.IsActive:
        raise {"Vui lòng chọn trạng thái"}
    new_role = Role(
        RoleName = data.RoleName,
        Description = data.Description,
        IsActive = data.IsActive
    )
    db.add(new_role)
    db.commit()
    return new_role

@router.get("/{role_id}", response_model= RoleBase)
def get_role(role_id: int, db: Session = Depends(get_db)):
    current_role = db.query(Role).filter(Role.RoleID == role_id).first()
    if not current_role:
        raise HTTPException(status_code=400, detail="Không tìm thấy role")
    return current_role


@router.get("/", response_model=RoleListResponse)
def get_list_roles(skip: int = 0, limit: int = 10, db: Session =Depends(get_db)):
    roles = db.query(Role).offset(skip).limit(limit).all()
    total = db.query(Role).count()

    if not roles:
        raise HTTPException(status_code=400, detail="Không tìm thấy roles nào!")
    return {
        "total": total,
        "page_size": limit,
        "data": roles
    }

@router.put("/{role_id}", response_model=RoleBase)
def edit_role(role_id: int, data: RoleRequest, db: Session = Depends(get_db)):
    current_role = db.query(Role).filter(Role.RoleID == role_id).first()
    if not current_role:
        raise HTTPException(status_code=404, detail="Không tìm thấy role")
    exists_role = db.query(Role).filter(
        Role.RoleName == data.RoleName,
        Role.RoleID != role_id
        ).first()
    if exists_role:
        raise HTTPException(status_code=400, detail="RoleName đã tồn tại")
    current_role.RoleName = data.RoleName
    current_role.Description = data.Description
    current_role.IsActive = data.IsActive
    
    db.add(current_role)
    db.commit()
    db.refresh(current_role)
    
    return current_role