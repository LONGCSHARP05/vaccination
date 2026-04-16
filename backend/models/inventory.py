# Bảng InventoryTransaction, InventoryAuditLog
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship

from db.base import Base
from models.add_uuid import UuidMixin

TransactionTypeEnum = SQLEnum("IN", "OUT", "ADJUST", name="transaction_type_enum", create_constraint=True)


class InventoryTransaction(Base, UuidMixin):
    __tablename__ = "InventoryTransaction"

    InventoryTransactionID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    SubLotID = Column(Integer, ForeignKey("SubLot.SubLotID"), nullable=False)
    TransactionType = Column(TransactionTypeEnum, nullable=False)
    Quantity = Column(Integer, nullable=False)
    TransactionDate = Column(DateTime, nullable=False, default=datetime.now)
    ReferenceType = Column(String(100), nullable=True)
    ReferenceID = Column(Integer, nullable=True)
    CreatedByUserID = Column(Integer, ForeignKey("UserAccount.UserID"), nullable=False)

    sublot = relationship("SubLot", back_populates="inventory_transactions")
    created_by = relationship("UserAccount", back_populates="inventory_transactions")


