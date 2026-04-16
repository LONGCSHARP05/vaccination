from typing import List
from db import base
from pydantic import BaseModel, Field

class RoleBase(BaseModel):
    RoleID: int = Field(..., validation_alias= "RoleID")
    RoleName: str = Field(..., validation_alias= "RoleName")
    Description: str = Field(..., validation_alias= "Description")
    IsActive: bool = Field(..., validation_alias= "IsActive")
    
    model_config = {
        "from_attributes": True 
    }
    

class RoleRequest(BaseModel):
    RoleName: str
    Description: str
    IsActive: bool

    model_config = {
        "from_attributes": True
    }
    
class RoleResponse(BaseModel):
    RoleID: int
    RoleName: str
    Description: str | None

    class Config:
        from_attributes = True
        
class UserRoleUpdate(BaseModel):
    RoleIDs: List[int]

    
class RoleListResponse(BaseModel):
    """Trả về danh sách người dùng với phân trang"""
    total: int        # Tổng số người dùng có trong DB
    page_size: int    # Số lượng bản ghi mỗi trang
    data: List[RoleBase] # Danh sách người dùng (chỉ chứa thông tin cơ bản)
