#!/bin/bash

echo "🚀 Starting Admin Panel Vulnerability Scanner..."
echo ""

echo "📦 Checking dependencies..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "📥 Installing Node.js dependencies..."
    npm install
fi

echo ""
echo "✅ All dependencies are ready"
echo ""
echo "🔧 Starting services..."
echo ""

echo "📡 Starting Backend Server (Node.js + Python Scanner) on port 5000..."
node server.js &
BACKEND_PID=$!

sleep 2

echo "🌐 Starting Frontend Development Server on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ All services started!"
echo ""
echo "📌 Access the application at: http://localhost:3000"
echo "📌 Backend API running at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

wait
