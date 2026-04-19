import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func


from schemas.page.reception import ListAppointmentResponse, RegisteredPatientList
from schemas.page.reception import ListPatientResponse, SessionStatus
import db
from models.vaccination_session import VaccinationSession
from core.deps import get_db
from models.patient import Patient
from models.appointment import Appointment



router = APIRouter(prefix="/api/v1/reception", tags=["reception"])


@router.get("/patient_list/")
def get_patient_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    identifier: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):

    query = db.query(Patient)

    if identifier:
        identifier = identifier.strip()
        query = query.filter(
            or_(
                Patient.FullName.ilike(f"%{identifier}%"),
                Patient.PatientCode == identifier,
                Patient.Phone == identifier,
                Patient.CitizenID == identifier
            )
        )

    total = query.count()
    patients = query.offset(skip).limit(limit).all()

    data = [
        {
            "PatientCode": p.PatientCode,
            "FullName": p.FullName,
            "Gender": p.Gender,
            "DateOfBirth": p.DateOfBirth,
            "Address": p.Address
        }
        for p in patients
    ]

    return {
        "total": total,
        "page_size": limit,
        "data": data
    }
    

@router.get("/patient_registered/")
def get_patient_registered(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    identifier: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):

    query = (
        db.query(VaccinationSession, Patient)
        .join(Patient, VaccinationSession.PatientID == Patient.PatientID)
    )

    if status:
        query = query.filter(VaccinationSession.Status == status)

    if identifier:
        identifier = identifier.strip()
        query = query.filter(
            or_(
                Patient.FullName.ilike(f"%{identifier}%"),
                Patient.CitizenID == identifier,
                Patient.PatientCode == identifier,
                Patient.Phone == identifier
            )
        )

    total = query.count()
    results = query.offset(skip).limit(limit).all()

    data = [
        {
            "PatientCode": patient.PatientCode,
            "FullName": patient.FullName,
            "Gender": patient.Gender,
            "DateOfBirth": patient.DateOfBirth,
            "Address": patient.Address,

            "Status": session.Status
        }
        for session, patient in results
    ]

    return {
        "total": total,
        "page_size": limit,
        "data": data
    }
    
    
    
@router.get("/appointments/")
def get_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    identifier: Optional[str] = None,
    date: Optional[datetime.date] = Query(None, description="Ngày hẹn (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):

    query = db.query(Appointment).join(Patient)

    if identifier:
        identifier = identifier.strip()
        query = query.filter(
            or_(
                Patient.FullName.ilike(f"%{identifier}%"),
                Patient.Phone == identifier,
                Patient.CitizenID == identifier,
                Patient.PatientCode == identifier
            )
        )

    if date:
        query = query.filter(func.date(Appointment.AppointmentDate) == date)

    total = query.count()
    results = query.offset(skip).limit(limit).all()

    data = [
        {
            "PatientCode": ap.patient.PatientCode,
            "FullName": ap.patient.FullName,
            "Gender": ap.patient.Gender,
            "DateOfBirth": ap.patient.DateOfBirth,

            "AppointmentDate": ap.AppointmentDate,
            "Status": ap.Status
        }
        for ap in results
    ]

    return {
        "total": total,
        "page_size": limit,
        "data": data
    }