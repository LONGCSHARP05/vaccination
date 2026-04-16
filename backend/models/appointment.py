# Bảng Appointment - lịch hẹn (CreatedByID -> Staff)
from datetime import datetime
import enum
from sqlalchemy import Column, Integer, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship

from db.base import Base
from models.add_uuid import UuidMixin

class AppointmentStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CHECKED_IN = "CHECKED_IN"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    NO_SHOW = "NO_SHOW"



class Appointment(Base, UuidMixin):
    __tablename__ = "Appointment"

    AppointmentID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    PatientID = Column(Integer, ForeignKey("Patient.PatientID"), nullable=False)
    CreatedByID = Column(Integer, ForeignKey("Staff.StaffID"), nullable=True)
    VaccineID = Column(Integer, ForeignKey("VaccineDetail.VaccineDetailID"), nullable=False)
   
    AppointmentDate = Column(DateTime, nullable=False)
    Status = Column(SQLEnum(AppointmentStatusEnum), nullable=False, default="PENDING")
    Note = Column(Text, nullable=True)

    patient = relationship("Patient", back_populates="appointments")
    created_by = relationship("Staff", back_populates="appointments_created")
    vaccination_sessions = relationship("VaccinationSession", back_populates="appointment")
    vaccine = relationship("VaccineDetail", back_populates="appointments")