from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import pandas as pd
from typing import List
import io

from .db import Base, engine, get_db
from .models import Invoice, Anomaly
from .schemas import InvoiceResponse, AnomalyResponse, UploadResponse, SummaryResponse
from .ml_engine import detect_anomalies

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Trace - Vendor & Expense Auditor API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Trace - Vendor & Expense Auditor API"}

@app.post("/upload-csv", response_model=UploadResponse)
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload CSV file with invoices and run anomaly detection.
    Expected columns: invoice_id, vendor, amount, date, source
    """
    try:
        # Read CSV file
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Validate required columns
        required_columns = ['invoice_id', 'vendor', 'amount', 'date', 'source']
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(
                status_code=400,
                detail=f"CSV must contain columns: {', '.join(required_columns)}"
            )
        
        # Insert invoices into database
        rows_inserted = 0
        for _, row in df.iterrows():
            invoice = Invoice(
                invoice_id=str(row['invoice_id']),
                vendor=str(row['vendor']),
                amount=float(row['amount']),
                date=str(row['date']),
                source=str(row['source'])
            )
            db.add(invoice)
            rows_inserted += 1
        
        db.commit()
        
        # Run anomaly detection
        anomalies = detect_anomalies(df)
        
        # Store anomalies in database
        anomalies_inserted = 0
        for anomaly in anomalies:
            # Check if anomaly already exists for this invoice_id
            existing = db.query(Anomaly).filter(
                Anomaly.invoice_id == anomaly['invoice_id']
            ).first()
            
            if not existing:
                anomaly_record = Anomaly(
                    invoice_id=anomaly['invoice_id'],
                    vendor=anomaly['vendor'],
                    amount=anomaly['amount'],
                    score=anomaly['score'],
                    reason=anomaly['reason']
                )
                db.add(anomaly_record)
                anomalies_inserted += 1
        
        db.commit()
        
        return UploadResponse(
            rows_inserted=rows_inserted,
            anomalies_detected=anomalies_inserted
        )
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/anomalies", response_model=List[AnomalyResponse])
async def get_anomalies(db: Session = Depends(get_db)):
    """Get all detected anomalies"""
    anomalies = db.query(Anomaly).order_by(Anomaly.created_at.desc()).all()
    return anomalies

@app.get("/summary", response_model=SummaryResponse)
async def get_summary(db: Session = Depends(get_db)):
    """Get summary statistics"""
    total_invoices = db.query(Invoice).count()
    active_flags = db.query(Anomaly).count()
    return SummaryResponse(
        total_invoices=total_invoices,
        active_flags=active_flags
    )

@app.delete("/clear-all")
async def clear_all_data(db: Session = Depends(get_db)):
    """Clear all invoices and anomalies from the database"""
    try:
        # Delete all anomalies first (due to foreign key constraints if any)
        db.query(Anomaly).delete()
        # Delete all invoices
        db.query(Invoice).delete()
        db.commit()
        return {"message": "All data cleared successfully", "deleted_invoices": True, "deleted_anomalies": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

