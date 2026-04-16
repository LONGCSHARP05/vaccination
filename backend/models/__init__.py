# Import tất cả models theo thứ tự phụ thuộc (để relationship resolve đúng)
from models.add_uuid import UuidMixin, uuid_default

from models.useraccount import UserAccount
from models.role_permission import Role, Permission, RolePermission, UserRole
from models.patient import Patient
from models.facility import Facility, Staff
from models.vaccine import VaccineDetail, Lot, SubLot, LotStatusEnum, SubLotStatusEnum
from models.appointment import Appointment, AppointmentStatusEnum
from models.vaccination_session import VaccinationSession, VaccinationDetail
from models.adverse_reaction import AdverseReaction
from models.inventory import InventoryTransaction, TransactionTypeEnum
from models.logs import SystemLog, LogLevelEnum

# Alias cho code auth cũ
User = UserAccount # alias dùng để tạo tài khoản người dùng

__all__ = [
    "UuidMixin",
    "uuid_default",
    "UserAccount",
    "User",
    "Role",
    "Permission",
    "RolePermission",
    "UserRole",
    "Patient",
    "Facility",
    "StaffFacility",
    "VaccineDetail",
    "Lot",
    "SubLot",
    "LotStatusEnum",
    "SubLotStatusEnum",
    "Appointment",
    "AppointmentStatusEnum",
    "VaccinationSession",
    "VaccinationDetail",
    "AdverseReaction",
    "InventoryTransaction",
    "InventoryAuditLog",
    "TransactionTypeEnum",
    "ActionTypeEnum",
    "SystemLog",
    "LogLevelEnum",
]
