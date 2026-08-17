from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime

class VerificationRequest(BaseModel):
    connection_id: str
    cred_def_id: str # De qué Credential Definition queremos la prueba

class VerificationResponse(BaseModel):
    message: str
    presentation_exchange_id: str
    state: str

class VerificationRecordBase(BaseModel):
    connection_id: str
    presentation_exchange_id: str
    state: str
    verified: bool
    presented_data: Optional[Dict[str, Any]] = None

class VerificationRecordResponse(VerificationRecordBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
