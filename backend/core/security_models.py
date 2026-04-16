from pydantic import BaseModel
from typing import List
from uuid import UUID

class CurrentUser(BaseModel):
    id: int
    uuid: UUID
    username: str
    permissions: List[str]

    class Config:
        from_attributes = True
        

# sau này có thể thêm
# self.facility_id
# self.email
# self.fullname
