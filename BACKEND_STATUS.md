# 🔌 Backend Status & Connection Info

## Current Status

### ✅ Backend is Running

The backend server is currently **RUNNING** and **CONNECTED**.

- **Status**: 🟢 Active
- **Port**: 5000
- **Health Check**: http://localhost:5000/health
- **Started**: Via `npm run backend`

## How to Verify

### Quick Check
```bash
npm run check
```

### Manual Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok","message":"Backend server is running"}
```

## Connection Details

### Architecture
```
Frontend (localhost:3000) 
    ↓ [/api/* requests]
    ↓ [Vite Proxy]
    ↓
Backend (localhost:5000)
    ↓
Python Scanners
```

### How Frontend Connects

1. Frontend makes request to `/api/health`
2. Vite proxy intercepts and forwards to `http://localhost:5000/health`
3. Backend responds with JSON
4. Frontend updates connection indicator (green/red dot)

### Connection Indicator

Location: **Scan Website** page (top-right corner)

- 🟢 **Green dot** + "Backend Connected" = Working ✅
- 🔴 **Red dot** + "Backend Disconnected" = Not working ❌
- 🟡 **Yellow dot** + "Checking Backend..." = Checking ⏳

## Starting the Backend

### Method 1: Start Everything
```bash
npm start
```

### Method 2: Backend Only
```bash
npm run backend
```

### Method 3: Using Shell Script
```bash
./start.sh
```

## Stopping the Backend

```bash
# Find and kill the process
pkill -f "node server.js"

# Or use Ctrl+C if running in terminal
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/scan` | POST | Basic scan |
| `/advanced-scan` | POST | Advanced scan |
| `/ultimate-scan` | POST | Ultimate scan |
| `/scans` | GET | Get all scans |
| `/trends` | GET | Get trends |
| `/stats` | GET | Get statistics |

## Troubleshooting

### Problem: Backend Disconnected

**Solution 1: Check if running**
```bash
ps aux | grep "node server.js"
```

**Solution 2: Check port**
```bash
lsof -i :5000
```

**Solution 3: Restart**
```bash
pkill -f "node server.js"
npm run backend
```

### Problem: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Or change port in server.js
```

### Problem: Python Scanner Error

**Solution**:
```bash
# Install Python dependencies
pip3 install -r backend/requirements.txt

# Or with flag
pip3 install -r backend/requirements.txt --break-system-packages
```

## Logs

### View Backend Logs

If backend is running in background:
```bash
cat backend.log
tail -f backend.log  # Follow logs in real-time
```

If running in foreground, logs appear in terminal.

## Auto-Start on System Boot

### Using systemd (Linux)

Create service file:
```bash
sudo nano /etc/systemd/system/scanner-backend.service
```

Add:
```ini
[Unit]
Description=Scanner Backend Server
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/project
ExecStart=/usr/bin/npm run backend
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable scanner-backend
sudo systemctl start scanner-backend
```

## Documentation Links

- 📖 [KONEKSI_BACKEND.md](./KONEKSI_BACKEND.md) - Panduan lengkap (Indonesian)
- 📖 [BACKEND_CONNECTION.md](./BACKEND_CONNECTION.md) - Complete guide (English)
- 📖 [README.md](./README.md) - Main documentation
- 📖 [QUICK_START.md](./QUICK_START.md) - Quick start guide
- 📖 [NPM_SCRIPTS_GUIDE.md](./NPM_SCRIPTS_GUIDE.md) - All npm commands

## Quick Commands

```bash
# Start backend
npm run backend

# Check connection
npm run check

# Test health endpoint
curl http://localhost:5000/health

# View running process
ps aux | grep "node server.js"

# Check port usage
lsof -i :5000

# Stop backend
pkill -f "node server.js"
```

---

**Last Updated**: Backend is currently running and responding to requests.
**Next Steps**: Open http://localhost:3000 and verify green connection indicator on Scan Website page.
