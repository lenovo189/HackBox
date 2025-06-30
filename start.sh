#!/bin/bash

# Replit Clone IDE Startup Script

echo "🚀 Starting Replit Clone IDE..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Together AI API key is set
if [ -z "$TOGETHER_API_KEY" ]; then
    echo "⚠️  TOGETHER_API_KEY environment variable is not set."
    echo "   Some AI features may not work properly."
    echo "   Get a free API key at: https://together.ai"
fi

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Setup backend if needed
if [ ! -d "backend/venv" ]; then
    echo "🐍 Setting up Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Start backend server in background
echo "🔧 Starting Flask backend server..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "⚛️  Starting React frontend server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Replit Clone IDE is starting up!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 