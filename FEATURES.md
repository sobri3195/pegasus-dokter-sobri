# ✨ Features & Technical Details

## Frontend Features

### 🎨 Modern Admin UI
- **Sidebar Navigation**
  - Fixed left sidebar with icons
  - Active state highlighting
  - Dashboard, Scan, Results pages
  - Brand logo and version info

- **Topbar**
  - Current date/time display
  - User profile section
  - Admin badge
  - Clean header design

- **Responsive Layout**
  - Flexbox-based layout
  - Tailwind CSS utilities
  - Works on all screen sizes
  - Smooth transitions

### 📊 Dashboard
- **Statistics Cards**
  - Total scans counter
  - High severity count
  - Medium severity count
  - Low severity count
  - Color-coded with icons

- **Welcome Section**
  - Feature list
  - Information panel
  - Getting started guide

### 🔍 Scan Website Page
- **Input Form**
  - URL validation
  - Placeholder text
  - Helper instructions
  - Clean input styling

- **Scan Button**
  - Loading animation
  - Disabled state during scan
  - Color transitions
  - Success/error feedback

- **Results Display**
  - Real-time results
  - Grid layout for info
  - Vulnerability list
  - Color-coded severity
  - Timestamp display

### 📋 Scan Results Page
- **History Table**
  - All past scans
  - URL, Status, Time columns
  - Severity indicator dots
  - Hover effects
  - Empty state message

- **Detail Modal**
  - Full scan report
  - Close button
  - Scrollable content
  - Backdrop overlay

## Backend Features

### 🔌 Express API Server
- **POST /scan**
  - Accepts URL in JSON body
  - Spawns Python subprocess
  - Returns scan results
  - Saves to scans.json

- **GET /scans**
  - Returns all scan history
  - JSON response

- **CORS Enabled**
  - Cross-origin requests allowed
  - Frontend-backend communication

### 🐍 Python Scanner

#### HTTP Status Check
```python
- GET request to target URL
- Follow redirects
- Timeout handling
- Status code detection
- Error handling
```

#### SSL Certificate Validation
```python
- HTTPS detection
- Certificate verification
- Issuer information
- Expiry checking
- SSL error handling
```

#### Security Headers Check
```python
Headers checked:
- X-Frame-Options (Clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- Strict-Transport-Security (HSTS)
- Content-Security-Policy (XSS protection)
- X-XSS-Protection (Legacy XSS filter)
```

#### Port Scanning
```python
Common ports:
- 21 (FTP) - File Transfer
- 22 (SSH) - Secure Shell
- 80 (HTTP) - Web
- 443 (HTTPS) - Secure Web
- 3306 (MySQL) - Database
- 8080 (HTTP Alt) - Alternative Web
```

#### Vulnerability Analysis
```python
Severity levels:
- High: SSL issues, exposed sensitive ports
- Medium: Missing headers, HTTP errors
- Low: Excessive redirects
```

## Data Flow

```
User Input (React)
    ↓
POST /scan (Express)
    ↓
spawn Python subprocess
    ↓
scanner.py execution
    ↓
JSON output via stdout
    ↓
Parse and save to scans.json
    ↓
Return to React
    ↓
Display results
```

## File Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   └── Topbar.jsx       # Top header bar
│   ├── pages/
│   │   ├── Dashboard.jsx    # Stats & overview
│   │   ├── ScanWebsite.jsx  # Scan form & results
│   │   └── ScanResults.jsx  # History & details
│   ├── App.jsx              # Main component
│   ├── main.jsx             # React entry
│   └── index.css            # Tailwind imports
│
├── backend/
│   ├── scanner.py           # Python vulnerability scanner
│   └── requirements.txt     # Python dependencies
│
├── data/
│   └── scans.json          # Scan results storage
│
├── public/
│   └── vite.svg            # Favicon
│
├── server.js               # Express API server
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind config
└── package.json            # Node dependencies
```

## Technology Stack

### Frontend
- **React 18.2.0** - UI library
- **Vite 5.0.8** - Build tool
- **Tailwind CSS 3.4.0** - Styling
- **PostCSS & Autoprefixer** - CSS processing

### Backend
- **Node.js** - Runtime
- **Express 4.18.2** - Web framework
- **CORS 2.8.5** - Cross-origin handling
- **Child Process** - Python execution

### Scanner
- **Python 3.x** - Language
- **requests 2.31.0** - HTTP client
- **ssl** - Certificate handling
- **socket** - Port scanning
- **json** - Data serialization

## Color Palette

```css
Primary: Blue #2563eb
Success: Green #059669
Warning: Yellow #d97706
Danger: Red #dc2626
Dark: Gray #1f2937
Light: Gray #f3f4f6
```

## Performance

- Fast scan execution (5-15s)
- Lightweight frontend bundle (~158KB JS)
- No database overhead
- Minimal API latency
- Efficient Python scripts

## Security Considerations

### For the Tool Itself
- No authentication (for demo)
- CORS enabled (development)
- File-based storage (no SQL injection)
- Input validation needed
- Rate limiting recommended

### What It Checks
- Basic security headers
- SSL/TLS validation
- Common open ports
- HTTP/HTTPS configuration
- Redirect behavior

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Any modern browser with ES6 support

## Development Tools

- **ESLint** (optional) - Code linting
- **Prettier** (optional) - Code formatting
- **Vite HMR** - Hot module replacement
- **React DevTools** - Component inspection
- **Python REPL** - Quick testing

## Future Enhancements

### Planned Features
1. User authentication
2. API rate limiting
3. Database integration (PostgreSQL/MongoDB)
4. Scheduled scans
5. Email notifications
6. PDF report generation
7. More vulnerability checks
8. Batch scanning
9. Historical trends
10. Advanced filtering

### Advanced Security Checks
1. SQL injection testing
2. XSS vulnerability detection
3. CSRF token validation
4. Directory traversal
5. Command injection
6. XML External Entity (XXE)
7. Server-Side Request Forgery (SSRF)
8. Insecure deserialization
9. Broken authentication
10. Sensitive data exposure

## API Documentation

### POST /scan
**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "timestamp": "2025-10-27T09:00:00.000000",
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

### GET /scans
**Response:**
```json
[
  {
    "url": "https://example.com",
    "timestamp": "2025-10-27T09:00:00.000000",
    "status": "Up",
    "http_status": 200,
    "vulnerabilities": [...],
    "open_ports": [80, 443]
  }
]
```

## Error Handling

### Frontend
- Network errors
- Invalid responses
- Empty states
- Loading states

### Backend
- Python execution errors
- JSON parsing errors
- File system errors
- Network timeouts

### Scanner
- Connection timeouts
- DNS resolution failures
- SSL handshake errors
- Port scan failures
