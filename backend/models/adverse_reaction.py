# Bảng AdverseReaction - phản ứng bất lợi (ReportedByID -> StaffFacility)
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base
from models.add_uuid import UuidMixin


class AdverseReaction(Base, UuidMixin):
    __tablename__ = "AdverseReaction"

    AdverseReactionID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    VaccinationDetailID = Column(Integer, ForeignKey("VaccinationDetail.VaccinationDetailID"), nullable=False)
    ReactionType = Column(String(200), nullable=True)
    Severity = Column(String(50), nullable=True)
    Description = Column(Text, nullable=True)
    ReportedByID = Column(Integer, ForeignKey("Staff.StaffID", ondelete = "RESTRICT"), nullable=True)
    ReportedDate = Column(DateTime, nullable=False, default=datetime.now())

    vaccination_detail = relationship("VaccinationDetail", back_populates="adverse_reactions")
    reported_by = relationship("Staff", back_populates="adverse_reactions_reported")
