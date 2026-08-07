from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ConnectionRecordBase(BaseModel):
    connection_id: str
    state: str
    their_label: Optional[str] = None
    their_did: Optional[str] = None

class ConnectionRecordCreate(ConnectionRecordBase):
    pass

class ConnectionRecordUpdate(BaseModel):
    state: Optional[str] = None
    their_label: Optional[str] = None
    their_did: Optional[str] = None

class ConnectionRecordResponse(ConnectionRecordBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
