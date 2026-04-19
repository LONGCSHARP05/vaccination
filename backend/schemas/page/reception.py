

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field
from sqlalchemy import Enum

from models.patient import Patient
from models.vaccination_session import VaccinationSession
from models.vaccine import VaccineDetail


class ReceptionBase:
    pass

class PatientListItem(BaseModel):
    PatientCode: Optional[str] = None
    FullName: Optional[str] = None
    Gender: Optional[str] = None
    DateOfBirth: Optional[date] = None
    Address: Optional[str] = None

    class Config:
        from_attributes = True
 
class RegisteredListItem(BaseModel):
    PatientCode: str
    FullName: str
    Gender: str
    DateOfBirth: date
    Address: str
    VaccineName: str
    Status: str
    class Config:
        from_attributes = True

class RegisteredPatientList(BaseModel):    
    data: list[RegisteredListItem]
    total: int
    page_size: int   
class ListPatientResponse(BaseModel):
    data: list[PatientListItem]
    total: int
    page_size: int
    

class AppointmentItem(BaseModel):
    PatientCode: str
    FullName: str
    Gender: str
    DateOfBirth: datetime
    AppointmentDate: datetime
    VaccineName: Optional[str] = Field(None, description="Tên loại vaccine đã đặt")
    Status: str
    
    model_config = {
        "from_attributes": True
    }
class ListAppointmentResponse(BaseModel):
    data: list[AppointmentItem]
    total: int
    page_size: int

class SessionStatus(str, Enum):
    RECEIVED = "RECEIVED"
    SCREENED = "SCREENED"
    VACCINATED = "VACCINATED"
    OBSERVED = "OBSERVED"
    COMPLETED = "COMPLETED"