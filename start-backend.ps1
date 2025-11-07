# PowerShell script to start backend
Write-Host "Starting Trace Backend..." -ForegroundColor Green
Set-Location "$PSScriptRoot\backend"

Write-Host "Installing/updating dependencies..." -ForegroundColor Yellow
python -m pip install -r requirements.txt

Write-Host "Starting server on http://localhost:8000" -ForegroundColor Cyan
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

