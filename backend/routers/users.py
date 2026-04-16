from datetime import datetime
import re

from fastapi import APIRouter, Depends, HTTPException

from models.patient import Patient
from schemas.user import  UserBase, UserCreateRequest, UserListResponse, UserDetailResponse, UserProfileResponse
from models.useraccount import UserAccount
from schemas.auth import ChangePasswordRequest

from db.session import SessionLocal
from core.security import verify_secret, hash_secret, HashPurpose
from core.deps import get_current_user, get_db
from core.permission import require_permission
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from uuid import UUID



router = APIRouter(prefix="/api/v1/user", tags=["users"])



@router.get("/me", response_model=UserProfileResponse)
def get_profile(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """Lấy profile cá nhân của người dùng hiện tại"""
    user = db.query(UserAccount).filter(UserAccount.UserID == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin người dùng")
    
    return user



@router.post("/") # nếu return text thì không nên khai báo response_model, nếu return object thì nên khai báo response_model để FastAPI tự động chuyển đổi và validate dữ liệu trả về
def create_user(data: UserCreateRequest,
                db: Session = Depends(get_db)
                ):
    """Admin: Tạo người dùng mới"""
    user = db.query(UserAccount).filter(or_(UserAccount.Email == data.email,
                                            UserAccount.Username == data.user_name)).first()
    if user:
        raise HTTPException(status_code=400, detail= "Email hoặc tên đăng nhập đã tồn tại. Vui lòng nhập lại")
    new_user = UserAccount(
        Username = data.user_name,
        Email = data.email,
        PasswordHash = hash_secret(data.password, HashPurpose.PASSWORD),
        IsActive = data.is_active
        )
    db.add(new_user)
    db.commit()
    return {"message":"Tạo người dùng mới thành công"}

@router.get("/{user_id}", response_model = UserDetailResponse)
def get_user(user_id: int,
             db: Session = Depends(get_db)):
    """Admin: Lấy chi tiết người dùng theo user_id"""
    user = db.query(UserAccount).filter(and_(UserAccount.UserID == user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")    
    return user



@router.get("/list-users/", response_model=UserListResponse)
def list_users(skip: int = 0,
               limit: int = 10,
               db: Session = Depends(get_db)):
    """Admin: Lấy danh sách người dùng với phân trang"""
    users = db.query(UserAccount).offset(skip).limit(limit).all()
    total = db.query(UserAccount).count()
    return {
        "total": total,
        "page_size": limit,
        "data": users
    }
    
    

   
@router.patch("/{user_id}/status")
def disable_or_enable_user(
    user_id: int,
    db: Session = Depends(get_db)):
    """Admin: Vô hiệu hóa hoặc kích hoạt người dùng"""
    user = db.query(UserAccount).filter(UserAccount.UserID == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    user.IsActive = not user.IsActive  # Đảo ngược trạng thái
    db.add(user)
    db.commit()
    return {"message": f"Người dùng đã được {'kích hoạt' if user.IsActive else 'vô hiệu hóa'} thành công."}

