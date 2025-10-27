#!/bin/bash

# Backend Connection Check Script
# This script verifies that the backend server is running and accessible

echo "🔍 Checking Backend Connection..."
echo ""

# Check if backend process is running
if ps aux | grep -q "[n]ode server.js"; then
    echo "✅ Backend process is running"
else
    echo "❌ Backend process is NOT running"
    echo "   Start it with: npm run backend"
    exit 1
fi

# Check if backend is responding on port 5000
if command -v curl &> /dev/null; then
    echo ""
    echo "🌐 Testing backend health endpoint..."
    
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)
    
    if [ "$RESPONSE" -eq 200 ]; then
        echo "✅ Backend is responding (HTTP $RESPONSE)"
        
        # Get and display the actual response
        HEALTH_DATA=$(curl -s http://localhost:5000/health)
        echo "   Response: $HEALTH_DATA"
    else
        echo "❌ Backend is not responding properly (HTTP $RESPONSE)"
        exit 1
    fi
else
    echo "⚠️  curl not found, skipping HTTP test"
fi

# Check if frontend is running
echo ""
if ps aux | grep -q "[v]ite"; then
    echo "✅ Frontend dev server is running"
    echo "   Access at: http://localhost:3000"
else
    echo "⚠️  Frontend dev server is NOT running"
    echo "   Start it with: npm run dev"
fi

echo ""
echo "🎉 Backend connection check complete!"
echo ""
echo "To test the full connection:"
echo "1. Open http://localhost:3000"
echo "2. Go to 'Scan Website' page"
echo "3. Check for green dot with 'Backend Connected' message"
