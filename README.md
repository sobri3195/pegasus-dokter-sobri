# Admin Panel - Website Vulnerability Scanner

Admin Panel sederhana untuk melakukan scanning vulnerability website menggunakan React.js (Vite + Tailwind) yang terintegrasi dengan Python scanner.

## 🚀 Fitur

### Core Features:
- **Dashboard**: Menampilkan statistik scan dan vulnerability dengan grafik trend
- **Scan Website**: Form input URL dengan 3 mode scanning
  - 🔍 Basic Scan: Quick security check
  - 🔬 Advanced Scan: Deep vulnerability analysis
  - 🚀 **Ultimate Scanner**: AI-powered comprehensive testing (NEW!)
- **Hasil Scan**: Riwayat semua scan yang pernah dilakukan
- **Python Scanner**: Melakukan scanning vulnerability secara real-time

### 🚀 Ultimate Scanner (NEW!):

1. **🔬 Active Exploit Testing (Safe Mode)**
   - XSS, SQLi, LFI payload testing
   - Non-destructive vulnerability validation
   - AI-powered result verification

2. **🧠 AI-Based Pattern Recognition**
   - Machine learning vulnerability classification
   - Trained on SQL errors, XSS patterns, debug info
   - Confidence scoring for detections

3. **📝 Form & Input Fuzzer**
   - Automatic form discovery
   - Multi-payload testing per input
   - Reflection and error detection

4. **📦 JavaScript & Dependency Scanner**
   - Library version detection
   - CVE database matching
   - jQuery, React, Angular, Vue support

5. **🕸️ Recursive Crawl + Scanning**
   - Configurable crawl depth
   - Real-time progress tracking
   - Same-domain restriction

6. **🧬 Web Technology Fingerprinting**
   - CMS detection (WordPress, Joomla, Drupal, etc.)
   - Framework identification
   - Server and language detection

7. **🐛 CVE Matching & Offline Database**
   - Local CVE database
   - Automatic version matching
   - Direct NVD links

8. **⚙️ Smart Risk Correlation**
   - Compound vulnerability analysis
   - Weighted severity scoring (0-100)
   - Color-coded risk levels

9. **📄 Auto Report Generator**
   - HTML report (modern design)
   - PDF report (professional format)
   - Executive & technical summaries

10. **🔒 Credential & Session Security Checker**
    - Login page analysis
    - Cookie security validation
    - HTTPS and CSRF checks

### 10 Advanced Features (Previous):

1. **🔬 Deep Vulnerability Scanner**
   - Layer 3-4: Port scanning (socket check)
   - Layer 7: HTTP/HTTPS scan
   - Application Layer: XSS, SQL Injection, directory listing, header security, cookie issues
   - Configurable via Advanced Scan menu

2. **🧠 AI-Assisted Vulnerability Classification**
   - Automatic vulnerability categorization (XSS, CSRF, RCE, SQLi, etc.)
   - AI-powered recommendations for each finding
   - Smart pattern matching

3. **🔍 Subdomain & Directory Enumeration**
   - DNS-based subdomain discovery
   - Hidden directory/path detection
   - Risk assessment for discovered paths

4. **⚙️ Common Vulnerability Signature Database**
   - Local `vuln_signatures.json` with patterns
   - Regex-based XSS/SQLi detection
   - Offline updates supported

5. **📈 Risk Scoring System**
   - 0-100 security score calculation
   - Severity-weighted scoring (Critical=15, High=10, Medium=5, Low=2)
   - Color-coded indicators (Green/Orange/Red)

6. **🧾 Exploit Simulation (Safe Mode)**
   - Non-destructive vulnerability testing
   - Safe payload validation
   - No actual exploitation

7. **🔒 SSL & Certificate Analyzer**
   - Certificate validity and expiration check
   - Cipher strength analysis
   - Self-signed certificate detection
   - TLS version identification

8. **🧰 Configuration & Header Hardening Report**
   - Comprehensive security header audit
   - Cookie security analysis
   - Detailed remediation checklist

9. **🕵️ Vulnerability Trend Tracking**
   - Historical trend visualization
   - Daily/weekly/monthly statistics
   - Line and bar charts

10. **⚡ Offline Penetration Toolkit Integration**
    - nmap integration (port scanning)
    - whatweb (technology fingerprinting)
    - sslscan (SSL/TLS analysis)

## 🛠️ Teknologi

- **Frontend**: React 18 + Vite + Tailwind CSS + Recharts
- **Backend**: Node.js (Express) + Python 3
- **Scanner**: Python (requests, ssl, socket, dnspython, beautifulsoup4, python-nmap)
- **Data Storage**: JSON file (tanpa database)
- **Visualization**: Recharts for trend graphs

## 📦 Instalasi

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r backend/requirements.txt
```

### 2. Jalankan Aplikasi

#### Opsi A - Jalankan Semua Sekaligus (Recommended):
```bash
npm run start:all
# atau
npm start
```

#### Opsi B - Jalankan Terpisah:

**Terminal 1 - Backend Server (Node.js + Python):**
```bash
npm run backend
```

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```

#### Opsi C - Jalankan Scanner Python Standalone:
```bash
# Basic Scanner
npm run scan https://example.com

# Advanced Scanner
npm run scan:advanced https://example.com '{"port_scan": true, "xss_test": true}'

# Ultimate Scanner
npm run scan:ultimate https://example.com '{"active_exploit": true, "crawl_depth": 2}'
```

Aplikasi akan berjalan di:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📖 Cara Penggunaan

### Basic Scan:
1. Buka aplikasi di browser (http://localhost:3000)
2. Navigasi ke "Scan Website"
3. Masukkan URL target (contoh: https://example.com)
4. Klik "Start Scan"
5. Tunggu hasil scanning
6. Lihat riwayat scan di menu "Hasil Scan"

### Advanced Scan:
1. Navigasi ke "Scan Website"
2. Aktifkan "Advanced Scan Mode" checkbox
3. Pilih opsi scan yang diinginkan:
   - Port Scanning
   - Subdomain Enumeration
   - Directory Enumeration
   - XSS Testing
   - SQL Injection Testing
   - External Tools Integration
4. Klik "Start Advanced Scan"
5. Review hasil komprehensif dengan risk score dan recommendations

### Ultimate Scan (NEW!):
1. Navigasi ke "Scan Website"
2. Pilih "🚀 Ultimate Scanner" mode
3. Configure features:
   - ✅ Active Exploit Testing (Safe XSS, SQLi, LFI)
   - ✅ Form Fuzzer (Auto-detect & test forms)
   - ✅ JS Library Scanner (CVE matching)
   - ✅ Recursive Crawl (Scan all pages)
   - ✅ Tech Fingerprinting (CMS & frameworks)
   - ✅ Credential Checker (Login security)
   - ☐ Generate Report (HTML & PDF)
4. Set crawl depth (1-5) and max pages (10-100)
5. Click "🚀 Start Ultimate Scan"
6. Wait 2-5 minutes for comprehensive results
7. Review:
   - AI-powered vulnerability detection
   - CVE matches for libraries
   - Technology stack
   - Risk score & correlation
   - Detailed statistics

### View Trends:
1. Navigasi ke "Dashboard"
2. Lihat grafik tren vulnerability
3. Monitor aktivitas scan dan statistik

## 📁 Struktur Project

```
.
├── backend/
│   ├── scanner.py          # Basic Python scanner script
│   ├── advanced_scanner.py # Advanced scanner with 10 features
│   ├── ultimate_scanner.py # 🚀 Ultimate scanner with AI & CVE matching (NEW!)
│   └── requirements.txt    # Python dependencies
├── data/
│   ├── scans.json           # Scan results storage
│   ├── vuln_signatures.json # Vulnerability signature database
│   ├── tech_fingerprints.json # Technology detection signatures (NEW!)
│   └── cve_db.json          # Offline CVE database (NEW!)
├── reports/                 # Generated HTML/PDF reports (NEW!)
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx    # Sidebar navigation
│   │   └── Topbar.jsx     # Top navigation bar
│   ├── pages/
│   │   ├── Dashboard.jsx  # Dashboard page
│   │   ├── ScanWebsite.jsx # Scan form page
│   │   └── ScanResults.jsx # Scan history page
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── server.js              # Express server (Node-Python bridge)
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Node dependencies
```

## 🔒 Security Checks

Scanner melakukan pengecekan terhadap:

1. **HTTP Status**: Memeriksa apakah website dapat diakses
2. **SSL Certificate**: Validasi sertifikat SSL/TLS
3. **Security Headers**:
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security (HSTS)
   - Content-Security-Policy (CSP)
   - X-XSS-Protection
4. **Open Ports**: Scan ports 21, 22, 80, 443, 3306, 8080
5. **Redirect Chain**: Deteksi excessive redirects

## 📊 Severity Levels

- 🔴 **High**: Masalah keamanan kritis (SSL invalid, port sensitif terbuka)
- 🟠 **Medium**: Masalah keamanan sedang (missing headers, HTTP status error)
- 🟡 **Low**: Masalah kecil (redirect chain)

## 🎨 Tampilan

- Modern admin panel design
- Responsive layout
- Color-coded severity indicators
- Real-time scanning progress
- Interactive scan history

## 📝 Catatan

- Aplikasi ini untuk tujuan edukasi dan testing
- Scanner melakukan basic vulnerability checking
- Hasil disimpan dalam file JSON lokal
- Tidak menggunakan database atau REST API kompleks
- Komunikasi Frontend-Backend via Express yang memanggil Python subprocess

## 📚 Dokumentasi Lengkap

- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Referensi cepat npm scripts
- [NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md) - Panduan lengkap npm scripts
- [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) - Contoh penggunaan praktis
- [QUICK_START.md](QUICK_START.md) - Panduan mulai cepat
- [FEATURES.md](FEATURES.md) - Detail fitur lengkap
- [ADVANCED_FEATURES.md](ADVANCED_FEATURES.md) - Fitur advanced scanner
- [ULTIMATE_SCANNER.md](ULTIMATE_SCANNER.md) - Dokumentasi ultimate scanner
- [DEPLOYMENT.md](DEPLOYMENT.md) - Panduan deployment

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License

## 👨‍💻 Author

**Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE**

- 🌐 GitHub: [github.com/sobri3195](https://github.com/sobri3195)
- 📧 Email: [muhammadsobrimaulana31@gmail.com](mailto:muhammadsobrimaulana31@gmail.com)

### 💰 Support & Donation

If you find this project useful, please consider supporting the development:

- 💳 Donation: [https://lynk.id/muhsobrimaulana](https://lynk.id/muhsobrimaulana)

### 📱 Connect with Me

- 🎥 YouTube: [Muhammad Sobri Maulana](https://www.youtube.com/@muhammadsobrimaulana6013)
- 📲 Telegram: [@winlin_exploit](https://t.me/winlin_exploit)
- 🎬 TikTok: [@dr.sobri](https://www.tiktok.com/@dr.sobri)
- 💬 WhatsApp Group: [Join Community](https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl)
