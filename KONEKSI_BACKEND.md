# 🔌 Panduan Koneksi Backend

Dokumen ini menjelaskan cara menghubungkan frontend dengan backend server.

## 📋 Ringkasan Cepat

```bash
# Jalankan kedua server sekaligus
npm start

# Atau jalankan terpisah:
# Terminal 1:
npm run backend

# Terminal 2:
npm run dev
```

Cek koneksi:
```bash
npm run check
```

## 🏗️ Arsitektur Koneksi

```
┌─────────────────────┐         ┌──────────────────────┐
│   Frontend (React)  │         │  Backend (Express)   │
│                     │         │                      │
│  Vite Dev Server    │  Proxy  │  Node.js Server      │
│  Port: 3000         │ ──────> │  Port: 5000          │
│                     │         │                      │
│  /api/health ───────┼────────>│  /health             │
│  /api/scan ─────────┼────────>│  /scan               │
│  /api/scans ────────┼────────>│  /scans              │
└─────────────────────┘         └──────────────────────┘
                                          │
                                          ▼
                                ┌──────────────────┐
                                │ Python Scanners  │
                                │  - scanner.py    │
                                │  - advanced_*.py │
                                │  - ultimate_*.py │
                                └──────────────────┘
```

## 🚀 Cara Menjalankan

### Metode 1: Otomatis (Paling Mudah)

```bash
npm start
```

Ini akan menjalankan:
- ✅ Backend server di port 5000
- ✅ Frontend dev server di port 3000
- ✅ Keduanya berjalan bersamaan menggunakan `concurrently`

### Metode 2: Manual (Dua Terminal)

**Terminal 1 - Backend:**
```bash
npm run backend
```

Output yang benar:
```
Backend server running on http://localhost:5000
Python scanner ready
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Output yang benar:
```
VITE v5.0.8  ready in 234 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Metode 3: Menggunakan Script Shell

```bash
./start.sh
```

Script ini akan:
1. ✅ Cek dependencies (Node.js, Python)
2. ✅ Install npm packages jika belum
3. ✅ Start backend server
4. ✅ Start frontend server
5. ✅ Tampilkan URL akses

## ✅ Verifikasi Koneksi

### 1. Cek via Command Line

```bash
# Cek health endpoint
curl http://localhost:5000/health

# Response yang benar:
{"status":"ok","message":"Backend server is running"}

# Atau gunakan script checker
npm run check
```

### 2. Cek via Browser

1. Buka http://localhost:3000
2. Klik menu **"Scan Website"** di sidebar
3. Lihat pojok kanan atas halaman

**Indikator Status:**
- 🟢 Titik hijau + "Backend Connected" = **Terhubung** ✅
- 🔴 Titik merah + "Backend Disconnected" = **Tidak terhubung** ❌
- 🟡 Titik kuning + "Checking Backend..." = **Sedang mengecek** ⏳

### 3. Tes Scan

1. Masukkan URL: `https://example.com`
2. Klik **"Start Basic Scan"**
3. Jika backend terhubung, akan muncul loading dan hasil scan
4. Jika tidak terhubung, akan muncul error message

## 🔧 Troubleshooting

### ❌ "Backend Disconnected"

**Penyebab:** Backend server tidak berjalan atau tidak dapat diakses.

**Solusi:**

1. **Cek apakah backend berjalan:**
   ```bash
   # Cek proses
   ps aux | grep "node server.js"
   
   # Cek port 5000
   lsof -i :5000
   # atau
   netstat -tuln | grep 5000
   ```

2. **Restart backend:**
   ```bash
   # Matikan proses backend yang ada
   pkill -f "node server.js"
   
   # Start ulang
   npm run backend
   ```

3. **Cek log error:**
   ```bash
   # Jika menjalankan di background
   cat backend.log
   ```

### ❌ Port 5000 Sudah Digunakan

**Error:** `EADDRINUSE: address already in use :::5000`

**Solusi:**

```bash
# Cari proses yang menggunakan port 5000
lsof -i :5000

# Matikan proses tersebut
kill -9 <PID>

# Atau ubah port di server.js
# const PORT = 5001; // ganti dari 5000 ke 5001
```

### ❌ CORS Error

**Error:** `Access to fetch at 'http://localhost:5000/...' has been blocked by CORS policy`

**Solusi:**

Backend sudah menggunakan CORS. Pastikan:
1. Backend berjalan dengan benar
2. Akses frontend melalui `http://localhost:3000` (bukan file:///)
3. Cek `server.js` sudah ada:
   ```javascript
   import cors from 'cors';
   app.use(cors());
   ```

### ❌ Frontend Tidak Bisa Proxy

**Error:** `Failed to fetch` atau `502 Bad Gateway`

**Solusi:**

1. **Cek vite.config.js:**
   ```javascript
   export default defineConfig({
     server: {
       proxy: {
         '/api': {
           target: 'http://localhost:5000',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/api/, '')
         }
       }
     }
   })
   ```

2. **Restart Vite dev server:**
   ```bash
   # Ctrl+C untuk stop
   # Kemudian start ulang
   npm run dev
   ```

### ❌ Python Dependencies Error

**Error:** Scanner Python tidak bisa jalan

**Solusi:**

```bash
# Install dependencies Python
pip3 install -r backend/requirements.txt

# Jika error "externally-managed-environment", gunakan:
pip3 install -r backend/requirements.txt --break-system-packages

# Atau gunakan virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

## 🧪 Testing Manual

### Test 1: Health Check

```bash
curl -X GET http://localhost:5000/health
```

Expected:
```json
{"status":"ok","message":"Backend server is running"}
```

### Test 2: Get Scans

```bash
curl -X GET http://localhost:5000/scans
```

Expected: Array of scan results (bisa kosong `[]` jika belum ada scan)

### Test 3: Basic Scan

```bash
curl -X POST http://localhost:5000/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Expected: JSON dengan hasil scan

### Test 4: Frontend ke Backend (via proxy)

Buka browser console di http://localhost:3000 dan jalankan:

```javascript
fetch('/api/health')
  .then(res => res.json())
  .then(data => console.log('Backend response:', data))
  .catch(err => console.error('Error:', err))
```

Expected output:
```
Backend response: {status: "ok", message: "Backend server is running"}
```

## 📊 Monitoring Status

### Cara 1: Via UI

- Indikator status otomatis update setiap 30 detik
- Lihat di halaman "Scan Website"
- Warna hijau = OK, merah = Error

### Cara 2: Via Command Line

```bash
# Watch health endpoint
watch -n 2 'curl -s http://localhost:5000/health'

# Watch proses
watch -n 2 'ps aux | grep "node server"'

# Watch port
watch -n 2 'lsof -i :5000'
```

### Cara 3: Via Script

```bash
# Run check script setiap 5 detik
watch -n 5 npm run check
```

## 🎯 Best Practices

1. **Selalu jalankan backend dulu** sebelum frontend
2. **Gunakan `npm start`** untuk development (jalankan semua)
3. **Cek connection indicator** di UI sebelum scan
4. **Gunakan `npm run check`** untuk verifikasi cepat
5. **Simpan log** jika ada error untuk debugging

## 📚 Referensi Dokumen Lain

- [README.md](./README.md) - Dokumentasi lengkap
- [QUICK_START.md](./QUICK_START.md) - Panduan cepat
- [BACKEND_CONNECTION.md](./BACKEND_CONNECTION.md) - Detail teknis koneksi (English)
- [NPM_SCRIPTS_GUIDE.md](./NPM_SCRIPTS_GUIDE.md) - Daftar semua npm scripts

## 🆘 Masih Bermasalah?

Jika masih mengalami masalah setelah mengikuti panduan ini:

1. **Cek ulang setiap langkah** dari awal
2. **Restart semua services:**
   ```bash
   pkill -f "node"
   pkill -f "vite"
   npm start
   ```
3. **Clear cache dan reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm start
   ```
4. **Cek firewall/antivirus** tidak memblok port 3000/5000
5. **Buat issue** di repository dengan detail error

## ✨ Ringkasan Perintah

| Perintah | Fungsi |
|----------|--------|
| `npm start` | Jalankan semua (backend + frontend) |
| `npm run backend` | Jalankan backend saja |
| `npm run dev` | Jalankan frontend saja |
| `npm run check` | Cek status koneksi backend |
| `./start.sh` | Script otomatis start semua |
| `./check-connection.sh` | Script cek koneksi detail |

---

**Catatan:** Aplikasi ini untuk educational purposes. Selalu minta izin sebelum melakukan scan ke website yang bukan milik Anda.
