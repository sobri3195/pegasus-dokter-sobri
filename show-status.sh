#!/bin/bash

# Visual Status Display Script
clear

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   VULNERABILITY SCANNER - SYSTEM STATUS                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check Backend
echo "┌─── BACKEND SERVER ────────────────────────────────────────────┐"
if ps aux | grep -q "[n]ode server.js"; then
    echo "│  Status:  🟢 RUNNING                                          │"
    echo "│  Port:    5000                                               │"
    echo "│  URL:     http://localhost:5000                              │"
    
    # Test health
    HEALTH=$(curl -s http://localhost:5000/health 2>/dev/null)
    if [ ! -z "$HEALTH" ]; then
        echo "│  Health:  ✅ Responding                                      │"
    fi
else
    echo "│  Status:  🔴 NOT RUNNING                                      │"
    echo "│  Action:  Run 'npm run backend' to start                     │"
fi
echo "└───────────────────────────────────────────────────────────────┘"
echo ""

# Check Frontend
echo "┌─── FRONTEND SERVER ───────────────────────────────────────────┐"
if ps aux | grep -q "[v]ite"; then
    echo "│  Status:  🟢 RUNNING                                          │"
    echo "│  Port:    3000                                               │"
    echo "│  URL:     http://localhost:3000                              │"
    echo "│  Proxy:   /api/* → http://localhost:5000/*                   │"
else
    echo "│  Status:  🔴 NOT RUNNING                                      │"
    echo "│  Action:  Run 'npm run dev' to start                         │"
fi
echo "└───────────────────────────────────────────────────────────────┘"
echo ""

# Connection Status
echo "┌─── CONNECTION STATUS ─────────────────────────────────────────┐"
if ps aux | grep -q "[n]ode server.js" && ps aux | grep -q "[v]ite"; then
    # Both running, test connection
    BACKEND_OK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health 2>/dev/null)
    PROXY_OK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health 2>/dev/null)
    
    if [ "$BACKEND_OK" = "200" ] && [ "$PROXY_OK" = "200" ]; then
        echo "│  Overall: 🟢 FULLY CONNECTED AND OPERATIONAL                 │"
        echo "│           Backend ↔ Frontend communication working           │"
    else
        echo "│  Overall: 🟡 PARTIALLY CONNECTED                             │"
        echo "│           Services running but communication issues          │"
    fi
elif ps aux | grep -q "[n]ode server.js"; then
    echo "│  Overall: 🟡 BACKEND ONLY                                     │"
    echo "│           Frontend not running                                │"
elif ps aux | grep -q "[v]ite"; then
    echo "│  Overall: 🔴 FRONTEND ONLY                                    │"
    echo "│           Backend not running - scans will fail               │"
else
    echo "│  Overall: 🔴 NO SERVICES RUNNING                              │"
    echo "│           Run 'npm start' to start everything                 │"
fi
echo "└───────────────────────────────────────────────────────────────┘"
echo ""

# Python Dependencies
echo "┌─── PYTHON SCANNERS ───────────────────────────────────────────┐"
if python3 -c "import requests, bs4, dns.resolver, nmap" 2>/dev/null; then
    echo "│  Dependencies: ✅ Installed                                   │"
    echo "│  Scanners:     Ready to use                                  │"
else
    echo "│  Dependencies: ❌ Missing                                     │"
    echo "│  Action:       Run installation commands                     │"
fi
echo "└───────────────────────────────────────────────────────────────┘"
echo ""

# Quick Commands
echo "┌─── QUICK COMMANDS ────────────────────────────────────────────┐"
echo "│  npm start              - Start both frontend & backend       │"
echo "│  npm run backend        - Start backend only                  │"
echo "│  npm run dev            - Start frontend only                 │"
echo "│  npm run check          - Quick connection check              │"
echo "│  npm run test:connection - Comprehensive connection test      │"
echo "└───────────────────────────────────────────────────────────────┘"
echo ""

# Show access URLs if services are running
if ps aux | grep -q "[n]ode server.js" || ps aux | grep -q "[v]ite"; then
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║   ACCESS YOUR APPLICATION                                      ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    if ps aux | grep -q "[v]ite"; then
        echo "  🌐 Frontend:  http://localhost:3000"
    fi
    if ps aux | grep -q "[n]ode server.js"; then
        echo "  🔌 Backend:   http://localhost:5000/health"
    fi
    echo ""
fi
