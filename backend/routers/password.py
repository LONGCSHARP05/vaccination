from fastapi import  HTTPException, APIRouter, status, Depends

from fastapi_mail import FastMail, MessageSchema, MessageType
from sqlalchemy.orm import Session
import models
import json
import random
from core.redis import redis_client, mail_conf
from core.deps import get_current_user
from core.security import hash_secret, HashPurpose, verify_secret
from core.deps import get_db
from models import UserAccount
from schemas.auth import ResetPasswordConfirm, ForgetPasswordRequest, ChangePasswordRequest
from core.security_models import CurrentUser




router = APIRouter(prefix = "/api/v1/auth", tags = ["password"])

@router.post("/me/change-password")
def change_password(data: ChangePasswordRequest, user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """Người dùng đổi mật khẩu cá nhân"""
    # 1. Lấy thông tin người dùng từ database
    current_user = db.query(UserAccount).filter(UserAccount.UserID == user.id).first()
    # 2. Xác thực mật khẩu cũ
    
    if not verify_secret(data.old_password, current_user.PasswordHash, HashPurpose.PASSWORD):
        raise HTTPException(status_code=400, detail="Mật khẩu cũ không chính xác")
    
    if data.new_password == data.old_password:
        raise HTTPException(status_code=400, detail="Mật khẩu mới trùng với mật khẩu cũ")
    
    # confirm mật khẩu mới
    if not data.new_password == data.confirm_password :
        raise HTTPException(status_code=400, detail= "Vui lòng xác nhận lại mật khẩu")
    # 3. Cập nhật mật khẩu mới và thời gian đổi
    current_user.PasswordHash = hash_secret(data.new_password, HashPurpose.PASSWORD)
    db.commit()
    return {"msg": "Đổi mật khẩu thành công"}

@router.post("/forgot-password")
async def forget_password (
    data: ForgetPasswordRequest, db: Session = Depends(get_db)
):
    user = db.query(UserAccount).filter(UserAccount.Email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail= "Email không tồn tại trong hệ thống")
    # tạo otp
    otp = f"{random.randint(100000, 999999)}"
    reset_token = hash_secret(otp, HashPurpose.OTP)
    # 3. Lưu thông tin vào Redis (Key là email)
    
    # Lưu vào Redis với tiền tố 'reset:' (Hết hạn sau 10 phút)
    
    redis_client.setex(f"reset:{data.email}", 600, reset_token)

    # 4. Gửi Mail thực tế
    message = MessageSchema(
        subject="Mã xác thực đổi mật khẩu tài khoản",
        recipients=[data.email],
        body= f"Mã OTP của bạn là: {otp}. Mã có hiệu lực trong 10 phút.",
        subtype=MessageType.plain
    )
    
    fm = FastMail(mail_conf)
    await fm.send_message(message)
    return {"message": "Mã xác thực đã được gửi tới email của bạn."}

@router.post("/auth/reset-password-confirm")
async def reset_password_confirm( data: ResetPasswordConfirm, db: Session = Depends(get_db)):
    # 1. Lấy mã từ Redis
    stored_token = redis_client.get(f"reset:{data.email}") # stored_token lấy otp được lưu trong redis

    if not stored_token:
        raise HTTPException(status_code=400, detail="Mã đã hết hạn hoặc không tồn tại")

    # kiểm tra reset_token
    if not verify_secret(data.otp, stored_token, HashPurpose.OTP) :
        raise HTTPException(status_code=400, detail="Mã xác thực không chính xác")
    
    # 3. Cập nhật mật khẩu trong Database
    user = db.query(models.UserAccount).filter(models.UserAccount.Email == data.email).first()
    if not user:
         raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")

    # confirm mật khẩu mới
    if not data.new_password == data.confirm_password :
        raise HTTPException(status_code=400, detail= "Vui lòng xác nhận lại mật khẩu")
    
    user.PasswordHash = hash_secret(data.new_password, HashPurpose.PASSWORD)
    
    try:
        db.commit()
        # 4. Xóa mã trong Redis để không cho dùng lại
        redis_client.delete(f"reset:{data.email}")
        return {"message": "Mật khẩu đã được cập nhật thành công!"}
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Lỗi cập nhật mật khẩu")    