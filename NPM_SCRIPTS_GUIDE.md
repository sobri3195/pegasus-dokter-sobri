# NPM Scripts Guide

This guide explains all available npm scripts for running the Admin Panel Scanner.

## 📋 Available Scripts

### Development & Production

#### `npm run dev`
Starts the frontend development server using Vite.
- **Port**: http://localhost:3000
- **Hot reload**: Enabled
- **Use case**: Frontend development

```bash
npm run dev
```

#### `npm run build`
Builds the frontend for production.
- Creates optimized production bundle
- Output: `dist/` directory

```bash
npm run build
```

#### `npm run preview`
Preview the production build locally.
- Serves the built `dist/` directory
- Use after `npm run build`

```bash
npm run preview
```

### Backend Server

#### `npm run backend`
Starts the Node.js Express backend server.
- **Port**: http://localhost:5000
- **Features**: 
  - REST API endpoints
  - Spawns Python scanner processes
  - Handles scan requests from frontend
  - Stores results in `data/scans.json`

```bash
npm run backend
```

**API Endpoints:**
- `GET /health` - Health check
- `POST /scan` - Basic scan
- `POST /advanced-scan` - Advanced scan
- `POST /ultimate-scan` - Ultimate scan
- `GET /scans` - Get all scan history
- `GET /trends` - Get vulnerability trends
- `GET /stats` - Get statistics

### Python Scanner (Standalone)

#### `npm run scan`
Runs the basic Python scanner directly (standalone mode).
- No backend server required
- Outputs JSON to stdout
- Good for testing or CLI usage

```bash
# Syntax
npm run scan <URL>

# Example
npm run scan https://example.com
```

**Output:**
```json
{
  "url": "https://example.com",
  "timestamp": "2024-01-15T10:30:00",
  "status": "Up",
  "http_status": 200,
  "vulnerabilities": [...],
  "open_ports": [80, 443]
}
```

#### `npm run scan:advanced`
Runs the advanced Python scanner with additional features.
- Port scanning
- Subdomain enumeration
- Directory enumeration
- XSS & SQL injection testing
- External tools integration

```bash
# Syntax
npm run scan:advanced <URL> [CONFIG_JSON]

# Example with config
npm run scan:advanced https://example.com '{"port_scan": true, "xss_test": true, "sqli_test": true}'

# Example without config (default options)
npm run scan:advanced https://example.com
```

**Config Options:**
```json
{
  "port_scan": true,
  "subdomain_enum": true,
  "directory_enum": true,
  "xss_test": true,
  "sqli_test": true,
  "external_tools": false
}
```

#### `npm run scan:ultimate`
Runs the ultimate scanner with AI-powered analysis and CVE matching.
- Active exploit testing (safe mode)
- AI pattern recognition
- Form & input fuzzer
- JavaScript dependency scanner
- Recursive crawling
- Technology fingerprinting
- CVE matching
- Auto report generator

```bash
# Syntax
npm run scan:ultimate <URL> [CONFIG_JSON]

# Example with full config
npm run scan:ultimate https://example.com '{"active_exploit": true, "form_fuzzer": true, "js_scanner": true, "crawl": true, "crawl_depth": 2, "max_pages": 50, "tech_fingerprint": true, "credential_check": true, "generate_report": true}'

# Example minimal
npm run scan:ultimate https://example.com
```

**Config Options:**
```json
{
  "active_exploit": true,
  "form_fuzzer": true,
  "js_scanner": true,
  "crawl": true,
  "crawl_depth": 2,
  "max_pages": 50,
  "tech_fingerprint": true,
  "credential_check": true,
  "generate_report": true
}
```

### Combined Scripts

#### `npm run start:all`
Runs both frontend and backend concurrently using `concurrently`.
- **Best for**: Full-stack development
- Starts frontend (port 3000) and backend (port 5000) together
- Shows output from both processes
- Ctrl+C stops both processes

```bash
npm run start:all
```

**Output:**
```
[0] Vite dev server running at http://localhost:3000
[1] Backend server running at http://localhost:5000
```

#### `npm start`
Alias for `npm run start:all`.
- Default command to start the entire application

```bash
npm start
```

#### `npm run check`
Runs the backend connection check script.
- **Best for**: Verifying backend is running and accessible
- Checks if backend process is running
- Tests HTTP health endpoint
- Shows frontend status if running
- Returns exit code 0 if OK, 1 if failed

```bash
npm run check
```

**Output (when working):**
```
🔍 Checking Backend Connection...

✅ Backend process is running

🌐 Testing backend health endpoint...
✅ Backend is responding (HTTP 200)
   Response: {"status":"ok","message":"Backend server is running"}

✅ Frontend dev server is running
   Access at: http://localhost:3000

🎉 Backend connection check complete!
```

#### `npm run test:connection`
Runs comprehensive connection test suite.
- **Best for**: Detailed system verification
- Tests backend process
- Tests frontend process
- Tests all API endpoints
- Verifies Python dependencies
- Checks data directory
- Returns detailed pass/fail report

```bash
npm run test:connection
```

**Output (when working):**
```
╔═══════════════════════════════════════════════════════════╗
║     BACKEND CONNECTION COMPREHENSIVE TEST                 ║
╚═══════════════════════════════════════════════════════════╝

Test 1: Backend Process Check
  ✅ PASS - Backend process is running

Test 2: Frontend Process Check
  ✅ PASS - Frontend process is running

Test 3: Backend Health Endpoint (Direct)
  ✅ PASS - Backend responding (HTTP 200)

Test 4: Frontend Proxy Check
  ✅ PASS - Frontend proxy working (HTTP 200)

Test 5: Python Dependencies Check
  ✅ PASS - Core Python packages installed

Test 6: Data Directory Check
  ✅ PASS - Data directory and scans.json exist

Test 7: API Endpoints Availability
  ✅ PASS - All endpoints responding

╔═══════════════════════════════════════════════════════════╗
║                    TEST SUMMARY                           ║
╚═══════════════════════════════════════════════════════════╝

Tests Passed: 7
Tests Failed: 0

🎉 ALL TESTS PASSED! Backend is fully connected and operational.
```

#### `npm run status`
Shows visual system status dashboard.
- **Best for**: Quick overview of all services
- Shows backend status (running/stopped)
- Shows frontend status (running/stopped)
- Shows connection status
- Shows Python dependencies status
- Lists quick commands and access URLs

```bash
npm run status
```

**Output:**
```
╔════════════════════════════════════════════════════════════════╗
║   VULNERABILITY SCANNER - SYSTEM STATUS                        ║
╚════════════════════════════════════════════════════════════════╝

┌─── BACKEND SERVER ────────────────────────────────────────────┐
│  Status:  🟢 RUNNING                                          │
│  Port:    5000                                               │
│  URL:     http://localhost:5000                              │
│  Health:  ✅ Responding                                      │
└───────────────────────────────────────────────────────────────┘

┌─── FRONTEND SERVER ───────────────────────────────────────────┐
│  Status:  🟢 RUNNING                                          │
│  Port:    3000                                               │
│  URL:     http://localhost:3000                              │
└───────────────────────────────────────────────────────────────┘

┌─── CONNECTION STATUS ─────────────────────────────────────────┐
│  Overall: 🟢 FULLY CONNECTED AND OPERATIONAL                 │
└───────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start Workflows

### For Frontend Development
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run dev
```

### For Full-Stack Development
```bash
# Single terminal - runs both
npm start
```

### For Testing Scanner Only
```bash
# Basic test
npm run scan https://testphp.vulnweb.com

# Advanced test
npm run scan:advanced https://testphp.vulnweb.com '{"port_scan": true, "xss_test": true}'

# Ultimate test
npm run scan:ultimate https://testphp.vulnweb.com '{"active_exploit": true, "crawl_depth": 2}'
```

### For CI/CD Pipeline
```bash
# Install dependencies
npm install
pip install -r backend/requirements.txt

# Build frontend
npm run build

# Run tests (if available)
npm test

# Preview production build
npm run preview
```

## 📝 Usage Examples

### Example 1: Development Workflow
```bash
# Start everything
npm start

# Open browser
# Navigate to http://localhost:3000
# Use the UI to scan websites
```

### Example 2: CLI Scanning
```bash
# Quick basic scan
npm run scan https://example.com > results.json

# View results
cat results.json | jq
```

### Example 3: Batch Scanning
```bash
# Create a shell script
cat > batch_scan.sh << 'EOF'
#!/bin/bash
urls=(
  "https://example1.com"
  "https://example2.com"
  "https://example3.com"
)

for url in "${urls[@]}"; do
  echo "Scanning $url..."
  npm run scan "$url" > "scan_$(echo $url | sed 's/https:\/\///g' | sed 's/\//-/g').json"
done
EOF

chmod +x batch_scan.sh
./batch_scan.sh
```

### Example 4: Advanced Scan with Full Config
```bash
npm run scan:ultimate https://testphp.vulnweb.com '{
  "active_exploit": true,
  "form_fuzzer": true,
  "js_scanner": true,
  "crawl": true,
  "crawl_depth": 3,
  "max_pages": 100,
  "tech_fingerprint": true,
  "credential_check": true,
  "generate_report": true
}'
```

## 🔧 Troubleshooting

### Issue: Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Issue: Python scanner not found
```bash
# Check Python installation
python3 --version

# Install Python dependencies
pip install -r backend/requirements.txt
```

### Issue: concurrently not working
```bash
# Reinstall concurrently
npm install --save-dev concurrently

# Or run without concurrently
npm run backend &
npm run dev
```

### Issue: Permission denied
```bash
# Make scripts executable
chmod +x backend/scanner.py
chmod +x backend/advanced_scanner.py
chmod +x backend/ultimate_scanner.py
```

## 📦 Dependencies

### Node.js Dependencies
- `react` - Frontend framework
- `react-dom` - React DOM renderer
- `express` - Backend server
- `cors` - CORS middleware
- `recharts` - Charts for visualization
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `concurrently` - Run multiple commands

### Python Dependencies
See `backend/requirements.txt`:
- `requests` - HTTP library
- `beautifulsoup4` - HTML parsing
- `dnspython` - DNS resolution
- `python-nmap` - Port scanning
- Additional libraries for advanced features

## 🎯 Tips

1. **Use `npm start` for convenience** - It runs both frontend and backend together
2. **Use standalone scanner scripts** - For testing or CLI automation
3. **Check logs** - Both frontend and backend show useful debug information
4. **Monitor results** - Check `data/scans.json` for stored scan history
5. **Generated reports** - Find HTML/PDF reports in `reports/` directory

## 📚 Further Reading

- [QUICK_START.md](QUICK_START.md) - Quick start guide
- [README.md](README.md) - Main documentation
- [FEATURES.md](FEATURES.md) - Feature details
- [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md) - Advanced scanner features
- [ULTIMATE_SCANNER.md](ULTIMATE_SCANNER.md) - Ultimate scanner documentation
