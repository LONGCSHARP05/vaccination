# Bảng Role, Permission, UserRole, RolePermission - phân quyền
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from db.base import Base
from models.add_uuid import UuidMixin


class Role(Base, UuidMixin):
    __tablename__ = "Role"

    RoleID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    RoleName = Column(String(100), nullable=False, unique=True)
    Description = Column(String(255), nullable=True)
    IsActive = Column(Boolean, nullable=False, default=True)

    user_roles = relationship("UserRole", back_populates="role")
    role_permissions = relationship("RolePermission", back_populates="role")


class Permission(Base, UuidMixin):
    __tablename__ = "Permission"

    PermissionID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    PermissionCode = Column(String(100), nullable=False, unique=True)
    PermissionName = Column(String(200), nullable=False)
    Description = Column(String(255), nullable=True)
    IsActive = Column(Boolean, nullable=False, default=True)

    role_permissions = relationship("RolePermission", back_populates="permission") # back_populates để lấy thông tin permission từ bảng role_permission


class RolePermission(Base, UuidMixin):
    __tablename__ = "RolePermission"
    __table_args__ = (UniqueConstraint("RoleID", "PermissionID", name="uq_role_permission"),)

    RolePermissionID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    RoleID = Column(Integer, ForeignKey("Role.RoleID"), nullable=False)
    PermissionID = Column(Integer, ForeignKey("Permission.PermissionID"), nullable=False)

    role = relationship("Role", back_populates="role_permissions") # tạo quan hệ với bảng role để lấy thông tin role
    permission = relationship("Permission", back_populates="role_permissions") # tạo quan hệ với bảng permission để lấy thông tin permission


class UserRole(Base, UuidMixin):
    __tablename__ = "UserRole"
    __table_args__ = (UniqueConstraint("UserID", "RoleID", name="uq_user_role"),)

    UserRoleID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    UserID = Column(Integer, ForeignKey("UserAccount.UserID"), nullable=False)
    RoleID = Column(Integer, ForeignKey("Role.RoleID"), nullable=False)

    user = relationship("UserAccount", back_populates="user_roles")
    role = relationship("Role", back_populates="user_roles")
