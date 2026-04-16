import datetime
from pydantic import BaseModel, Field, EmailStr
from typing import List
from uuid import UUID



class UserBase(BaseModel):
    """Base schema cho user"""
    uuid: UUID = Field(..., validation_alias="uuid")
    username: str = Field(..., validation_alias="Username")
    email: str = Field(..., validation_alias="Email")
    
    model_config = {
        "from_attributes": True
    }
    
class UserProfileResponse(BaseModel):
    username: str = Field(..., validation_alias="Username")
    email: str = Field(..., validation_alias="Email")
    
    model_config = {
        "from_attributes": True 
    }
class UserDetailResponse(UserBase):
    user_id: int = Field(..., validation_alias="UserID")
    is_active: bool = Field(..., validation_alias="IsActive")
    password_hash: str = Field(..., validation_alias="PasswordHash")
    # Thêm các trường chi tiết khác nếu cần
    created_at: datetime.datetime = Field(..., validation_alias="CreatedAt")
    updated_at: datetime.datetime | None = Field(None, validation_alias="UpdatedAt")
    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }


class UserListResponse(BaseModel):
    """Trả về danh sách người dùng với phân trang"""
    total: int        # Tổng số người dùng có trong DB
    page_size: int    # Số lượng bản ghi mỗi trang
    data: List[UserDetailResponse] # Danh sách người dùng (chỉ chứa thông tin cơ bản)

class UserCreateRequest(BaseModel):
    """Admin tạo người dùng mới"""
    email: EmailStr = Field(...)
    user_name: str = Field(...)
    password: str = Field(...)
    is_active: bool = Field(...)
    # Thêm các trường chi tiết khác nếu cần
    model_config = {
        "from_attributes": True
    }
    
    

