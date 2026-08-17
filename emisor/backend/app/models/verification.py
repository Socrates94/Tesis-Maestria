from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON
from app.core.database import Base
from datetime import datetime

class VerificationRecord(Base):
    __tablename__ = "verification_records"

    id = Column(Integer, primary_key=True, index=True)
    connection_id = Column(String, index=True)
    presentation_exchange_id = Column(String, unique=True, index=True)
    state = Column(String, default="request_sent") # request_sent, presentation_received, verified, abandoned
    verified = Column(Boolean, default=False)
    presented_data = Column(JSON, nullable=True) # Los datos revelados (si los hay)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
