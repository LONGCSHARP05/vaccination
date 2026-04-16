# Bảng VaccineDetail, Lot, SubLot - vaccine, lô, sublot
from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship

from db.base import Base
from models.add_uuid import UuidMixin

# ENUM theo schema MySQL
LotStatusEnum = SQLEnum(
    "CREATED", "IN_STOCK", "EXPIRED", "RECALLED", "LOCKED", "CLOSED",
    name="lot_status_enum",
    create_constraint=True,
)

SubLotStatusEnum = SQLEnum(
    "RECEIVED", "AVAILABLE", "LOW_STOCK", "OUT_OF_STOCK", "LOCKED", "EXPIRED", "CLOSED",
    name="sublot_status_enum",
    create_constraint=True,
)


class VaccineDetail(Base, UuidMixin):
    __tablename__ = "VaccineDetail"

    VaccineDetailID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    VaccineCode = Column(String(50), unique=True, nullable=True)
    VaccineName = Column(String(200), nullable=False)
    Manufacturer = Column(String(200), nullable=True)
    CountryOfOrigin = Column(String(100), nullable=True)
    DosePerVial = Column(Integer, nullable=True)
    Description = Column(String(500), nullable=True)
    IsActive = Column(Boolean, nullable=False, default=True)

    lots = relationship("Lot", back_populates="vaccine_detail")
    vaccination_details = relationship("VaccinationDetail", back_populates="vaccine_detail")
    appointments = relationship("Appointment", back_populates="vaccine")

class Lot(Base, UuidMixin):
    __tablename__ = "Lot"

    LotID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    LotCode = Column(String(100), nullable=False, unique=True)
    VaccineDetailID = Column(Integer, ForeignKey("VaccineDetail.VaccineDetailID"), nullable=False)
    ManufactureDate = Column(Date, nullable=True)
    ExpiryDate = Column(Date, nullable=True)
    TotalQuantity = Column(Integer, nullable=False)
    RemainingQuantity = Column(Integer, nullable=False)
    LotStatus = Column(LotStatusEnum, nullable=False, default="CREATED")

    vaccine_detail = relationship("VaccineDetail", back_populates="lots")
    sublots = relationship("SubLot", back_populates="lot")


class SubLot(Base, UuidMixin):
    __tablename__ = "SubLot"

    SubLotID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    SubLotCode = Column(String(100), nullable=False, unique=True)
    LotID = Column(Integer, ForeignKey("Lot.LotID"), nullable=False)
    FacilityID = Column(Integer, ForeignKey("Facility.FacilityID"), nullable=False)
    ReceivedDate = Column(Date, nullable=True)
    QuantityReceived = Column(Integer, nullable=False)
    QuantityRemaining = Column(Integer, nullable=False)
    SubLotStatus = Column(SubLotStatusEnum, nullable=False, default="RECEIVED")

    lot = relationship("Lot", back_populates="sublots")
    facility = relationship("Facility", back_populates="sublots")
    inventory_transactions = relationship("InventoryTransaction", back_populates="sublot")
    vaccination_details = relationship("VaccinationDetail", back_populates="sublot")
