# 🚀 Ultimate Web Vulnerability Scanner

## Overview

The Ultimate Scanner is an advanced, AI-powered web vulnerability scanner that includes 10 cutting-edge features for comprehensive security testing. It combines safe exploit testing, machine learning pattern recognition, form fuzzing, JavaScript library CVE matching, recursive crawling, technology fingerprinting, and intelligent risk correlation.

## 🎯 10 Advanced Features

### 1. 🔬 Active Exploit Testing (Safe Mode)

**Description:** Tests for real vulnerabilities using safe, non-destructive payloads.

**Features:**
- XSS reflection testing with multiple payloads (`<script>alert(1)</script>`, `<img src=x onerror=alert(1)>`)
- SQL injection testing with error-based and blind SQLi detection
- Local File Inclusion (LFI) testing (`../../etc/passwd`)
- All tests run in safe mode - no actual exploitation
- Results marked as `safe_mode: true`

**How it works:**
- Detects URL parameters automatically
- Tests each parameter with vulnerability-specific payloads
- Checks for reflection, error messages, and response differences
- Uses AI classification to verify findings

### 2. 🧠 AI-Based Pattern Recognition

**Description:** Uses machine learning (scikit-learn) to detect vulnerability patterns in responses.

**Features:**
- Trained Naive Bayes classifier for response analysis
- Categories: Safe, SQLi, XSS, Error/Debug disclosure
- Confidence scores for each detection
- Fallback to rule-based classification if ML unavailable

**Training Data:**
- SQL error patterns (MySQL, PostgreSQL, Oracle, MSSQL)
- XSS indicators (script tags, event handlers)
- Error patterns (stack traces, exceptions)
- Safe response patterns

**Usage:**
```python
classification = ai.classify_response(response_text)
# Returns: {'category': 'sqli', 'confidence': 0.85, 'vulnerable': True}
```

### 3. 📝 Form & Input Fuzzer

**Description:** Automatically discovers and fuzzes all forms on the website.

**Features:**
- BeautifulSoup-based form detection
- Finds all input fields, textareas, and selects
- Tests each field with XSS, SQLi, and command injection payloads
- Tracks both GET and POST forms
- AI-powered result verification

**Test Payloads:**
- XSS: `<script>alert(1)</script>`, `<img src=x onerror=alert(1)>`
- SQLi: `' OR '1'='1`, `" OR "1"="1`
- Command: `$(whoami)`, `` `whoami` ``, `;ls`

**Detection:**
- Payload reflection in response
- AI classification of responses
- Error message detection

### 4. 📦 JavaScript & Dependency Scanner

**Description:** Scans for JavaScript libraries and matches them against CVE database.

**Features:**
- Detects popular libraries (jQuery, React, Angular, Vue, Bootstrap)
- Version extraction from CDN URLs
- Matches versions against local CVE database
- Severity scoring (Critical, High, Medium, Low)

**Supported Libraries:**
- jQuery (CVE-2015-9251, CVE-2019-11358, CVE-2020-11022, CVE-2020-11023)
- React (CVE-2018-6341)
- Angular (CVE-2019-10768, CVE-2020-7676)
- Vue (CVE-2020-15883)

**CVE Database:**
Located at `data/cve_db.json` - includes:
- Library versions
- CVE IDs
- Severity levels
- Descriptions
- NVD references

### 5. 🕸️ Crawl + Recursive Scanning

**Description:** Recursively crawls internal pages and scans each for vulnerabilities.

**Features:**
- Configurable crawl depth (default: 3 levels)
- Configurable max pages (default: 50 pages)
- Same-domain restriction (only crawls internal links)
- Progress tracking (pages visited, depth level)
- Extracts page titles
- Records HTTP status codes

**Configuration:**
```json
{
  "recursive_crawl": true,
  "max_crawl_depth": 2,
  "max_pages": 30
}
```

**Output:**
```json
{
  "url": "https://example.com/about",
  "status_code": 200,
  "depth": 1,
  "title": "About Us"
}
```

### 6. 🧬 Web Technology Fingerprinting

**Description:** Identifies CMS, frameworks, servers, and programming languages.

**Features:**
- Signature-based detection using `tech_fingerprints.json`
- Multi-layer detection:
  - Response headers
  - Cookies
  - HTML content
  - Meta tags
- Risk assessment for each technology

**Detected Technologies:**

**CMS:**
- WordPress, Joomla, Drupal, Magento, Shopify

**Frameworks:**
- Laravel, Django, Express, Ruby on Rails, Spring Boot

**Servers:**
- Apache, Nginx, IIS, Tomcat

**Languages:**
- PHP, ASP.NET, Node.js, Python

**Risk Levels:**
- Low: Modern, well-maintained technologies
- Medium: Popular but with known vulnerabilities
- High: Critical technologies (e-commerce, payment processing)

### 7. 🐛 CVE Matching & Offline Database

**Description:** Matches detected technologies against local CVE database.

**Features:**
- Offline CVE database (no internet required)
- Automatic matching when CMS/library detected
- Version-specific CVE matching
- Severity classification
- Direct links to NVD (National Vulnerability Database)

**Database Structure:**
```json
{
  "libraries": {
    "jquery": {
      "versions": {
        "3.x": {
          "vulnerabilities": [...]
        }
      }
    }
  },
  "cms": {
    "wordpress": {
      "versions": {...}
    }
  }
}
```

**Update Instructions:**
1. Download latest CVEs from NVD
2. Update `data/cve_db.json`
3. Follow existing JSON structure

### 8. ⚙️ Smart Risk Correlation

**Description:** Calculates comprehensive risk score with intelligent correlation.

**Features:**
- Base score: 100 (perfect security)
- Severity-weighted scoring:
  - Critical: -20 points
  - High: -15 points
  - Medium: -8 points
  - Low: -3 points

**Risk Correlation Logic:**
- Outdated JS + Missing Headers = Extra -10 points
- Injection Vuln + Missing Headers = Extra -15 points (Critical!)
- Multiple findings compound severity

**Risk Levels:**
- 80-100: ✅ Safe (Green)
- 60-79: ⚠️ Warning (Orange)
- 0-59: 🔴 Danger (Red)

**Output:**
```json
{
  "risk_score": 65,
  "risk_level": {
    "level": "Warning",
    "color": "orange",
    "icon": "⚠️"
  }
}
```

### 9. 📄 Auto Report Generator

**Description:** Generates professional HTML and PDF reports.

**Features:**

**HTML Report:**
- Modern, responsive design
- Color-coded severity indicators
- Full vulnerability details
- Technology stack visualization
- CVE matches with links
- Statistics and charts

**PDF Report (ReportLab):**
- Professional formatting
- Severity summary table
- Vulnerability list with recommendations
- Compact, printable format
- A4/Letter page sizes

**Report Locations:**
- HTML: `reports/report.html`
- PDF: `reports/report.pdf`

**Sections Included:**
1. Executive Summary (Risk Score, Status)
2. Severity Breakdown (Critical/High/Medium/Low)
3. Technology Stack
4. Vulnerabilities (with recommendations)
5. CVE Matches
6. Statistics

### 10. 🔒 Credential & Session Security Checker

**Description:** Analyzes login pages and session security.

**Features:**

**Checks Performed:**
- Password form over HTTPS
- CSRF token presence
- Cookie security flags:
  - `Secure` flag (HTTPS only)
  - `HttpOnly` flag (XSS protection)
  - `SameSite` attribute (CSRF protection)

**Security Labels:**
- **Weak:** 3+ issues found
- **Medium:** 2 issues found
- **Strong:** 0-1 issues found

**Login Paths Tested:**
- `/login`
- `/admin`
- `/signin`
- `/auth`
- `/account/login`

**Issues Detected:**
- Password form not over HTTPS (Critical)
- No CSRF token (High)
- Missing Secure flag (Medium)
- Missing HttpOnly flag (Medium)
- Missing SameSite attribute (Low)

## 🔧 Configuration

### Ultimate Scanner Config Options

```json
{
  "active_exploit_test": true,      // Safe exploit testing
  "form_fuzzer": true,               // Form discovery & fuzzing
  "js_scanner": true,                // JavaScript library scanner
  "recursive_crawl": true,           // Recursive page crawling
  "tech_fingerprint": true,          // Technology detection
  "credential_check": true,          // Login security check
  "generate_report": false,          // Generate HTML/PDF reports
  "max_crawl_depth": 2,              // Crawl depth limit (1-5)
  "max_pages": 30                    // Max pages to crawl (10-100)
}
```

## 📊 API Usage

### Endpoint: POST /ultimate-scan

**Request:**
```json
{
  "url": "https://example.com",
  "config": {
    "active_exploit_test": true,
    "form_fuzzer": true,
    "js_scanner": true,
    "recursive_crawl": true,
    "tech_fingerprint": true,
    "credential_check": true,
    "generate_report": true,
    "max_crawl_depth": 2,
    "max_pages": 30
  }
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "timestamp": "2025-01-27T10:30:00.000000",
  "status": "Up",
  "http_status": 200,
  "risk_score": 75,
  "risk_level": {
    "level": "Warning",
    "color": "orange",
    "icon": "⚠️"
  },
  "vulnerabilities": [...],
  "findings": {
    "subdomains": [],
    "directories": [],
    "open_ports": [],
    "tech_stack": [...],
    "js_libraries": [...],
    "forms": [...],
    "crawled_pages": [...],
    "cve_matches": [...],
    "credentials_issues": [...]
  },
  "severity_summary": {
    "Critical": 0,
    "High": 2,
    "Medium": 5,
    "Low": 3
  },
  "statistics": {
    "total_vulnerabilities": 10,
    "pages_crawled": 15,
    "forms_found": 3,
    "js_libraries_found": 5,
    "cve_matches": 2
  },
  "reports": {
    "html": "reports/report.html",
    "pdf": "reports/report.pdf"
  }
}
```

## 🚀 Usage Examples

### Basic Ultimate Scan

```bash
curl -X POST http://localhost:5000/ultimate-scan \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "config": {
      "active_exploit_test": true,
      "form_fuzzer": true,
      "js_scanner": true
    }
  }'
```

### Full Comprehensive Scan

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
      "generate_report": true,
      "max_crawl_depth": 3,
      "max_pages": 50
    }
  }'
```

### React Frontend Usage

```javascript
const scanConfig = {
  active_exploit_test: true,
  form_fuzzer: true,
  js_scanner: true,
  recursive_crawl: true,
  tech_fingerprint: true,
  credential_check: true,
  generate_report: false,
  max_crawl_depth: 2,
  max_pages: 30
}

const response = await fetch('/api/ultimate-scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    url: 'https://example.com',
    config: scanConfig 
  })
})

const result = await response.json()
console.log('Risk Score:', result.risk_score)
console.log('Vulnerabilities:', result.vulnerabilities)
```

## 📦 Dependencies

### Python Requirements

```
requests==2.31.0          # HTTP client
dnspython==2.4.2          # DNS resolver
beautifulsoup4==4.12.2    # HTML parsing
python-nmap==0.7.1        # Port scanning
scikit-learn==1.3.2       # Machine learning
numpy==1.24.3             # Numerical computing
reportlab==4.0.7          # PDF generation
```

### Installation

```bash
pip install -r backend/requirements.txt
```

## ⚠️ Important Notes

### Safe Mode

All exploit tests run in **SAFE MODE**:
- No actual exploitation occurs
- Payloads are tested for reflection only
- No damage to target systems
- Suitable for authorized testing only

### Legal & Ethical Use

**⚠️ WARNING:** Only scan websites you own or have explicit written permission to test.

Unauthorized scanning may be illegal in your jurisdiction and can result in:
- Legal action
- Criminal charges
- Civil liability

### Performance

- **Basic Scan:** 5-15 seconds
- **Advanced Scan:** 30-60 seconds
- **Ultimate Scan:** 2-5 minutes (depending on configuration)

Factors affecting scan time:
- Number of pages crawled
- Network latency
- Target response time
- Number of forms to test

### Rate Limiting

Consider implementing:
- Request throttling
- Timeout configurations
- Concurrent request limits
- Respect robots.txt

## 🎓 Educational Purpose

This scanner is designed for:
- ✅ Security education and training
- ✅ Authorized penetration testing
- ✅ Website security auditing (with permission)
- ✅ Learning vulnerability concepts

**NOT** suitable for:
- ❌ Unauthorized testing
- ❌ Malicious activities
- ❌ Production security audits (use professional tools)
- ❌ Compliance assessments

## 📝 Updates & Maintenance

### Updating CVE Database

1. Visit [NVD](https://nvd.nist.gov/)
2. Search for relevant CVEs
3. Update `data/cve_db.json`
4. Follow existing JSON structure

### Updating Signatures

1. Edit `data/vuln_signatures.json`
2. Add new patterns/payloads
3. Test with sample targets

### Updating Tech Fingerprints

1. Edit `data/tech_fingerprints.json`
2. Add new CMS/frameworks
3. Include detection patterns
4. Specify risk levels

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional CVE entries
- New vulnerability signatures
- More technology fingerprints
- Enhanced ML models
- Performance optimizations

## 📄 License

MIT License - Use responsibly and ethically.

## 👨‍💻 Author

**Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE**

---

**Built with ❤️ for cybersecurity education**

🔒 Stay safe, scan responsibly! 🔒
