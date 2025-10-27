# Admin Panel - Website Vulnerability Scanner

Admin Panel sederhana untuk melakukan scanning vulnerability website menggunakan React.js (Vite + Tailwind) yang terintegrasi dengan Python scanner.

## 🚀 Fitur

### Core Features:
- **Dashboard**: Menampilkan statistik scan dan vulnerability dengan grafik trend
- **Scan Website**: Form input URL dengan mode Advanced Scan
- **Hasil Scan**: Riwayat semua scan yang pernah dilakukan
- **Python Scanner**: Melakukan scanning vulnerability secara real-time

### 10 Advanced Features:

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

**Terminal 1 - Backend Server (Node.js + Python):**
```bash
npm run scan
```

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
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
│   └── requirements.txt    # Python dependencies
├── data/
│   ├── scans.json         # Scan results storage
│   └── vuln_signatures.json # Vulnerability signature database
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

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License
