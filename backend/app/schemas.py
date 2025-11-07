from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InvoiceCreate(BaseModel):
    invoice_id: str
    vendor: str
    amount: float
    date: str
    source: str

class InvoiceResponse(BaseModel):
    id: int
    invoice_id: str
    vendor: str
    amount: float
    date: str
    source: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AnomalyResponse(BaseModel):
    id: int
    invoice_id: str
    vendor: str
    amount: float
    score: float
    reason: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UploadResponse(BaseModel):
    rows_inserted: int
    anomalies_detected: int

class SummaryResponse(BaseModel):
    total_invoices: int
    active_flags: int

