# PowerShell script to start frontend
Write-Host "Starting Trace Frontend..." -ForegroundColor Green
Set-Location "$PSScriptRoot\frontend"

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install --legacy-peer-deps --ignore-scripts
    Write-Host "Installing esbuild platform binaries..." -ForegroundColor Yellow
    npm install @esbuild/win32-x64 --save-optional
}

Write-Host "Starting dev server on http://localhost:5173" -ForegroundColor Cyan
npm run dev

