from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.database import Base

class ConnectionRecord(Base):
    __tablename__ = "connection_records"

    id = Column(Integer, primary_key=True, index=True)
    connection_id = Column(String, unique=True, index=True, nullable=False)
    state = Column(String, index=True, nullable=False)
    their_label = Column(String, nullable=True)
    their_did = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
