# Bảng Facility, Staff - cơ sở tiêm và gán nhân viên
from datetime import datetime

from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from db.base import Base
from models.add_uuid import UuidMixin


class Facility(Base, UuidMixin):
    __tablename__ = "Facility"

    FacilityID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    FacilityCode = Column(String(50), unique=True, nullable=True)
    FacilityName = Column(String(200), nullable=False)
    Address = Column(String(300), nullable=True)
    Phone = Column(String(50), nullable=True)
    IsActive = Column(Boolean, nullable=False, default=True)

    staff = relationship("Staff", back_populates="facility")
    sublots = relationship("SubLot", back_populates="facility")


class Staff(Base, UuidMixin):
    __tablename__ = "Staff"

    StaffID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    UserID = Column(Integer, ForeignKey("UserAccount.UserID"), unique=True, nullable=True)
    FacilityID = Column(Integer, ForeignKey("Facility.FacilityID"), nullable=False)
    Position = Column(String(100), nullable=True)
    FullName = Column(String(100), nullable=False)
    Email = Column(String(100), unique=True, nullable=True)
    Phone = Column(String(20), unique=True, nullable=True)
    Address = Column(String(200), nullable=True)
    
    user = relationship("UserAccount", back_populates="staff")
    facility = relationship("Facility", back_populates="staff")
    appointments_created = relationship("Appointment", back_populates="created_by")
    vaccination_sessions = relationship("VaccinationSession", back_populates="staff")
    vaccination_details_administered = relationship("VaccinationDetail", back_populates="administered_by")
    adverse_reactions_reported = relationship("AdverseReaction", back_populates="reported_by")


