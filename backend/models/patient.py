# Bảng Patient - bệnh nhân (mở rộng từ UserAccount)
import datetime
import enum

from sqlalchemy import Column, Integer, String, Date, Text, Boolean, ForeignKey, Enum, func, select
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.hybrid import hybrid_property

from db.base import Base
from models.add_uuid import UuidMixin


class Profile_Type(str, enum.Enum):
    CHILD: str = "CHILD"
    PATIENT: str = "PATIENT"
    OTHER: str = "OTHER"
    
class GenderEnum(str, enum.Enum):
    MALE: str = "Nam"
    FEMALE: str = "Nữ"
    OTHER: str = "Khác"
class Patient(Base, UuidMixin):
    __tablename__ = "Patient"

    PatientID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    CitizenID = Column(String(12), nullable=True, unique=True)
    GuardianID = Column(Integer, ForeignKey("Patient.PatientID"), nullable=True)
    UserID = Column(Integer, ForeignKey("UserAccount.UserID"), unique=True, nullable=True)
    ProfileType = Column(Enum(Profile_Type), nullable=False, default=Profile_Type.PATIENT)
    
    FullName = Column(String(100), nullable=False)
    Email = Column(String(200), unique=True, nullable=True)
    Phone = Column(String(50), unique=True, nullable=True)
    Address = Column(String(200), nullable=False)

    PatientCode = Column(String(50), unique=True, nullable=False)
    DateOfBirth = Column(Date, nullable=False)
    Gender = Column(Enum(GenderEnum), nullable=False)
    MedicalHistory = Column(Text, nullable=True)
    IsActive = Column(Boolean, nullable=False, default=True)
    CreatedAt = Column(Date, nullable=False, default=datetime.date.today())
    UpdatedAt = Column(Date, nullable=True, onupdate=datetime.date.today())

    user = relationship("UserAccount", back_populates="patient")
    guardian = relationship("Patient", remote_side=[PatientID], back_populates="dependents") # có thể dùng backref để tự động tạo quan hệ ngược, nhưng sẽ bị lỗi nếu cùng bảng vừa là guardian vừa là dependent
    dependents = relationship("Patient", back_populates="guardian")
    
    appointments = relationship("Appointment", back_populates="patient")
    vaccination_sessions = relationship("VaccinationSession", back_populates="patient")

    @hybrid_property
    def total_appointments(self):
        return len(self.appointments)

    @total_appointments.expression
    def total_appointments(cls):
        # Định nghĩa cách tính cho SQL
        return (
            select(func.count(Patient.appointments.PatientID))
            .where(Patient.appointments.PatientID == cls.PatientID)
            .label("total_appointments")
        )
    
    @hybrid_property
    def total_vaccinations(self):
        return len(self.vaccination_sessions)
    @total_vaccinations.expression
    def total_vaccinations(cls):
        return (
            select(func.count(Patient.vaccination_sessions.PatientID))
            .where(Patient.vaccination_sessions.PatientID == cls.PatientID)
            .label("total_vaccinations")
        )

class FamilyRelationship(Base, UuidMixin):
    __tablename__ = "FamilyRelationship"
    
    FamilyID = Column(Integer, primary_key=True)
    GuardianID = Column(Integer, ForeignKey("Patient.PatientID"), nullable=False)
    DependentID = Column(Integer, ForeignKey("Patient.PatientID"), nullable=False)
    Relationship = Column(String(50))  # CON_TRAI, CON_GAI, ONG, BA...

    guardian = relationship("Patient", foreign_keys=[GuardianID]) 
    dependent = relationship("Patient", foreign_keys=[DependentID]) # có thể dùng để lấy thông tin từ bảng patient mà không cần join qua bảng FamilyRelationship
