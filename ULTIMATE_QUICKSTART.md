# 🚀 Ultimate Scanner Quick Start Guide

## Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Modern web browser

## Installation

### 1. Install Node Dependencies

```bash
npm install
```

### 2. Install Python Dependencies

```bash
pip install -r backend/requirements.txt
```

**Dependencies installed:**
- requests (HTTP client)
- beautifulsoup4 (HTML parsing)
- dnspython (DNS resolver)
- python-nmap (Port scanning)
- scikit-learn (Machine learning)
- numpy (Numerical computing)
- reportlab (PDF generation)

## Running the Application

You need **TWO terminals**:

### Terminal 1 - Backend Server

```bash
npm run scan
# or
node server.js
```

**Output:**
```
Backend server running on http://localhost:5000
Python scanner ready
```

### Terminal 2 - Frontend Server

```bash
npm run dev
```

**Output:**
```
VITE v5.0.8  ready in 543 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Using Ultimate Scanner

### Step 1: Open the Application

Open your browser and navigate to: `http://localhost:5173`

### Step 2: Navigate to Scan Page

Click **"Scan Website"** in the sidebar

### Step 3: Select Ultimate Scanner Mode

Choose the **🚀 Ultimate Scanner** radio button

### Step 4: Enter Target URL

```
https://example.com
```

⚠️ **Important:** Only scan websites you own or have permission to test!

### Step 5: Configure Features

**Recommended Configuration:**

✅ **Active Exploit Testing** - Safe XSS, SQLi, LFI testing  
✅ **Form Fuzzer** - Auto-detect and test all forms  
✅ **JS Library Scanner** - Check libraries for CVEs  
✅ **Recursive Crawl** - Crawl and scan all pages  
✅ **Tech Fingerprinting** - Identify CMS & frameworks  
✅ **Credential Checker** - Analyze login security  
☐ **Generate Report** - Create HTML & PDF reports (optional)

**Crawl Settings:**
- Max Crawl Depth: `2` (recommended for faster scans)
- Max Pages: `30` (increase for larger sites)

### Step 6: Start Scan

Click **🚀 Start Ultimate Scan**

**Scan Duration:** 2-5 minutes depending on configuration

### Step 7: Review Results

The scan will display:

1. **Risk Score** (0-100)
   - 80-100: ✅ Safe (Green)
   - 60-79: ⚠️ Warning (Orange)
   - 0-59: 🔴 Danger (Red)

2. **Vulnerabilities**
   - Type, severity, description
   - AI classification
   - Remediation recommendations

3. **Technology Stack**
   - Detected CMS, frameworks, servers
   - Risk levels
   - Common vulnerabilities

4. **CVE Matches**
   - Vulnerable libraries found
   - CVE IDs with NVD links
   - Severity levels

5. **Forms & JS Libraries**
   - Discovered forms
   - JavaScript libraries with versions

6. **Crawled Pages**
   - All pages scanned
   - Status codes and depth

7. **Credential Issues**
   - Login security problems
   - Cookie security
   - HTTPS/CSRF issues

8. **Statistics**
   - Total vulnerabilities
   - Pages crawled
   - Forms found
   - Libraries detected
   - CVE matches

## Example Scan

### Test Against Example.com (Public)

```bash
# In the UI, enter:
URL: https://example.com
Mode: Ultimate Scanner
Config: All features enabled
Depth: 2
Pages: 20
```

**Expected Results:**
- Basic security headers check
- No forms (simple page)
- No JavaScript libraries
- Safe risk score
- Quick scan (< 30 seconds)

### Test Against Your Own Site

```bash
URL: https://yourwebsite.com
Mode: Ultimate Scanner
Config: All features enabled
Depth: 3
Pages: 50
```

**Expected Results:**
- Comprehensive vulnerability scan
- Form fuzzing results
- Library CVE matches
- Technology fingerprinting
- Full risk assessment
- Longer scan (2-3 minutes)

## Understanding Results

### Risk Score Calculation

**Starting Score:** 100 (perfect security)

**Deductions:**
- Critical vulnerability: -20 points
- High vulnerability: -15 points
- Medium vulnerability: -8 points
- Low vulnerability: -3 points

**Correlation Bonuses:**
- Outdated JS + Missing Headers: -10 extra
- Injection + Missing Headers: -15 extra (Critical!)

### Severity Levels

- **Critical**: Immediate action required (SQL injection, RCE)
- **High**: Serious security risk (XSS, authentication bypass)
- **Medium**: Moderate risk (missing headers, info disclosure)
- **Low**: Minor issue (version disclosure, redirects)

### AI Classification

The AI classifier uses machine learning to detect:
- SQL injection patterns
- XSS indicators
- Error/debug information
- Confidence scores (0.0-1.0)

**High Confidence:** > 0.8 (likely vulnerable)  
**Medium Confidence:** 0.6-0.8 (possible vulnerability)  
**Low Confidence:** < 0.6 (needs manual review)

## Advanced Usage

### API Testing

You can also use the API directly:

```bash
curl -X POST http://localhost:5000/ultimate-scan \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "config": {
      "active_exploit_test": true,
      "form_fuzzer": true,
      "js_scanner": true,
      "recursive_crawl": true,
      "tech_fingerprint": true,
      "credential_check": true,
      "generate_report": false,
      "max_crawl_depth": 2,
      "max_pages": 30
    }
  }'
```

### Generating Reports

Enable **Generate Report** to create:

1. **HTML Report** → `reports/report.html`
   - Modern, responsive design
   - Full vulnerability details
   - Color-coded severity
   - Technology stack visualization

2. **PDF Report** → `reports/report.pdf`
   - Professional formatting
   - Printable format
   - Executive summary
   - Compact vulnerability list

**Accessing Reports:**

After scan completes, click the download buttons in the results page.

### Customizing CVE Database

Update `data/cve_db.json` to add new CVEs:

```json
{
  "libraries": {
    "your-library": {
      "versions": {
        "1.x": {
          "vulnerabilities": [
            {
              "cve": "CVE-2024-XXXXX",
              "severity": "High",
              "description": "Your vulnerability description",
              "affected": ["<1.5.0"],
              "reference": "https://nvd.nist.gov/vuln/detail/CVE-2024-XXXXX"
            }
          ]
        }
      }
    }
  }
}
```

### Adding Technology Fingerprints

Update `data/tech_fingerprints.json`:

```json
{
  "cms": {
    "YourCMS": {
      "indicators": ["/your-path/", "YourCMS"],
      "headers": ["X-Powered-By: YourCMS"],
      "meta_tags": ["generator.*YourCMS"],
      "cookies": ["yourcms_session"],
      "risk_level": "Medium",
      "common_vulns": ["Your common vulnerabilities"]
    }
  }
}
```

## Troubleshooting

### Backend Not Running

**Problem:** "Backend Disconnected" message

**Solution:**
```bash
# Start backend in Terminal 1
npm run scan
# or
node server.js
```

### Python Dependencies Missing

**Problem:** Import errors in console

**Solution:**
```bash
pip install -r backend/requirements.txt
```

### Scan Takes Too Long

**Problem:** Scan exceeds 5 minutes

**Solution:**
- Reduce `max_crawl_depth` to 1-2
- Reduce `max_pages` to 20-30
- Disable recursive crawl for quick scan
- Disable report generation

### No Results Displayed

**Problem:** Scan completes but no results shown

**Solution:**
- Check browser console for errors
- Verify backend logs for Python errors
- Test with simpler site (example.com)
- Reduce scan complexity

### Port Already in Use

**Problem:** `EADDRINUSE` error

**Solution:**
```bash
# Kill process on port 5000
kill -9 $(lsof -t -i:5000)

# Or use different port
PORT=5001 node server.js
```

## Performance Tips

### For Faster Scans

- Disable recursive crawl
- Set max_pages to 10-20
- Disable report generation
- Test against smaller sites first

### For Comprehensive Scans

- Enable all features
- Set max_crawl_depth to 3-5
- Set max_pages to 50-100
- Enable report generation
- Run during off-peak hours

## Security & Legal

### ⚠️ Important Warnings

1. **Authorization Required**
   - Only scan websites you own
   - Get written permission for client sites
   - Never scan without authorization

2. **Legal Implications**
   - Unauthorized scanning may be illegal
   - Can result in criminal charges
   - May violate ToS of hosting providers

3. **Ethical Use**
   - Use for security education only
   - Report findings responsibly
   - Don't exploit vulnerabilities found

### Safe Mode Guarantees

- No actual exploitation occurs
- Payloads are non-destructive
- Only checks for reflection/errors
- Suitable for authorized testing
- Results marked as "safe_mode: true"

## Next Steps

1. **Test Basic Scan**: Try example.com first
2. **Review Documentation**: Read ULTIMATE_SCANNER.md
3. **Scan Your Site**: Test your own website
4. **Analyze Results**: Review vulnerabilities found
5. **Remediate Issues**: Fix security problems
6. **Rescan**: Verify fixes worked

## Support & Resources

- **Full Documentation**: See `ULTIMATE_SCANNER.md`
- **General Features**: See `README.md`
- **Advanced Features**: See `ADVANCED_FEATURES.md`
- **Project Summary**: See `PROJECT_SUMMARY.md`

## Quick Reference

### Scanner Modes

| Mode | Speed | Depth | Use Case |
|------|-------|-------|----------|
| Basic | ⚡ Fast | 1 | Quick check |
| Advanced | 🔬 Medium | 2-3 | Deep analysis |
| Ultimate | 🚀 Slow | 1-5 | Comprehensive |

### Feature Matrix

| Feature | Basic | Advanced | Ultimate |
|---------|-------|----------|----------|
| Port Scan | ❌ | ✅ | ✅ |
| Headers | ✅ | ✅ | ✅ |
| SSL Check | ✅ | ✅ | ✅ |
| Exploit Test | ❌ | ☐ | ✅ |
| Form Fuzzer | ❌ | ❌ | ✅ |
| JS Scanner | ❌ | ❌ | ✅ |
| CVE Match | ❌ | ❌ | ✅ |
| AI Detection | ❌ | ❌ | ✅ |
| Tech Fingerprint | ❌ | ☐ | ✅ |
| Credential Check | ❌ | ❌ | ✅ |
| Reports | ❌ | ❌ | ✅ |

## Ready to Start?

```bash
# Terminal 1
npm run scan

# Terminal 2  
npm run dev

# Browser
http://localhost:5173
```

**Happy Scanning! 🔒**
