# Admin Panel - Website Vulnerability Scanner

Admin Panel sederhana untuk melakukan scanning vulnerability website menggunakan React.js (Vite + Tailwind) yang terintegrasi dengan Python scanner.

## 🚀 Fitur

- **Dashboard**: Menampilkan statistik scan dan vulnerability
- **Scan Website**: Form input URL untuk melakukan scanning
- **Hasil Scan**: Riwayat semua scan yang pernah dilakukan
- **Python Scanner**: Melakukan scanning vulnerability secara real-time

### Vulnerability Detection:
- ✅ HTTP Status & Availability Check
- ✅ SSL Certificate Validation
- ✅ Security Headers Detection
- ✅ Open Ports Scanning
- ✅ Redirect Chain Detection
- ✅ Missing Security Headers

## 🛠️ Teknologi

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js (Express) + Python 3
- **Scanner**: Python (requests, ssl, socket)
- **Data Storage**: JSON file (tanpa database)

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

1. Buka aplikasi di browser (http://localhost:3000)
2. Navigasi ke "Scan Website"
3. Masukkan URL target (contoh: https://example.com)
4. Klik "Start Scan"
5. Tunggu hasil scanning
6. Lihat riwayat scan di menu "Hasil Scan"

## 📁 Struktur Project

```
.
├── backend/
│   ├── scanner.py          # Python scanner script
│   └── requirements.txt    # Python dependencies
├── data/
│   └── scans.json         # Scan results storage
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
