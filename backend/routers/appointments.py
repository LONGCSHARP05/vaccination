import datetime
from datetime import date
from typing import Optional 

from fastapi import APIRouter, Depends, HTTPException, Query, status   
from sqlalchemy.orm import Session
from models.appointment import Appointment
from schemas.appointment import ListAppointmentResponse
from models.patient import FamilyRelationship, GenderEnum, Profile_Type
import models
from core.security_models import CurrentUser
from db.session import SessionLocal
from models import Patient, UserAccount
from schemas.patient import CreatePatientRequest, GuardianResponse, PatientDetail, ListPatientResponse, PatientListItem
from core.deps import get_current_user, get_db
from core.permission import require_permission

from sqlalchemy import  or_
from core.deps import get_db
from sqlalchemy.orm import joinedload
from core.permission import require_permission
router = APIRouter(prefix="/api/v1/appointments", tags=["appointments"])

@router.get("/", response_model=ListAppointmentResponse)
def get_list_appointments(skip: int = 0,
                 limit:int = 10,
                db: Session = Depends(get_db),
                ):
    appointments = db.query(Appointment).options(
        joinedload(Appointment.patient), 
        joinedload(Appointment.created_by), 
        joinedload(Appointment.vaccine)
    ).offset(skip).limit(limit).all()
        
    total = len(appointments)
    
    if not appointments:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch hẹn nào!")
    return {
        "total": total,
        "page_size": limit,
        "data": appointments
    }
    
