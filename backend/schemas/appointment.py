from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional, List, Text

from models.appointment import AppointmentStatusEnum


class AppointmentBase(BaseModel):
    VaccineID: int = Field(..., description="ID loại vaccine muốn đặt")
    AppointmentDate: datetime = Field(..., description="Ngày giờ hẹn tiêm")
    Note: Optional[str] = None
# 1. Schema nhỏ để lấy các trường cần thiết
class PatientInAppointment(BaseModel):
    FullName: str

class StaffInAppointment(BaseModel):
    FullName: str

class VaccineInAppointment(BaseModel):
    VaccineName: str

# 2. Schema chính
class AppointmentDetail(BaseModel):
    # Tên biến ở đây PHẢI TRÙNG với tên relationship trong Model ở Bước 1
    """Schema này sử dụng 3 thuộc tính trong 3 schema nhỏ để lấy thông tin cần thiết của Patient, UserAccount (Staff) và VaccineDetail khi truy vấn lịch hẹn"""
    patient: PatientInAppointment 
    created_by: StaffInAppointment
    vaccine: VaccineInAppointment
    
    AppointmentDate: datetime
    Status: AppointmentStatusEnum 
    Note: Optional[str] = None

    model_config = {
        'from_attributes':True
    }    
class ListAppointmentResponse(BaseModel):
    total: int
    page_size: int
    data: List[AppointmentDetail]
    
    model_config = {
        'from_attributes':True
    }
    
    
class AppointmentCreatyByPatient(AppointmentBase):
    pass
class AppointmentCreateByStaff(AppointmentBase):
    PatientID: int = Field(..., description="ID bệnh nhân được đặt lịch hẹn")