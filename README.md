# 🔍 Trace – Vendor & Expense Auditor

A full-stack prototype for detecting duplicate invoices, policy violations, and suspicious vendor transactions using FastAPI, React, and ML anomaly detection.

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

```bash
# Start both backend and frontend
docker-compose up --build

# Backend will be available at http://localhost:8000
# Frontend will be available at http://localhost:5173
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
trace_proto/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── db.py            # Database configuration
│   │   ├── schemas.py       # Pydantic schemas
│   │   └── ml_engine.py     # ML anomaly detection
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── UploadForm.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AlertsList.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── sample_data/
│   └── invoices_sample.csv  # Sample data with duplicates
└── docker-compose.yml
```

## 🧠 Features

### Anomaly Detection

1. **Duplicate Detection**: Identifies invoices with duplicate `invoice_id`
2. **Rule-Based Checks**: Flags transactions with amount > ₹10,000
3. **ML Detection**: Uses IsolationForest to detect anomalies based on amount and vendor patterns

### API Endpoints

- `POST /upload-csv` - Upload CSV file and run anomaly detection
- `GET /anomalies` - Get all detected anomalies
- `GET /summary` - Get summary statistics (total invoices, active flags)

### Frontend Features

- 📤 CSV file upload
- 📊 Summary statistics dashboard
- 📈 Bar chart showing anomalies by vendor
- 🚨 Detailed alerts list with scores and reasons

## 📝 CSV Format

Expected columns in CSV file:
- `invoice_id` - Unique invoice identifier
- `vendor` - Vendor name
- `amount` - Invoice amount (numeric)
- `date` - Invoice date
- `source` - Source system (e.g., ERP, Manual)

## 🧪 Testing

1. Use the sample CSV file: `sample_data/invoices_sample.csv`
2. Upload it through the frontend interface
3. View detected anomalies in the dashboard

## 🛠️ Tech Stack

- **Backend**: FastAPI, SQLAlchemy, Pandas, Scikit-learn, SQLite
- **Frontend**: React, Vite, TailwindCSS, Chart.js, Axios
- **ML**: IsolationForest for anomaly detection

## 📄 License

MIT

