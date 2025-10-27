# Getting Started - npm run scan

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r backend/requirements.txt --break-system-packages
```

### Step 2: Start the Application

**Option A - Run Everything Together (Easiest):**
```bash
npm start
```

**Option B - Run Separately:**
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run dev
```

### Step 3: Use the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎯 What You Can Do

### 1. Use the Web UI

1. Open http://localhost:3000 in your browser
2. Navigate to "Scan Website"
3. Enter a URL (e.g., https://example.com)
4. Click "Start Scan"
5. View results in real-time

### 2. Use the Command Line

```bash
# Basic scan
npm run scan https://example.com

# Advanced scan
npm run scan:advanced https://example.com

# Ultimate scan (comprehensive)
npm run scan:ultimate https://example.com
```

### 3. Save Results to File

```bash
# Scan and save to JSON file
npm run scan https://example.com > results.json

# View formatted output
npm run scan https://example.com | jq .
```

## 📋 Available Commands

| Command | What it does |
|---------|-------------|
| `npm start` | 🚀 Start everything (frontend + backend) |
| `npm run dev` | Start frontend only (port 3000) |
| `npm run backend` | Start backend only (port 5000) |
| `npm run scan <URL>` | Run basic Python scanner |
| `npm run scan:advanced <URL>` | Run advanced scanner |
| `npm run scan:ultimate <URL>` | Run ultimate scanner |
| `npm run build` | Build for production |

## 🔍 Example Usage

### Example 1: Quick Website Scan

```bash
npm run scan https://example.com
```

Output:
```json
{
  "url": "https://example.com",
  "timestamp": "2024-01-15T10:30:00",
  "status": "Up",
  "http_status": 200,
  "vulnerabilities": [
    {
      "type": "Missing Security Header",
      "severity": "High",
      "description": "Header keamanan 'Content-Security-Policy' tidak ditemukan"
    }
  ],
  "open_ports": [80, 443]
}
```

### Example 2: Full Application Development

```bash
# Start everything with one command
npm start

# Output:
# [0] Vite dev server running at http://localhost:3000
# [1] Backend server running at http://localhost:5000
```

### Example 3: Multiple URL Scanning

```bash
#!/bin/bash
# scan_multiple.sh

urls=(
  "https://example.com"
  "https://google.com"
  "https://github.com"
)

for url in "${urls[@]}"; do
  echo "Scanning $url..."
  npm run scan "$url" > "scan_$(echo $url | sed 's/https:\/\///').json"
done
```

## 📚 Documentation

- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick command reference
- **[NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md)** - Complete npm scripts guide
- **[USAGE_EXAMPLES.md](USAGE_EXAMPLES.md)** - Practical examples
- **[README.md](README.md)** - Main documentation
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was implemented

## 🛠️ Troubleshooting

### Issue: Python module not found
```bash
# Solution:
pip install -r backend/requirements.txt --break-system-packages
```

### Issue: Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue: npm command not found
```bash
# Install Node.js (Ubuntu/Debian)
sudo apt install nodejs npm

# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

### Issue: python3 command not found
```bash
# Install Python (Ubuntu/Debian)
sudo apt install python3 python3-pip
```

## 💡 Pro Tips

1. **Use `npm start`** - It's the easiest way to get started
2. **Install `jq`** - For pretty JSON formatting
   ```bash
   sudo apt install jq
   npm run scan https://example.com | jq .
   ```
3. **Background mode** - Run scanner in background
   ```bash
   npm run scan https://example.com > results.json 2>&1 &
   ```
4. **Watch mode** - Monitor real-time logs
   ```bash
   npm run scan:ultimate https://example.com 2>&1 | tee scan.log
   ```

## 🎓 Learn More

### For Frontend Developers
1. Start with: `npm start`
2. Open: http://localhost:3000
3. Explore the UI and features
4. Check: [README.md](README.md)

### For Backend Developers
1. Start with: `npm run backend`
2. Test API: http://localhost:5000/health
3. Review: [NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md)

### For Security Testers
1. Start with: `npm run scan <URL>`
2. Try: `npm run scan:ultimate <URL>`
3. Read: [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md)

### For DevOps Engineers
1. Review: [DEPLOYMENT.md](DEPLOYMENT.md)
2. Check: [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) (CI/CD section)
3. Test: `npm run build`

## 🎯 Next Steps

After getting started:

1. **Explore Features**
   - Try different scan modes
   - Check the dashboard
   - View scan history

2. **Read Documentation**
   - [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick reference
   - [NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md) - Detailed guide
   - [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) - More examples

3. **Advanced Usage**
   - Configure scan options
   - Automate scanning
   - Integrate with CI/CD

## 🎉 You're Ready!

That's it! You're now ready to use the Admin Panel Scanner.

**Quick command to get started:**
```bash
npm start
```

Then open http://localhost:3000 in your browser.

Happy scanning! 🔒🔍

---

**Need Help?**
- Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for quick answers
- Read [NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md) for detailed help
- Review [README.md](README.md) for contact information
