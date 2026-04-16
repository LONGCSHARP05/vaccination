import datetime
from datetime import date
from typing import Optional 

from fastapi import APIRouter, Depends, HTTPException, Query, status   
from sqlalchemy.orm import Session
from models.vaccination_session import VaccinationDetail, VaccinationSession
from models.appointment import Appointment
from schemas.appointment import ListAppointmentResponse
from models.patient import FamilyRelationship, GenderEnum, Profile_Type
import models
from core.security_models import CurrentUser
from db.session import SessionLocal
from models import Patient, UserAccount
from schemas.patient import CreatePatientRequest, GuardianResponse, PatientListVaccinationResponse, PatientDetail, ListPatientResponse, PatientListItem
from core.deps import get_current_user, get_db
from core.permission import require_permission

from sqlalchemy import  Integer, func, or_
from core.deps import get_db
from sqlalchemy.orm import joinedload

from core.permission import require_permission
router = APIRouter(prefix="/api/v1/patients", tags=["patients"])

# * **GET** `/api/v1/patients/` – Danh sách bệnh nhân
# * **POST** `/api/v1/patients/` – Tạo bệnh nhân
# * **GET** `/api/v1/patients/{patient_uuid}` – Cho tiết bệnh nhân
# * **PUT** `/api/v1/patients/{patient_uuid}` – Cập nhật bệnh nhân
# * **PATCH** `/api/v1/patients/{patient_uuid}/status` – Cập nhật trạng thái bệnh nhân
# * **GET** `/api/v1/patients/{patient_uuid}/appointments` – Lịch hẹn của bệnh nhân
# * **GET** `/api/v1/patients/{patient_uuid}/vaccinations` – Lịch sử tiêm

@router.get("/", response_model=ListPatientResponse)
def get_list_patients(skip: int = 0,
                 limit:int = 10,
                db: Session = Depends(get_db),
                ):
    patients = db.query(Patient).offset(skip).limit(limit).all()
    total = db.query(Patient).count()
    
    if not patients:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân nào!")
    return {
        "total": total,
        "page_size": limit,
        "data": patients
    }

@router.get("/guardian", response_model=GuardianResponse)
def search_guardian_info(
    skip: int = 0, 
    limit: int = 10, 
    keyword: str = Query(..., description="Nhập tên, email hoặc mã người giám hộ"),
    db: Session = Depends(get_db)):
    """Thực chất là lấy thông tin người thân cũng là bệnh nhân để tạo người dùng mới"""
    # tìm bệnh nhân theo fullname hoặc patient code hoặc email
    guardian = db.query(Patient).filter(
        or_(
            Patient.FullName.ilike(f"%{keyword}%"),
            Patient.PatientCode.ilike(f"%{keyword}%"),
            Patient.Email.ilike(f"%{keyword}%")
        )
    ).offset(skip).limit(limit).all()
    
    if not guardian:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin người thân!")
    
    return GuardianResponse(
        total=len(guardian),
        limit=limit,
        data=guardian
    )

@router.post("/")
def create_patient(data: CreatePatientRequest,
                   db: Session = Depends(get_db),
                   current_user: CurrentUser = Depends(get_current_user)):
    """Người dùng hoặc nhân viên tạo profile bệnh nhân mới nếu chưa có profile"""
    prefix = "BN"
    
    # 1. Tìm mã lớn nhất hiện có
    # func.substring(Patient.PatientCode, 3) sẽ cắt chuỗi từ ký tự thứ 3 trở đi (lấy 4 số cuối)
    # cast(...) sẽ chuyển chuỗi đó sang kiểu Integer để so sánh MAX chính xác
    max_code = db.query(func.max(func.cast(func.substring(Patient.PatientCode, 3), Integer))).\
               filter(Patient.PatientCode.like(f"{prefix}%")).scalar()

    # 2. Tính toán số tiếp theo
    if max_code is None:
        next_number = 1
    else:
        next_number = max_code + 1

    # 3. Gộp chuỗi lại: BN + số được format đủ 4 chữ số (zfill)
    new_PatientCode = f"{prefix}{str(next_number).zfill(4)}"

    new_patient =  Patient(
        FullName = data.FullName,
        DateOfBirth = data.DateOfBirth,
        Gender = data.Gender,
        Email = data.Email,
        Phone = data.Phone,
        Address = data.Address,
        MedicalHistory = data.MedicalHistory,
        GuardianID = data.GuardianID,
        CitizenID = data.CitizenID,
        PatientCode = new_PatientCode,
        ProfileType = data.ProfileType        
    )
    
    if data.GuardianID:
        new_family_relationship = FamilyRelationship(
            GuardianID = data.GuardianID,
            DependentID = new_patient.PatientID,
            Relationship = "CON"
        )
        db.add(new_family_relationship)
    
    db.add(new_patient)
    
    db.commit()
    return {
        "message": "Tạo bệnh nhân thành công"
    }
    

@router.get("/search", response_model=ListPatientResponse)
def search_patient(keyword: Optional[str] = None, 
                   gender: Optional[GenderEnum] = Query(None, description="Giới tính: Nam, Nữ, Khác"),
                   profile_type: Optional[Profile_Type] = Query(None, description="Loại hồ sơ: Bệnh nhân, Người thân"),
                   birthday: Optional[date] = Query(None, description="Ngày sinh"),
                skip: int = 0,
                limit: int = 10,
                db: Session = Depends(get_db),
                ):
    """Lấy danh sách bệnh nhân"""
    
    patients = db.query(Patient)
    
    if keyword:
        keyword = keyword.strip()
        patients = patients.filter(
            or_(
                Patient.Email == keyword,
                Patient.FullName.like(f"%{keyword}%"),
                Patient.PatientCode.like(f"%{keyword}%")
            )
        )
    
    if gender:
        patients = patients.filter(Patient.Gender == gender)
    
    if profile_type:
        patients = patients.filter(Patient.ProfileType == profile_type)
        
    if birthday:
        patients = patients.filter(Patient.DateOfBirth == birthday)
    
    if not patients:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân nào!")
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân nào!")

    total = patients.count()
    patients = patients.offset(skip).limit(limit).all()
    
    
    return {
        "total": total,
        "page_size": limit,
        "data": patients
    }
 
    
@router.get("/{patient_uuid}", response_model=PatientDetail)
def get_patient_detail(patient_uuid: str, db: Session = Depends(get_db)):
    patient_detail = db.query(Patient).filter(Patient.uuid == patient_uuid).first()
    if not patient_detail:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân!")
    return patient_detail

@router.get("/{patient_uuid}/appointments", response_model=ListAppointmentResponse)
def get_patient_appointments(patient_uuid: str, 
                             skip: int = 0,
                             limit: int = 10,
                             db: Session = Depends(get_db)):
    # First, find the patient ID based on the UUID
    patient = db.query(Patient).filter(Patient.uuid == patient_uuid).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân!")
    
    appointments = db.query(Appointment).filter(Appointment.PatientID == patient.PatientID).options(
        joinedload(Appointment.patient), 
        joinedload(Appointment.created_by), 
        joinedload(Appointment.vaccine)
    ).offset(skip).limit(limit).all()
        
    total = len(appointments)
    
    if not appointments:
        raise HTTPException(status_code=404, detail="Không có lịch hẹn nào!")
    return {
        "total": total,
        "page_size": limit,
        "data": appointments
    }
    
@router.get("/{patient_uuid}/vaccinations", response_model=PatientListVaccinationResponse)
def get_patient_vaccinations(patient_uuid: str,
                             skip: int = 0,
                             limit: int = 10,
                             db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.uuid == patient_uuid).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Không tìm thấy bệnh nhân!")
    
    vaccinations = db.query(VaccinationSession).filter(VaccinationSession.PatientID == patient.PatientID).options(
        joinedload(VaccinationSession.patient),
        joinedload(VaccinationSession.vaccination_details).joinedload(VaccinationDetail.vaccine_detail) # joinload thông tin vaccine trong vaccination details để lấy tên vaccine trong response
    ).offset(skip).limit(limit).all()
        
    total = len(vaccinations)
    
    if not vaccinations:
        raise HTTPException(status_code=404, detail="Không có lịch hẹn nào!")
    
    return {
        "total": total,
        "page_size": limit,
        "data": vaccinations
    }