# 🔌 Backend Connection Guide

## Connection Architecture

```
Frontend (React + Vite)     Backend (Express + Python)
Port 3000                   Port 5000
    │                             │
    └──── /api/* ───────────────> /
          (Vite Proxy)
```

## How to Connect

### Step 1: Start the Backend Server

Choose one of these methods:

#### Option A: Use npm script (Recommended)
```bash
npm run backend
```

#### Option B: Direct Node.js
```bash
node server.js
```

The backend should display:
```
Backend server running on http://localhost:5000
Python scanner ready
```

### Step 2: Start the Frontend

In a separate terminal:
```bash
npm run dev
```

Or start both at once:
```bash
npm start
# or
npm run start:all
```

## Verify Connection

### 1. Check Backend Health

Open your browser or use curl:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok","message":"Backend server is running"}
```

### 2. Check Frontend Connection Status

1. Open http://localhost:3000
2. Navigate to "Scan Website" page
3. Look at the top-right corner for the connection indicator:
   - 🟢 Green dot with "Backend Connected" = ✅ Working
   - 🔴 Red dot with "Backend Disconnected" = ❌ Not working
   - 🟡 Yellow dot with "Checking Backend..." = ⏳ Connecting

## Troubleshooting

### Backend shows "Disconnected"

**Problem:** Frontend can't reach the backend server

**Solutions:**

1. **Verify backend is running:**
   ```bash
   # Check if process is running
   ps aux | grep "node server.js"
   
   # Check if port 5000 is in use
   lsof -i :5000
   # or
   netstat -tuln | grep 5000
   ```

2. **Restart the backend:**
   ```bash
   # Stop any existing backend process
   pkill -f "node server.js"
   
   # Start again
   npm run backend
   ```

3. **Check for port conflicts:**
   - Make sure no other service is using port 5000
   - Try changing the port in `server.js` if needed

4. **Test backend directly:**
   ```bash
   curl http://localhost:5000/health
   ```
   If this fails, the backend isn't running properly.

### Frontend can't access backend API

**Problem:** Vite proxy configuration issue

**Solution:**

Check `vite.config.js` has the correct proxy setup:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

This means:
- Frontend call: `fetch('/api/health')`
- Proxied to: `http://localhost:5000/health`

### CORS Issues

**Problem:** Cross-Origin Resource Sharing errors

**Solution:**

The backend already has CORS enabled in `server.js`:
```javascript
app.use(cors());
```

If you still see CORS errors, ensure you're accessing the frontend through the Vite dev server (http://localhost:3000) and not opening the HTML file directly.

## Connection Flow

1. **Frontend makes a request:**
   ```javascript
   const response = await fetch('/api/health')
   ```

2. **Vite proxy intercepts:**
   - Sees `/api/` prefix
   - Removes `/api` from path
   - Forwards to `http://localhost:5000/health`

3. **Backend receives and responds:**
   ```javascript
   app.get('/health', (req, res) => {
     res.json({ status: 'ok', message: 'Backend server is running' })
   })
   ```

4. **Response flows back:**
   - Backend → Vite Proxy → Frontend
   - Frontend updates connection status indicator

## Testing the Connection

Run this test script in your browser console (with frontend open at localhost:3000):

```javascript
// Test backend connection
fetch('/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend connected:', data))
  .catch(err => console.error('❌ Backend disconnected:', err))
```

Expected output:
```
✅ Backend connected: {status: "ok", message: "Backend server is running"}
```

## Quick Commands Reference

```bash
# Check if backend is running
curl http://localhost:5000/health

# Start backend only
npm run backend

# Start frontend only
npm run dev

# Start both (recommended)
npm start

# Kill backend process
pkill -f "node server.js"

# Kill frontend process
pkill -f "vite"

# View backend logs (if running in background)
tail -f backend.log
```

## Need More Help?

- Check the main [README.md](./README.md) for full documentation
- See [QUICK_START.md](./QUICK_START.md) for basic usage
- Review [NPM_SCRIPTS_GUIDE.md](./NPM_SCRIPTS_GUIDE.md) for all available commands
