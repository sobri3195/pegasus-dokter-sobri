import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const SCANS_FILE = path.join(__dirname, 'data', 'scans.json');

if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

if (!fs.existsSync(SCANS_FILE)) {
  fs.writeFileSync(SCANS_FILE, JSON.stringify([], null, 2));
}

function loadScans() {
  try {
    const data = fs.readFileSync(SCANS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveScans(scans) {
  fs.writeFileSync(SCANS_FILE, JSON.stringify(scans, null, 2));
}

app.post('/scan', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  console.log(`Starting scan for: ${url}`);

  const pythonProcess = spawn('python3', ['backend/scanner.py', url]);

  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.log('Scanner log:', data.toString());
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('Scanner error:', errorOutput);
      return res.status(500).json({ error: 'Scan failed', details: errorOutput });
    }

    try {
      const result = JSON.parse(output);
      
      const scans = loadScans();
      scans.push(result);
      saveScans(scans);

      console.log('Scan completed successfully');
      res.json(result);
    } catch (error) {
      console.error('Failed to parse scanner output:', error);
      res.status(500).json({ error: 'Failed to parse scan results', output });
    }
  });
});

app.get('/scans', (req, res) => {
  const scans = loadScans();
  res.json(scans);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Python scanner ready');
});
