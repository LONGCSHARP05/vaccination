# Bảng VaccinationSession, VaccinationDetail - buổi tiêm và chi tiết mũi (AdministeredByID -> StaffFacility)
from datetime import datetime
from sqlalchemy import Column, Integer, DateTime, Text, ForeignKey, String
from sqlalchemy.orm import relationship

from db.base import Base
from models.add_uuid import UuidMixin

class Vaccination_Status:
# 'RECEIVED', 'SCREENED', 'VACCINATED', 'OBSERVED', 'COMPLETED'
    RECEIVED = "RECEIVED"
    SCREENED = "SCREENED"
    VACCINATED = "VACCINATED"
    OBSERVED = "OBSERVED"
    COMPLETED = "COMPLETED"
    
class Screening_Result:
# ('APPROVED', 'DELAYED', 'REJECTED')
    APPROVED = "APPROVED"
    DELAYED = "DELAYED"
    REJECTED = "REJECTED"
class VaccinationSession(Base, UuidMixin):
    __tablename__ = "VaccinationSession"

    VaccinationSessionID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    PatientID = Column(Integer, ForeignKey("Patient.PatientID"), nullable=False)
    StaffID = Column(Integer, ForeignKey("Staff.StaffID"), nullable=False)
    AppointmentID = Column(Integer, ForeignKey("Appointment.AppointmentID"), nullable=True)
    VaccinationDate = Column(DateTime, nullable=False)
    Note = Column(Text, nullable=True)
    Status = Column(String(50), nullable=True)  # Sử dụng enum Vaccination_Status
    ScreeningResult = Column(String(50), nullable=True)
    CreatedAt = Column(DateTime, default=datetime.now)
    
    patient = relationship("Patient", back_populates="vaccination_sessions")
    staff = relationship("Staff", back_populates="vaccination_sessions")
    appointment = relationship("Appointment", back_populates="vaccination_sessions")
    vaccination_details = relationship("VaccinationDetail", back_populates="vaccination_session")


class VaccinationDetail(Base, UuidMixin):
    __tablename__ = "VaccinationDetail"

    VaccinationDetailID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    VaccinationSessionID = Column(Integer, ForeignKey("VaccinationSession.VaccinationSessionID"), nullable=False)
    VaccineDetailID = Column(Integer, ForeignKey("VaccineDetail.VaccineDetailID"), nullable=False)
    SubLotID = Column(Integer, ForeignKey("SubLot.SubLotID"), nullable=False)
    DoseNumber = Column(Integer, nullable=False)  # Thứ tự mũi tiêm trong phác đồ
    QuantityUsed = Column(Integer, nullable=False, default=1)  # Số liều sử dụng (thường là 1, nhưng có thể >1 nếu dùng chung vỉ)
    AdministeredByID = Column(Integer, ForeignKey("Staff.StaffID"), nullable=False)

    vaccination_session = relationship("VaccinationSession", back_populates="vaccination_details")
    vaccine_detail = relationship("VaccineDetail", back_populates="vaccination_details")
    sublot = relationship("SubLot", back_populates="vaccination_details")
    administered_by = relationship("Staff", back_populates="vaccination_details_administered")
    adverse_reactions = relationship("AdverseReaction", back_populates="vaccination_detail")
