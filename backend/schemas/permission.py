# schemas/permission.py

from pydantic import BaseModel
from typing import List


class PermissionResponse(BaseModel):
    PermissionID: int
    PermissionName: str

    class Config:
        from_attributes = True

class RolePermissionUpdate(BaseModel):
    PermissionIDs: List[int]
