# Bảng SystemLog
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship

from db.base import Base


LogLevelEnum = SQLEnum("INFO", "WARN", "ERROR", "SECURITY", name="log_level_enum", create_constraint=True)


class SystemLog(Base):
    __tablename__ = "SystemLog"

    SystemLogID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    LogLevel = Column(LogLevelEnum, nullable=False)
    Action = Column(String(100), nullable=True)
    EntityName = Column(String(100), nullable=True)
    EntityID = Column(Integer, nullable=True)
    Message = Column(Text, nullable=True)
    CreatedByUserID = Column(Integer, ForeignKey("UserAccount.UserID"), nullable=True)
    CreatedAt = Column(DateTime, default=datetime.now)

    created_by = relationship("UserAccount", back_populates="system_logs")
