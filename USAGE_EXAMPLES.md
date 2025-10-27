# Usage Examples - npm run scan

This document provides practical examples for using the npm scripts, especially the `npm run scan` command.

## 🎯 Quick Examples

### 1. Run the Full Application

```bash
# Start both frontend and backend together (recommended)
npm start

# Or use the long form
npm run start:all
```

This will:
- Start Vite dev server on http://localhost:3000
- Start Express backend on http://localhost:5000
- Show logs from both in the same terminal
- Press Ctrl+C to stop both

### 2. Run Frontend and Backend Separately

```bash
# Terminal 1 - Start backend
npm run backend

# Terminal 2 - Start frontend
npm run dev
```

### 3. Run Python Scanner Directly (Standalone)

```bash
# Basic scan
npm run scan https://example.com

# Scan with output to file
npm run scan https://example.com > scan_results.json

# View formatted results
npm run scan https://example.com | jq .
```

## 📋 Scanner Modes

### Basic Scanner
Quick security check with essential vulnerability scanning.

```bash
# Scan a website
npm run scan https://testphp.vulnweb.com

# Multiple URLs
npm run scan https://example.com > example.json
npm run scan https://google.com > google.json
npm run scan https://github.com > github.json
```

**What it checks:**
- HTTP status and accessibility
- SSL certificate validity
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Open ports (21, 22, 80, 443, 3306, 8080)
- Redirect chains

### Advanced Scanner
Deep vulnerability analysis with configurable options.

```bash
# Basic advanced scan (default config)
npm run scan:advanced https://testphp.vulnweb.com

# With port scanning
npm run scan:advanced https://example.com '{"port_scan": true}'

# With XSS and SQLi testing
npm run scan:advanced https://testphp.vulnweb.com '{"xss_test": true, "sqli_test": true}'

# Full advanced scan
npm run scan:advanced https://testphp.vulnweb.com '{
  "port_scan": true,
  "subdomain_enum": true,
  "directory_enum": true,
  "xss_test": true,
  "sqli_test": true,
  "external_tools": false
}'
```

**Additional features:**
- Layer 3-4: Port scanning
- Layer 7: HTTP/HTTPS scanning
- Application layer: XSS, SQL Injection testing
- Directory and subdomain enumeration
- AI-assisted vulnerability classification
- Risk scoring (0-100)

### Ultimate Scanner
Comprehensive AI-powered analysis with CVE matching.

```bash
# Basic ultimate scan
npm run scan:ultimate https://testphp.vulnweb.com

# With specific features
npm run scan:ultimate https://example.com '{
  "active_exploit": true,
  "form_fuzzer": true,
  "js_scanner": true,
  "crawl": true,
  "crawl_depth": 2,
  "max_pages": 50
}'

# Full-featured scan with report generation
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

**Ultimate features:**
- 🔬 Active exploit testing (safe mode)
- 🧠 AI-based pattern recognition
- 📝 Form & input fuzzer
- 📦 JavaScript & dependency scanner
- 🕸️ Recursive crawling
- 🧬 Technology fingerprinting
- 🐛 CVE matching with offline database
- ⚙️ Smart risk correlation
- 📄 Auto HTML/PDF report generation
- 🔒 Credential & session security checker

## 🔄 Batch Scanning

### Scan Multiple URLs

Create a shell script:

```bash
#!/bin/bash
# batch_scan.sh

urls=(
  "https://example.com"
  "https://testphp.vulnweb.com"
  "https://demo.testfire.net"
)

for url in "${urls[@]}"; do
  echo "Scanning $url..."
  filename=$(echo "$url" | sed 's/https\?:\/\///g' | sed 's/\//_/g')
  npm run scan "$url" > "scans/${filename}.json"
  echo "Results saved to scans/${filename}.json"
done
```

Run it:
```bash
mkdir -p scans
chmod +x batch_scan.sh
./batch_scan.sh
```

### Scheduled Scanning

Using cron:

```bash
# Add to crontab
crontab -e

# Add this line to scan daily at 2 AM
0 2 * * * cd /path/to/project && npm run scan https://example.com >> /path/to/logs/scan.log 2>&1
```

## 📊 Output Processing

### Parse JSON Output

```bash
# Get URL
npm run scan https://example.com | jq -r '.url'

# Get status
npm run scan https://example.com | jq -r '.status'

# Count vulnerabilities
npm run scan https://example.com | jq '.vulnerabilities | length'

# List high severity issues
npm run scan https://example.com | jq '.vulnerabilities[] | select(.severity == "High")'

# Get open ports
npm run scan https://example.com | jq -r '.open_ports[]'
```

### Generate Summary Report

```bash
#!/bin/bash
# generate_summary.sh

url="$1"
result=$(npm run scan "$url" 2>/dev/null)

echo "==================================="
echo "Scan Report for: $(echo "$result" | jq -r '.url')"
echo "==================================="
echo ""
echo "Status: $(echo "$result" | jq -r '.status')"
echo "HTTP Status: $(echo "$result" | jq -r '.http_status')"
echo "Timestamp: $(echo "$result" | jq -r '.timestamp')"
echo ""
echo "Vulnerabilities Found: $(echo "$result" | jq '.vulnerabilities | length')"
echo ""
echo "Open Ports: $(echo "$result" | jq -r '.open_ports | join(", ")')"
echo ""
echo "=== Vulnerabilities ==="
echo "$result" | jq -r '.vulnerabilities[] | "- [\(.severity)] \(.type): \(.description)"'
```

Usage:
```bash
chmod +x generate_summary.sh
./generate_summary.sh https://example.com
```

## 🧪 Testing & Development

### Test Scanner Without UI

```bash
# Test basic scanner
npm run scan https://example.com | jq .

# Test advanced scanner
npm run scan:advanced https://testphp.vulnweb.com | jq .

# Test ultimate scanner
npm run scan:ultimate https://testphp.vulnweb.com | jq .
```

### Debug Mode

Check Python errors:

```bash
# Run with full stderr output
npm run scan https://example.com 2>&1

# Or directly with Python
python3 backend/scanner.py https://example.com
```

### Performance Testing

```bash
# Measure scan time
time npm run scan https://example.com

# Results:
# real    0m5.234s
# user    0m2.123s
# sys     0m0.456s
```

## 📈 Integration Examples

### CI/CD Pipeline

**.github/workflows/scan.yml**

```yaml
name: Security Scan

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          npm install
          pip install -r backend/requirements.txt
      
      - name: Run scan
        run: npm run scan https://example.com > scan_results.json
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: scan-results
          path: scan_results.json
```

### Docker Integration

**Dockerfile**

```dockerfile
FROM node:18-alpine

# Install Python
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/requirements.txt ./backend/

# Install dependencies
RUN npm install
RUN pip install -r backend/requirements.txt --break-system-packages

# Copy application
COPY . .

# Run scanner
CMD ["npm", "run", "scan", "https://example.com"]
```

Build and run:
```bash
docker build -t scanner .
docker run scanner npm run scan https://testphp.vulnweb.com
```

## 🚨 Common Issues

### Issue 1: Python not found
```bash
# Check Python installation
python3 --version

# Install Python 3 (Ubuntu/Debian)
sudo apt install python3 python3-pip
```

### Issue 2: Module not found
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Or with --break-system-packages
pip install -r backend/requirements.txt --break-system-packages
```

### Issue 3: Permission denied
```bash
# Make Python scripts executable
chmod +x backend/*.py
```

### Issue 4: Port already in use
```bash
# Check what's using the port
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Issue 5: Concurrently not working
```bash
# Reinstall concurrently
npm install --save-dev concurrently

# Or run manually in separate terminals
npm run backend  # Terminal 1
npm run dev      # Terminal 2
```

## 💡 Pro Tips

1. **Use jq for JSON processing**
   ```bash
   npm install -g jq
   npm run scan https://example.com | jq .
   ```

2. **Redirect stderr to file**
   ```bash
   npm run scan https://example.com 2> errors.log
   ```

3. **Save all output**
   ```bash
   npm run scan https://example.com &> full_output.log
   ```

4. **Background scanning**
   ```bash
   npm run scan https://example.com > results.json 2>&1 &
   ```

5. **Monitor scan progress**
   ```bash
   npm run scan:ultimate https://example.com 2>&1 | tee scan.log
   ```

6. **Compare scans**
   ```bash
   # First scan
   npm run scan https://example.com > scan1.json
   
   # Second scan (later)
   npm run scan https://example.com > scan2.json
   
   # Compare
   diff <(jq -S . scan1.json) <(jq -S . scan2.json)
   ```

## 📚 Additional Resources

- [NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md) - Complete npm scripts documentation
- [README.md](README.md) - Main project documentation
- [QUICK_START.md](QUICK_START.md) - Quick start guide
- [FEATURES.md](FEATURES.md) - Feature list
- [ULTIMATE_SCANNER.md](ULTIMATE_SCANNER.md) - Ultimate scanner details

## 🎯 Summary

```bash
# Development
npm start                    # Start everything
npm run dev                  # Frontend only
npm run backend              # Backend only

# Scanning
npm run scan <URL>           # Basic scan
npm run scan:advanced <URL>  # Advanced scan
npm run scan:ultimate <URL>  # Ultimate scan

# Production
npm run build                # Build for production
npm run preview              # Preview production build
```

Happy scanning! 🔒🔍
