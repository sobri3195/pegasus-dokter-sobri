# Quick Reference - npm run scan

## 🚀 Quick Start

### Start Everything
```bash
npm start
```
This runs both frontend (port 3000) and backend (port 5000).

### Run Separately
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend  
npm run dev
```

## 🔍 Scanner Commands

### Basic Scan
```bash
npm run scan https://example.com
```

### Advanced Scan
```bash
npm run scan:advanced https://example.com
```

### Ultimate Scan
```bash
npm run scan:ultimate https://example.com
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start everything (frontend + backend) |
| `npm run dev` | Start frontend dev server (port 3000) |
| `npm run backend` | Start backend API server (port 5000) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run scan <URL>` | Run basic Python scanner |
| `npm run scan:advanced <URL>` | Run advanced scanner |
| `npm run scan:ultimate <URL>` | Run ultimate scanner |
| `npm run start:all` | Same as `npm start` |

## 📦 Installation

### First Time Setup
```bash
# Clone repository
git clone <repo-url>
cd admin-panel-scanner

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r backend/requirements.txt --break-system-packages
```

## 🎯 Common Use Cases

### 1. Development
```bash
npm start
# Open http://localhost:3000
```

### 2. Testing Scanner
```bash
npm run scan https://testphp.vulnweb.com
```

### 3. Save Scan Results
```bash
npm run scan https://example.com > results.json
```

### 4. View Formatted Output
```bash
npm run scan https://example.com | jq .
```

### 5. Multiple URLs
```bash
for url in example.com google.com github.com; do
  npm run scan https://$url > scan_$url.json
done
```

## 🔧 Troubleshooting

### Python Module Not Found
```bash
pip install -r backend/requirements.txt --break-system-packages
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Permission Issues
```bash
chmod +x backend/*.py
```

## 📚 Documentation

- [NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md) - Complete npm scripts documentation
- [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) - Practical usage examples
- [README.md](README.md) - Main project documentation
- [QUICK_START.md](QUICK_START.md) - Quick start guide

## 💡 Tips

1. **Use `npm start`** - Easiest way to run everything
2. **Save results** - Use `> file.json` to save output
3. **Format with jq** - Use `| jq .` for pretty JSON
4. **Background mode** - Add `&` to run in background
5. **Watch logs** - Use `2>&1 | tee scan.log` to save logs

## 🎨 Scanner Output Format

### Basic Scanner Output
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

### Advanced Scanner Output
Includes all basic fields plus:
- `risk_score` - Security score (0-100)
- `recommendations` - AI-generated recommendations
- `scan_config` - Configuration used
- `subdomain_results` - Discovered subdomains
- `directory_results` - Directory enumeration results

### Ultimate Scanner Output
Includes all advanced fields plus:
- `technology_stack` - Detected technologies
- `cve_matches` - CVE vulnerabilities found
- `form_analysis` - Form fuzzing results
- `js_libraries` - JavaScript libraries and versions
- `crawl_results` - Pages discovered during crawl
- `report_paths` - Generated report file paths

## ⚡ Performance

| Scanner | Typical Time | Depth |
|---------|-------------|-------|
| Basic | 5-10 seconds | Quick check |
| Advanced | 1-3 minutes | Deep analysis |
| Ultimate | 2-5 minutes | Comprehensive |

## 🔒 Security Notes

- Scanners use safe, non-destructive testing
- No actual exploitation is performed
- Respects robots.txt (optional)
- Rate limiting to avoid DoS
- Use only on websites you own or have permission to test

## 📞 Support

For issues or questions:
- Check [NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md)
- Review [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md)
- See [README.md](README.md) for contact information

---

**Quick Command Cheatsheet:**
```bash
npm start                    # Start everything
npm run scan <URL>           # Quick scan
npm run scan:ultimate <URL>  # Full scan
npm run build                # Build for production
```
