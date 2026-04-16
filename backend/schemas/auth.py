# validate dữ liệu sử dụng Pydantic
from dataclasses import field
import email
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator
import re
# khai báo các schema dùng trong ứng dụng
# BaseModel từ Pydantic để tạo các schema
# EmailStr để xác thực định dạng email
class LoginRequest(BaseModel): # schema cho yêu cầu đăng nhập
    identifier: str = Field(..., min_length= 3, max_length= 100, description="Tên đăng nhập hoặc email của bạn")
    password: str = Field(..., min_length= 6, description="Mật khẩu đăng nhập")
    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "identifier": "thlong",
                    "password": "123456"
                }
            ]
        }
# Schema trả dữ liệu (Response) - Lọc bỏ password
   
    
class RegisterRequest(BaseModel): 
    # Tên đăng nhập từ 3-50 ký tự, chỉ chứa chữ và số
    user_name: str = Field(..., min_length=3, max_length=50, examples=["nguyenvanthanh"])
    # Mật khẩu tối thiểu 8 ký tự
    password: str = Field(..., min_length=6)
    email: EmailStr
    # Ví dụ validate logic phức tạp hơn bằng @field_validator
    @field_validator('user_name')
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        if not v.isalnum():
            raise ValueError('Username chỉ được chứa chữ cái và số')
        return v
    class Config: # Cho phép Schema đọc dữ liệu từ các object Alchemy (nếu cần dùng làm Response)
        from_attributes = True 
        
class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
class RefreshRequest(BaseModel):
    refresh_token: str
    
    
class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)
    
class ForgetPasswordRequest(BaseModel):
    email: EmailStr
    
# schema để đổi mật khẩu mới
class ResetPasswordConfirm(BaseModel):
    email: EmailStr
    otp: str = Field(..., description="Mã 6 số nhận được qua email")
    new_password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)