#!/bin/bash

# OpenFront School Edition Startup Script
# This script sets up and starts the school edition of OpenFront

echo "🎮 Starting OpenFront School Edition..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Build the school edition
echo "🏗️  Building school edition..."
npm run school:build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build school edition"
    exit 1
fi
echo "✅ School edition built successfully"

# Set environment variables for production
export NODE_ENV=production
export PORT=${PORT:-3001}

echo "🚀 Starting the game server..."
echo "📍 Server will be available at: http://localhost:${PORT}"
echo "👥 Students can connect using the URL above"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================="

# Start the school server
npm run school:server