from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError,jwt

from core.token import  ALGORITHM, SECRET_KEY
from core.security_models import CurrentUser
from models.useraccount import UserAccount
from models.role_permission import RolePermission, Permission, UserRole, Role


from db.session import SessionLocal

def get_db(): # hàm tạo session làm việc với database
    db = SessionLocal() # tạo session mới
    try: 
        yield db # trả về session để sử dụng trong các endpoint
    finally:
        db.close() # đóng session sau khi sử dụng
        

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> CurrentUser:

    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_uuid: str = payload.get("sub") 
        token_type: str = payload.get("type")

        if token_type != "access" or not user_uuid:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token")
            
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Could not validate credentials")
    
    # ====== Truy vấn User theo UUID ======
    user = db.query(UserAccount).filter(
        UserAccount.uuid == user_uuid, # Giả sử cột trong DB tên là uuid
        UserAccount.IsActive == True
    ).first()

    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")

    # ====== Lấy quyền (Giữ nguyên logic JOIN của bạn nhưng tối ưu hóa) ======
    permissions = (
        db.query(Permission.PermissionName)
        .join(RolePermission)
        .join(Role)
        .join(UserRole)
        .filter(UserRole.UserID == user.UserID, Role.IsActive == True)
        .distinct()
        .all()
    )
    
    # Chuyển list tuple [('view_patient',), ('edit_inventory',)] thành list string
    permission_list = [p[0] for p in permissions]

    # Trả về Object Pydantic
    return CurrentUser(
        id=user.UserID,
        uuid=user.uuid, # Trả về UUID thay vì ID integer
        username=user.Username,
        permissions=permission_list
    )