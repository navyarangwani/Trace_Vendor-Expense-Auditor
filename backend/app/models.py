from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .db import Base

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(String, unique=False, index=True)
    vendor = Column(String, index=True)
    amount = Column(Float)
    date = Column(String)
    source = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Anomaly(Base):
    __tablename__ = "anomalies"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(String, index=True)
    vendor = Column(String)
    amount = Column(Float)
    score = Column(Float)
    reason = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

