from pydantic import BaseModel, Field
from typing import List, Optional

from models.vaccination_session import VaccinationDetail
from models.vaccine import VaccineDetail

class VaccinePrescription(BaseModel):
    vaccine_id: int 
    dose_number: int 
    dose_per_vial: int 

class SavePrescriptionRequest(BaseModel):
    screening_result: str = Field(..., description="Kết quả sàng lọc") # 'APPROVED', 'DELAYED', 'CANCELLED'
    note: str = Field(..., description="Ghi chú tổng hợp từ khám và chỉ định")
    vaccines: List[VaccinePrescription] = []

class CreateAppointmentRequest(BaseModel):
    patient_id: int = Field(..., description="ID của bệnh nhân")
    vaccine_id: int = Field(..., description="ID của vắc xin")
    appointment_date: str = Field(..., description="Ngày hẹn tiêm - YYYY-MM-DD")
    note: Optional[str] = Field(None, description="Ghi chú")