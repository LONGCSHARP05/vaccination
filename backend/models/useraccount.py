# Bảng UserAccount - tài khoản người dùng
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship, synonym

from db.base import Base
from models.add_uuid import UuidMixin


class UserAccount(Base, UuidMixin):
    __tablename__ = "UserAccount"

    UserID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Username = Column(String(100), nullable=False, unique=True)
    Email = Column(String(100), nullable=False, unique=True)
    PasswordHash = Column(String(255), nullable=False)
    IsActive = Column(Boolean, nullable=False, default=True)
    CreatedAt = Column(DateTime, nullable=False, default=datetime.now())
    UpdatedAt = Column(DateTime, nullable=True, onupdate=datetime.now())
    

    # Synonym để code auth dùng User.email khi filter
    

    # Relationships (CreatedByID của Appointment là StaffID, không phải UserID)
    user_roles = relationship("UserRole", back_populates="user")
    patient = relationship("Patient", back_populates="user", uselist=False)
    staff= relationship("Staff", back_populates="user", uselist=False)
    inventory_transactions = relationship("InventoryTransaction", back_populates="created_by")
    system_logs = relationship("SystemLog", back_populates="created_by")
    
