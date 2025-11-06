# OpenFront School Edition Startup Script (PowerShell)
# This script sets up and starts the school edition of OpenFront

Write-Host "🎮 Starting OpenFront School Edition..." -ForegroundColor Green
Write-Host "====================================="

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Build the application
Write-Host "🏗️  Building OpenFront..." -ForegroundColor Yellow
npm run build-prod
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build application" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Application built successfully" -ForegroundColor Green

# Set environment variables for production
$env:NODE_ENV = "production"
if (-not $env:PORT) { $env:PORT = "3001" }

Write-Host "🚀 Starting the game server..." -ForegroundColor Green
Write-Host "📍 Server will be available at: http://localhost:$($env:PORT)" -ForegroundColor Cyan
Write-Host "👥 Students can connect using the URL above" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "====================================="

# Start the school server
npm run school:server