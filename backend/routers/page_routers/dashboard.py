

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_
from datetime import datetime
from core.deps import get_db
from models.vaccination_session import VaccinationSession
from models.patient import Patient

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])

@router.get("/daily-overview")
def get_daily_overview(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(None)
):
    # Xác định khoảng thời gian trong ngày hôm nay
    start = datetime.combine(datetime.now().date(), datetime.min.time())
    end = datetime.combine(datetime.now().date(), datetime.max.time())

    # 1. METRICS (Giữ nguyên thống kê tổng quan của cả ngày)
    def count_status(status):
        return db.query(func.count(VaccinationSession.VaccinationSessionID)).filter(
            VaccinationSession.CreatedAt >= start,
            VaccinationSession.CreatedAt < end,
            VaccinationSession.Status == status,
            VaccinationSession.ScreeningResult == "APPROVED"
        ).scalar() or 0

    metrics = {
        "waiting_exam": count_status("RECEIVED"),
        "waiting_inject": count_status("SCREENED"),
        "monitoring": count_status("OBSERVED"),
        "completed": count_status("COMPLETED") # hoặc COMPLETED tùy logic của bạn
    }

    # 2. DANH SÁCH BỆNH NHÂN (Có tìm kiếm và phân trang)
    query = db.query(VaccinationSession).join(Patient, VaccinationSession.PatientID == Patient.PatientID).options(joinedload(VaccinationSession.patient)).filter(
        VaccinationSession.CreatedAt >= start,
        VaccinationSession.CreatedAt < end
    )

    if search and len(search.strip()) >= 2:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
        or_(
            Patient.FullName.ilike(search_filter),
            Patient.CitizenID.ilike(search_filter),
            Patient.Phone.ilike(search_filter)
        )
    )
        
    count_query = db.query(func.count(VaccinationSession.VaccinationSessionID))\
    .select_from(VaccinationSession)\
    .join(Patient)\
    .filter(
        VaccinationSession.CreatedAt >= start,
        VaccinationSession.CreatedAt < end
    )

    if search and len(search.strip()) >= 2:
        count_query = count_query.filter(
            or_(
                Patient.FullName.ilike(search_filter),
                Patient.CitizenID.ilike(search_filter),
                Patient.Phone.ilike(search_filter)
            )
        )

    total_records = count_query.scalar() or 0
    
    # Thực hiện phân trang
    offset = (page - 1) * limit
    sessions = query.order_by(VaccinationSession.CreatedAt.desc()).offset(offset).limit(limit).all()

    patients_list = []
    status_map = {
        "RECEIVED": "Đang chờ khám",
        "SCREENED": "Đang chờ tiêm",
        "VACCINATED": "Đã tiêm",
        "OBSERVED": "Đang theo dõi",
        "COMPLETED": "Hoàn tất"
    }

    for session in sessions:
        full_name = session.patient.FullName or "N/A"
        words = full_name.split()
        initials = "".join([w[0].upper() for w in words[-2:]]) if len(words) >= 2 else full_name[:2].upper()

        patients_list.append({
            "id": session.VaccinationSessionID,
            "patient_name": full_name,
            "patient_code": session.patient.CitizenID or f"BN-{session.PatientID}",
            "initials": initials,
            "time": session.CreatedAt.strftime("%H:%M") if session.CreatedAt else "N/A",
            "status": status_map.get(session.Status, "Không xác định")
        })
        


    return {
        "metrics": metrics,
        "patients": patients_list,
        "pagination": {
            "total": total_records,
            "page": page,
            "limit": limit,
            "total_pages": (total_records + limit - 1) // limit
        }
    }