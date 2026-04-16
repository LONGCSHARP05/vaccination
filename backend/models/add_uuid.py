# Mixin và helper dùng chung cho models
import uuid
from sqlalchemy import Column, String


def uuid_default():
    return str(uuid.uuid4())


class UuidMixin:
    """Mixin thêm cột UUID cho mỗi bảng (bảo mật, dùng cho truy vấn công khai)."""
    uuid = Column(String(36), unique=True, nullable=False, default=uuid_default, index=True)
