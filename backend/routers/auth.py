from operator import and_, or_
from random import random
from fastapi import APIRouter, Depends, HTTPException, status
# import các thư viện cần thiết từ FastAPI
# import status để sử dụng mã trạng thái HTTP
from fastapi_mail import FastMail, MessageSchema, MessageType
from jose import jwt, JWTError
from fastapi.security import  HTTPAuthorizationCredentials
from core.token import SECRET_KEY, ALGORITHM
from core.deps import security

from sqlalchemy.orm import Session

# khai báo Session để làm việc với database
from db.session import SessionLocal
# khai báo SessionLocal từ database.py để tạo session
from models import  UserAccount, Role, UserRole
# khai báo model User từ models.py

import schemas
from schemas.user import UserBase
from schemas.auth import ChangePasswordRequest, LoginRequest, RegisterRequest, RefreshRequest, VerifyOTPRequest   
# khai báo schema LoginRequest từ schemas.py
from core.token import create_tokens
from core.deps import get_current_user
from core.security import hash_secret, verify_secret, HashPurpose
# khai báo hàm xác thực mật khẩu và tạo token từ auth.py
from core.deps import get_db
from core.redis import redis_client, mail_conf
import json
import random

router = APIRouter(prefix="/api/v1/auth", tags=["account"])
# tạo router với tiền tố /auth


@router.post("/login") # endpoint đăng nhập
def login(data: LoginRequest, db: Session = Depends(get_db)): 
    # hàm đăng nhập nhận dữ liệu theo schema LoginRequest và session db
    user = db.query(UserAccount).filter(
        or_(UserAccount.Username == data.identifier,
            UserAccount.Email == data.identifier)).first()
    # truy vấn người dùng theo email từ database
    if not user.IsActive:
        raise HTTPException(status_code=403, detail="Tài khoản đã bị vô hiệu hóa")
    if not user:
        raise HTTPException(status_code=401, detail="Người dùng không tồn tại")
    # nếu không tìm thấy người dùng, trả về lỗi 401
    if not verify_secret(data.password, user.PasswordHash, HashPurpose.PASSWORD):
        raise HTTPException(status_code=401, detail="Sai mật khẩu")
    # nếu mật khẩu không đúng, trả về lỗi 401
    # raise khác với return ở chỗ để dừng thực thi hàm ngay lập tức
    
    roles_query = (
    db.query(Role)
    .join(UserRole, Role.RoleID == UserRole.RoleID)
    .filter(
        UserRole.UserID == user.UserID,
        Role.IsActive == True
    )
    .all()
)

    roles = [r.RoleName for r in roles_query]


    tokens = create_tokens(user.uuid)
    # tạo token JWT với thông tin người dùng
    return {
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"], 
        "token_type": "bearer",
        "roles": roles}




@router.post("/auth/register-request")
async def register_request(data: RegisterRequest, db: Session = Depends(get_db)):
    # 1. Check trùng Email trong DB chính
    if db.query(UserAccount).filter(UserAccount.Email == data.email).first():
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    if db.query(UserAccount).filter(UserAccount.Username == data.user_name).first():
        raise HTTPException(status_code=400, detail="Username đã tồn tại")
    # 2. Tạo OTP
    otp = f"{random.randint(100000, 999999)}"

    # 3. Lưu thông tin vào Redis (Key là email)
    # Chúng ta lưu cả info (đã hash pass) và otp dưới dạng JSON string
    user_data = {
        "user_name": data.user_name,
        "email": data.email,
        "password": hash_secret(data.password, HashPurpose.PASSWORD), # Hash luôn từ bước này cho an toàn
        "otp": hash_secret(otp, HashPurpose.OTP)
    }
    
    # Lưu với thời hạn 5 phút (300 giây)
    redis_client.setex(f"reg:{data.email}", 300, json.dumps(user_data))

    # 4. Gửi Mail thực tế
    message = MessageSchema(
        subject="Mã xác thực đăng ký tài khoản",
        recipients=[data.email],
        body=f"Mã OTP của bạn là: {otp}. Mã có hiệu lực trong 5 phút.",
        subtype=MessageType.plain
    )
    fm = FastMail(mail_conf)
    await fm.send_message(message)
    return {"message": "Mã xác thực đã được gửi tới email của bạn."}



@router.post("/auth/register-verify")
async def verify_otp(data: VerifyOTPRequest, db: Session = Depends(get_db)):
    # 1. Lấy dữ liệu từ Redis
    raw_data = redis_client.get(f"reg:{data.email}") # email ở đây là để đối chiếu key
    
    if not raw_data:
        raise HTTPException(status_code=400, detail="Mã xác thực đã hết hạn hoặc không tồn tại")

    stored_data = json.loads(raw_data)

    # 2. Kiểm tra OTP
    if not verify_secret(data.otp, stored_data["otp"], HashPurpose.OTP) :
        raise HTTPException(status_code=400, detail="Mã OTP không chính xác")

    # 3. Lưu vào Database chính thức
    new_user = UserAccount(
        Email=data.email,
        PasswordHash=stored_data["password"],
        Username=stored_data["user_name"]
    )

    try:
        db.add(new_user)
        db.commit()
        
        # 4. Đăng ký xong thì xóa ngay key trong Redis
        redis_client.delete(f"reg:{data.email}")
        
        return {"message": "Xác thực thành công. Tài khoản đã được tạo!"}
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Lỗi lưu trữ hệ thống")
    
    
# logout 
@router.post("/logout")
def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode( # giải mã token JWT
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return {"message": "Đăng xuất thành công"} # trả về message thành công
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token") # trả về lỗi 401 nếu token không hợp lệ
    finally:
        credentials.credentials = None # xóa token khỏi credentials
        return {"message": "Đăng xuất thành công"} # trả về message thành công

# refresh token
@router.post("/refresh")
def refresh_access_token(data: RefreshRequest):
    try:
        payload = jwt.decode(
            data.refresh_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except JWTError:
        raise HTTPException(status_code=401, detail="Refresh token không hợp lệ hoặc đã hết hạn")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user_id = payload["sub"]
    return create_tokens(user_id)


