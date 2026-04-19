from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from datetime import date
import db
from core.deps import get_db
from models import VaccinationSession, Patient, VaccinationDetail, Appointment
from schemas.page.doctor import SavePrescriptionRequest, CreateAppointmentRequest
from core.deps import get_current_user
router = APIRouter(prefix="/api/v1/doctor", tags=["Doctor"])

# 1. Lấy danh sách chờ (Hỗ trợ lọc theo RECEIVED cho Bác sĩ, SCREENED cho Phòng tiêm)
@router.get("/waiting-list")
def get_waiting_list(
    status: str = "RECEIVED", 
    screening_result: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Dùng joinedload để lấy luôn thông tin Patient đi kèm Session
    query = db.query(VaccinationSession).options(joinedload(VaccinationSession.patient)).filter(
        func.date(VaccinationSession.CreatedAt) == date.today(),
        VaccinationSession.Status == status
    )
    if screening_result:
        query = query.filter(VaccinationSession.ScreeningResult == screening_result)
        
    results = query.all()
    
    # Ép kiểu dữ liệu trả về thành một Dictionary rõ ràng cho Frontend
    data = []
    for session in results:
        data.append({
            "VaccinationSessionID": session.VaccinationSessionID,
            "CreatedAt": session.CreatedAt,
            "Status": session.Status,
            "patient": {
                "FullName": session.patient.FullName,
                "DateOfBirth": session.patient.DateOfBirth,
                "Gender": session.patient.Gender,
                "Phone": session.patient.Phone
            }
        })
    return data

# 2. Lấy Lịch sử tiêm chủng của Bệnh nhân
@router.get("/patient-history/{patient_id}")
def get_patient_history(patient_id: int, db: Session = Depends(get_db)):
    history = db.query(VaccinationDetail).join(VaccinationSession).filter(
        VaccinationSession.PatientID == patient_id,
        VaccinationDetail.Status == 'COMPLETED' # Hoặc VACCINATED
    ).order_by(VaccinationSession.VaccinationDate.desc()).all()
    return history

# 3. LƯU PHIẾU: Cập nhật khám sàng lọc & Lưu chỉ định vắc xin
@router.post("/session/{session_id}/save-prescription")
def save_prescription(
    session_id: int, 
    payload: SavePrescriptionRequest, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    session = db.query(VaccinationSession).filter(VaccinationSession.VaccinationSessionID == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiên tiêm")

    # A. Cập nhật Session
    session.Status = "SCREENED"
    session.ScreeningResult = payload.screening_result
    
    # Kỹ thuật Append Note (nếu đã có ghi chú cũ thì nối thêm, không thì tạo mới)
    existing_note = session.Note + "\n" if session.Note else ""
    session.Note = f"{existing_note}--- Khám Sàng Lọc ---\n{payload.note}"

    # B. Insert vào VaccinationDetail (Danh sách vắc xin chỉ định)
    for vac in payload.vaccines:
        new_detail = VaccinationDetail(
            SessionID=session_id,
            VaccineID=vac.vaccine_id,
            DoseNumber=vac.dose_number,
            DosePerVial=vac.dose_per_vial,
            Status="PENDING" # Chờ tiêm
        )
        db.add(new_detail)

    db.commit()
    return {"message": "Lưu phiếu thành công"}

# 4. Lưu Lịch hẹn mới (Từ tab Hẹn tiêm)
@router.post("/appointments")
def create_doctor_appointment(payload: CreateAppointmentRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    new_apt = Appointment(
        PatientID=payload.patient_id,
        VaccineID=payload.vaccine_id,
        AppointmentDate=payload.appointment_date,
        Note=payload.note,
        CreatedByID=current_user.UserID,
        Status="SCHEDULED"
    )
    db.add(new_apt)
    db.commit()
    return {"message": "Tạo lịch hẹn thành công"}