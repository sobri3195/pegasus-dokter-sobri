# 🚀 Deployment Guide

## Production Deployment

### Option 1: Traditional Server Deployment

#### Prerequisites
- Node.js 18+ installed
- Python 3.8+ installed
- PM2 or similar process manager
- Nginx (optional, for reverse proxy)

#### Steps

1. **Clone & Install**
```bash
git clone <repository>
cd admin-panel-scanner
npm install
pip install -r backend/requirements.txt
```

2. **Build Frontend**
```bash
npm run build
```

3. **Setup PM2**
```bash
npm install -g pm2

# Start backend server
pm2 start server.js --name "scanner-backend"

# Serve frontend build
pm2 start "npx serve -s dist -p 3000" --name "scanner-frontend"

# Save PM2 configuration
pm2 save
pm2 startup
```

4. **Nginx Configuration** (Optional)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

# Install Python
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/requirements.txt backend/

# Install dependencies
RUN npm install
RUN pip3 install -r backend/requirements.txt

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Expose ports
EXPOSE 3000 5000

# Start script
CMD ["sh", "-c", "node server.js & npm run preview"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  scanner:
    build: .
    ports:
      - "3000:3000"
      - "5000:5000"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### Commands
```bash
docker-compose up -d
docker-compose logs -f
docker-compose down
```

### Option 3: Cloud Platform Deployment

#### Heroku
```bash
# Install Heroku CLI
heroku login
heroku create scanner-app

# Add buildpacks
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add heroku/python

# Create Procfile
echo "web: node server.js & npm run preview" > Procfile

# Deploy
git push heroku main
```

#### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

#### Vercel (Frontend only)
```bash
npm install -g vercel
vercel --prod
```
Note: Backend needs separate hosting

#### Render
1. Create Web Service
2. Build Command: `npm install && pip install -r backend/requirements.txt && npm run build`
3. Start Command: `node server.js`

## Environment Configuration

### Production Environment Variables

Create `.env` file:
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### Update server.js
```javascript
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: corsOrigin }));
```

## Security Considerations

### 1. Add Authentication
```javascript
// middleware/auth.js
export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // Verify token
  next();
};
```

### 2. Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/scan', limiter);
```

### 3. Input Validation
```javascript
import validator from 'validator';

app.post('/scan', (req, res) => {
  const { url } = req.body;
  if (!validator.isURL(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  // Continue...
});
```

### 4. HTTPS Only
```javascript
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

## Database Migration (Optional)

### SQLite Setup
```bash
npm install sqlite3
```

```javascript
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./data/scans.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    status TEXT,
    http_status INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    vulnerabilities TEXT,
    open_ports TEXT
  )`);
});
```

### MongoDB Setup
```bash
npm install mongodb
```

```javascript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db('scanner');
const scans = db.collection('scans');
```

## Monitoring & Logging

### PM2 Logs
```bash
pm2 logs scanner-backend
pm2 monit
```

### Winston Logger
```bash
npm install winston
```

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Backup Strategy

### Automated Backup Script
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup scans.json
cp data/scans.json "$BACKUP_DIR/scans_$DATE.json"

# Keep only last 30 days
find "$BACKUP_DIR" -name "scans_*.json" -mtime +30 -delete
```

### Cron Job
```bash
# Run backup daily at 2 AM
0 2 * * * /path/to/backup.sh
```

## Performance Optimization

### 1. Enable Compression
```javascript
import compression from 'compression';
app.use(compression());
```

### 2. Cache Static Assets
```javascript
app.use(express.static('dist', {
  maxAge: '1d',
  etag: true
}));
```

### 3. CDN for Assets
Upload `dist/assets/*` to CDN and update paths

### 4. Database Indexing
```sql
CREATE INDEX idx_url ON scans(url);
CREATE INDEX idx_timestamp ON scans(timestamp);
```

## Troubleshooting

### Issue: Python not found
```bash
which python3
ln -s /usr/bin/python3 /usr/local/bin/python
```

### Issue: Port already in use
```bash
lsof -ti:5000 | xargs kill -9
```

### Issue: CORS errors
Check CORS configuration in server.js

### Issue: Build fails
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Health Check Endpoint

Add to server.js:
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
```

## Scaling Considerations

1. **Horizontal Scaling**: Use load balancer (Nginx, HAProxy)
2. **Queue System**: Add Redis for job queue
3. **Microservices**: Split scanner to separate service
4. **Caching**: Add Redis for results caching
5. **Database**: Migrate to PostgreSQL/MongoDB

## Maintenance

### Update Dependencies
```bash
npm update
pip list --outdated
```

### Security Audit
```bash
npm audit fix
```

### Log Rotation
```bash
logrotate -f /etc/logrotate.d/scanner
```

## Support

For deployment issues:
1. Check logs: `pm2 logs`
2. Verify Python: `python3 --version`
3. Test scanner: `python3 backend/scanner.py https://example.com`
4. Check ports: `netstat -tuln | grep -E '3000|5000'`
