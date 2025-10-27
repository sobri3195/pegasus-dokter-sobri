# 🚀 Quick Start Guide

## Prerequisites

- Node.js (v18 or higher)
- Python 3.x
- npm or yarn

## Installation & Running

### Method 1: Auto Start (Recommended)

```bash
# Make start script executable (if not already)
chmod +x start.sh

# Run the script
./start.sh
```

This will automatically:
1. Check dependencies
2. Install packages if needed
3. Start backend server (port 5000)
4. Start frontend dev server (port 3000)

### Method 2: Manual Start

**Terminal 1 - Backend Server:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Usage

1. Open http://localhost:3000 in your browser
2. Navigate to "Scan Website" from sidebar
3. Enter a URL (e.g., https://example.com)
4. Click "Start Scan"
5. View results immediately
6. Check history in "Hasil Scan"

## Example URLs to Test

Try scanning these websites:
- https://example.com
- https://github.com
- https://google.com
- http://testphp.vulnweb.com (intentionally vulnerable for testing)

## Troubleshooting

### Backend not connecting?
- Make sure Node.js server is running on port 5000
- Check if Python is installed: `python3 --version`
- Verify requests library: `pip list | grep requests`

### Frontend not loading?
- Clear browser cache
- Check if port 3000 is available
- Run `npm install` again

### Python scanner not working?
- Install requirements: `pip install -r backend/requirements.txt`
- Test directly: `python3 backend/scanner.py https://example.com`

## Features Overview

### Dashboard
- Total scans statistics
- Vulnerability severity breakdown
- Color-coded cards (High=Red, Medium=Orange, Low=Yellow)

### Scan Website
- Real-time scanning
- Loading indicator
- Immediate results display
- Error handling

### Hasil Scan
- Complete scan history
- Filterable table
- Detail modal view
- Color-coded severity dots

## Security Note

This tool is for educational purposes and basic security testing only.
Always get permission before scanning websites you don't own.

## Need Help?

Check the main README.md for detailed information or create an issue on GitHub.
