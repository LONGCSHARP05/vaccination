from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional, List

from models.patient import GenderEnum, Profile_Type


class PatientBase(BaseModel): # base schema dùng chung cho tất cả các phương thức
    CitizenID: str
    PatientCode: str # mã bệnh nhân là chuỗi không trống
    DateOfBirth: date # ngày sinh là đối tượng date
    Gender: str # giới tính là chuỗi không trống
    MedicalHistory: Optional[str] = None # tiền sử bệnh là chuỗi không trống hoặc None

    model_config = {
        'from_attributes':True
    }
    
class PatientCheckInResponse(BaseModel):
    PatientCode: str
    FullName: str
    Phone: Optional[str] = None
    Address: Optional[str] = None
    DateOfBirth: date
    Gender: str
    
    # THÊM DÒNG NÀY ĐỂ PYDANTIC CHẤP NHẬN SQLALCHEMY OBJECT
    class Config:
        from_attributes = True
class PatientDetail(PatientBase):
    PatientCode: str
    CitizenID: Optional[str] = None
    FullName: str
    Email: Optional[str] = None
    Phone: Optional[str] = None
    Address: Optional[str] = None
    DateOfBirth: date
    Gender: str
    MedicalHistory: Optional[str] = None
    

    model_config = {
        'from_attributes':True
    }
    
class GuardianShortInfo(BaseModel):
    FullName: str
    PatientCode: str
    Gender: str
    model_config = {
        'from_attributes':True
    }
class GuardianResponse(BaseModel):
    total: int
    limit: int
    data: list[GuardianShortInfo]
    
    model_config = {
        'from_attributes':True
    }
    
class PatientListItem(BaseModel):
    PatientID: int
    PatientCode: str
    FullName: str
    DateOfBirth: date
    Gender: str
    total_appointments: int   
    total_vaccinations: int    #số lần đã tiêm chủng 
class ListPatientResponse(BaseModel):
    total: int
    page_size: int
    data: List[PatientListItem]
    
class CreatePatientRequest(BaseModel):
    CitizenID: str|None = Field(None, length = 12, examples=["042201453939"])
    # Sử dụng trực tiếp Class Enum đã tạo ở trên
    ProfileType: Profile_Type = Field(
        default=Profile_Type.PATIENT,
        description="Loại hồ sơ: PATIENT (Cá nhân), CHILD (Con cái), RELATIVE (Người thân)",
        examples=[Profile_Type.PATIENT] # Nhớ bọc trong list [] để tránh lỗi 500 như nãy nhé
    )
    
    FullName: str = Field(..., min_length=3, examples=["Nguyen Van A"])
    Email: str|None = Field(None, examples=["nguyenvana@gmail.com"])
    Phone: str|None = Field(None, pattern=r"^(\+84|0)[3|5|7|8|9][0-9]{8}$", examples=["0323456789"])
    Address: str = Field(..., examples=["123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"])
    
    DateOfBirth: date = Field(..., examples=["1990-01-01"])
    Gender: GenderEnum = Field(
        default=GenderEnum.MALE,
        description="Giới tính: Nam, Nữ, Khác",
        examples=[GenderEnum.MALE] # Nhớ bọc trong list [] để tránh lỗi 500 như nãy nhé
    )
    
    GuardianID: int|None = Field(None, examples=[1])
    MedicalHistory: str = Field(None, examples=["Tiền sử bệnh: Không có"])

# schema lấy từng thuộc tính của Patient để hiển thị trong lịch hẹn và phiếu tiêm chủng, tránh lấy thừa thông tin không cần thiết
class PatientInVaccination(BaseModel):
    FullName: str
class VaccineInfo(BaseModel):
    VaccineName: str
    
    model_config = {
        'from_attributes':True
    }
class VaccineInVaccination(BaseModel):
    vaccine_detail: VaccineInfo
    
    model_config = {
        'from_attributes':True
    }
class PatientListVaccinationItem(BaseModel):
    patient: PatientInVaccination
    VaccinationDate: datetime
    vaccination_details: List[VaccineInVaccination]
    
    model_config = {
        'from_attributes':True
    }
    
class PatientListVaccinationResponse(BaseModel):
    total: int
    page_size: int
    data: List[PatientListVaccinationItem]