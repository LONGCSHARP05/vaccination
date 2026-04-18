from fastapi import APIRouter, Depends, HTTPException
import db
from models.facility import Staff
from models.useraccount import UserAccount
from models.vaccination_session import VaccinationSession
from core.deps import get_db, get_current_user
from core.security_models import CurrentUser
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1/vaccination-sessions", tags=["vaccination-sessions"])

@router.post("/")
def create_reception_session(
    patient_id: int,
    appointment_id: int = None,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user) # Lấy Staff đang đăng nhập
):
    
    user = db.query(UserAccount).filter(UserAccount.UserID == user.UserID).first()
    staff_id = db.query(Staff.StaffID).join(UserAccount, UserAccount.UserID == user.UserID).scalar() # Giả sử UserID chính là StaffID, nếu không bạn cần truy vấn thêm để lấy StaffID từ UserAccount 
    new_session = VaccinationSession(
        PatientID=patient_id,
        AppointmentID=appointment_id,
        StaffID=staff_id, # StaffId lấy từ token
        Status="RECEIVED" # Trạng thái tiếp nhận
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return {"message": "Tiếp nhận thành công", "session_id": new_session.VaccinationSessionID}