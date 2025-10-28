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

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

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

app.post('/advanced-scan', async (req, res) => {
  const { url, config } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  console.log(`Starting advanced scan for: ${url}`);
  console.log('Config:', config);

  const configJson = JSON.stringify(config || {});
  const pythonProcess = spawn('python3', ['backend/advanced_scanner.py', url, configJson]);

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

      console.log('Advanced scan completed successfully');
      res.json(result);
    } catch (error) {
      console.error('Failed to parse scanner output:', error);
      res.status(500).json({ error: 'Failed to parse scan results', output });
    }
  });
});

app.get('/trends', (req, res) => {
  const scans = loadScans();
  
  // Group scans by date
  const trends = {};
  scans.forEach(scan => {
    const date = new Date(scan.timestamp).toISOString().split('T')[0];
    if (!trends[date]) {
      trends[date] = {
        date,
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        scans: 0
      };
    }
    
    trends[date].scans += 1;
    
    if (scan.vulnerabilities) {
      trends[date].total += scan.vulnerabilities.length;
      scan.vulnerabilities.forEach(v => {
        const severity = v.severity?.toLowerCase() || 'low';
        if (trends[date][severity] !== undefined) {
          trends[date][severity] += 1;
        }
      });
    }
  });
  
  res.json(Object.values(trends).sort((a, b) => a.date.localeCompare(b.date)));
});

app.get('/stats', (req, res) => {
  const scans = loadScans();
  
  const stats = {
    totalScans: scans.length,
    totalVulnerabilities: 0,
    severityCounts: { critical: 0, high: 0, medium: 0, low: 0 },
    averageRiskScore: 0,
    recentScans: scans.slice(-10).reverse()
  };
  
  let totalRiskScore = 0;
  let scansWithRiskScore = 0;
  
  scans.forEach(scan => {
    if (scan.vulnerabilities) {
      stats.totalVulnerabilities += scan.vulnerabilities.length;
      scan.vulnerabilities.forEach(v => {
        const severity = v.severity?.toLowerCase() || 'low';
        if (stats.severityCounts[severity] !== undefined) {
          stats.severityCounts[severity] += 1;
        }
      });
    }
    
    if (scan.risk_score !== undefined) {
      totalRiskScore += scan.risk_score;
      scansWithRiskScore += 1;
    }
  });
  
  if (scansWithRiskScore > 0) {
    stats.averageRiskScore = Math.round(totalRiskScore / scansWithRiskScore);
  }
  
  res.json(stats);
});

// Ultimate Scanner with all 10 advanced features
app.post('/ultimate-scan', async (req, res) => {
  const { url, config } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  console.log(`Starting ultimate scan for: ${url}`);
  console.log('Config:', config);

  const configJson = JSON.stringify(config || {});
  const pythonProcess = spawn('python3', ['backend/ultimate_scanner.py', url, configJson]);

  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.log('Ultimate Scanner log:', data.toString());
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

      console.log('Ultimate scan completed successfully');
      res.json(result);
    } catch (error) {
      console.error('Failed to parse scanner output:', error);
      res.status(500).json({ error: 'Failed to parse scan results', output });
    }
  });
});

// Export scan results endpoint
app.get('/export/:scanId/:format', (req, res) => {
  const { scanId, format } = req.params;
  const scans = loadScans();
  const scan = scans.find(s => s.id === scanId);

  if (!scan) {
    return res.status(404).json({ error: 'Scan not found' });
  }

  try {
    switch (format) {
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="scan-${scanId}.json"`);
        res.send(JSON.stringify(scan, null, 2));
        break;

      case 'csv':
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="scan-${scanId}.csv"`);
        
        let csv = 'Type,Severity,Description,Location,Recommendation\n';
        if (scan.vulnerabilities) {
          scan.vulnerabilities.forEach(v => {
            csv += `"${v.type || ''}","${v.severity || ''}","${v.description || ''}","${v.location || ''}","${v.recommendation || ''}"\n`;
          });
        }
        res.send(csv);
        break;

      case 'txt':
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="scan-${scanId}.txt"`);
        
        let txt = `=== VULNERABILITY SCAN REPORT ===\n\n`;
        txt += `Scan ID: ${scan.id}\n`;
        txt += `URL: ${scan.url}\n`;
        txt += `Timestamp: ${scan.timestamp}\n`;
        txt += `Risk Score: ${scan.risk_score || 'N/A'}\n`;
        txt += `Total Vulnerabilities: ${scan.vulnerabilities ? scan.vulnerabilities.length : 0}\n\n`;
        
        if (scan.vulnerabilities && scan.vulnerabilities.length > 0) {
          txt += `=== VULNERABILITIES ===\n\n`;
          scan.vulnerabilities.forEach((v, i) => {
            txt += `${i + 1}. ${v.type || 'Unknown'}\n`;
            txt += `   Severity: ${v.severity || 'N/A'}\n`;
            txt += `   Description: ${v.description || 'N/A'}\n`;
            txt += `   Location: ${v.location || 'N/A'}\n`;
            txt += `   Recommendation: ${v.recommendation || 'N/A'}\n\n`;
          });
        }
        res.send(txt);
        break;

      default:
        res.status(400).json({ error: 'Invalid format. Use json, csv, or txt' });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export scan results' });
  }
});

// Compare two scans endpoint
app.get('/compare/:scanId1/:scanId2', (req, res) => {
  const { scanId1, scanId2 } = req.params;
  const scans = loadScans();
  
  const scan1 = scans.find(s => s.id === scanId1);
  const scan2 = scans.find(s => s.id === scanId2);

  if (!scan1 || !scan2) {
    return res.status(404).json({ error: 'One or both scans not found' });
  }

  try {
    const comparison = {
      scan1: {
        id: scan1.id,
        url: scan1.url,
        timestamp: scan1.timestamp,
        risk_score: scan1.risk_score || 0,
        vulnerability_count: scan1.vulnerabilities ? scan1.vulnerabilities.length : 0
      },
      scan2: {
        id: scan2.id,
        url: scan2.url,
        timestamp: scan2.timestamp,
        risk_score: scan2.risk_score || 0,
        vulnerability_count: scan2.vulnerabilities ? scan2.vulnerabilities.length : 0
      },
      differences: {
        risk_score_change: (scan2.risk_score || 0) - (scan1.risk_score || 0),
        vulnerability_count_change: (scan2.vulnerabilities ? scan2.vulnerabilities.length : 0) - (scan1.vulnerabilities ? scan1.vulnerabilities.length : 0)
      }
    };

    // Find new vulnerabilities (in scan2 but not in scan1)
    const vulns1 = scan1.vulnerabilities || [];
    const vulns2 = scan2.vulnerabilities || [];
    
    const newVulnerabilities = vulns2.filter(v2 => 
      !vulns1.some(v1 => v1.type === v2.type && v1.location === v2.location)
    );
    
    // Find fixed vulnerabilities (in scan1 but not in scan2)
    const fixedVulnerabilities = vulns1.filter(v1 => 
      !vulns2.some(v2 => v2.type === v1.type && v2.location === v1.location)
    );
    
    // Find common vulnerabilities
    const commonVulnerabilities = vulns1.filter(v1 => 
      vulns2.some(v2 => v2.type === v1.type && v2.location === v1.location)
    );

    comparison.new_vulnerabilities = newVulnerabilities;
    comparison.fixed_vulnerabilities = fixedVulnerabilities;
    comparison.common_vulnerabilities = commonVulnerabilities;
    comparison.summary = {
      new_count: newVulnerabilities.length,
      fixed_count: fixedVulnerabilities.length,
      common_count: commonVulnerabilities.length,
      status: newVulnerabilities.length > 0 ? 'deteriorated' : 
              fixedVulnerabilities.length > 0 ? 'improved' : 'unchanged'
    };

    res.json(comparison);
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ error: 'Failed to compare scans' });
  }
});

// Export scan results endpoint
app.post('/export', (req, res) => {
  try {
    const { scanIds, format } = req.body;
    const scans = loadScans();
    
    let dataToExport;
    if (scanIds && scanIds.length > 0) {
      dataToExport = scans.filter(scan => scanIds.includes(scan.id));
    } else {
      dataToExport = scans;
    }

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=scan-results.json');
      res.json(dataToExport);
    } else if (format === 'csv') {
      const csv = convertToCSV(dataToExport);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=scan-results.csv');
      res.send(csv);
    } else if (format === 'text') {
      const text = convertToText(dataToExport);
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename=scan-results.txt');
      res.send(text);
    } else {
      res.status(400).json({ error: 'Invalid format. Use json, csv, or text' });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export scan results' });
  }
});

// Advanced search/filter endpoint
app.post('/scans/search', (req, res) => {
  try {
    const { query, filters } = req.body;
    let scans = loadScans();

    // Apply text search
    if (query) {
      const searchTerm = query.toLowerCase();
      scans = scans.filter(scan => 
        scan.url?.toLowerCase().includes(searchTerm) ||
        scan.scan_type?.toLowerCase().includes(searchTerm) ||
        scan.vulnerabilities?.some(v => 
          v.title?.toLowerCase().includes(searchTerm) ||
          v.description?.toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply filters
    if (filters) {
      if (filters.scanType) {
        scans = scans.filter(scan => scan.scan_type === filters.scanType);
      }
      
      if (filters.severity) {
        scans = scans.filter(scan => 
          scan.vulnerabilities?.some(v => v.severity === filters.severity)
        );
      }
      
      if (filters.dateFrom) {
        scans = scans.filter(scan => new Date(scan.timestamp) >= new Date(filters.dateFrom));
      }
      
      if (filters.dateTo) {
        scans = scans.filter(scan => new Date(scan.timestamp) <= new Date(filters.dateTo));
      }
      
      if (filters.minRiskScore !== undefined) {
        scans = scans.filter(scan => scan.risk_score >= filters.minRiskScore);
      }
      
      if (filters.maxRiskScore !== undefined) {
        scans = scans.filter(scan => scan.risk_score <= filters.maxRiskScore);
      }
    }

    // Sort results
    if (filters?.sortBy) {
      scans.sort((a, b) => {
        if (filters.sortBy === 'date') {
          return filters.sortOrder === 'asc' 
            ? new Date(a.timestamp) - new Date(b.timestamp)
            : new Date(b.timestamp) - new Date(a.timestamp);
        } else if (filters.sortBy === 'risk_score') {
          return filters.sortOrder === 'asc'
            ? a.risk_score - b.risk_score
            : b.risk_score - a.risk_score;
        }
        return 0;
      });
    }

    res.json({
      results: scans,
      total: scans.length,
      query,
      filters
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search scans' });
  }
});

// Helper function to convert scans to CSV
function convertToCSV(scans) {
  if (scans.length === 0) return 'No data';
  
  const headers = ['ID', 'URL', 'Scan Type', 'Risk Score', 'Vulnerabilities', 'Timestamp'];
  const rows = scans.map(scan => [
    scan.id || '',
    scan.url || '',
    scan.scan_type || '',
    scan.risk_score || '',
    scan.vulnerabilities?.length || 0,
    scan.timestamp || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
}

// Helper function to convert scans to text
function convertToText(scans) {
  if (scans.length === 0) return 'No scan data available';
  
  let text = '='.repeat(80) + '\n';
  text += 'SCAN RESULTS EXPORT\n';
  text += '='.repeat(80) + '\n\n';
  
  scans.forEach((scan, index) => {
    text += `Scan ${index + 1}:\n`;
    text += `-`.repeat(80) + '\n';
    text += `ID:          ${scan.id || 'N/A'}\n`;
    text += `URL:         ${scan.url || 'N/A'}\n`;
    text += `Type:        ${scan.scan_type || 'N/A'}\n`;
    text += `Risk Score:  ${scan.risk_score || 'N/A'}\n`;
    text += `Timestamp:   ${scan.timestamp || 'N/A'}\n`;
    text += `Vulnerabilities: ${scan.vulnerabilities?.length || 0}\n`;
    
    if (scan.vulnerabilities && scan.vulnerabilities.length > 0) {
      text += '\nVulnerabilities:\n';
      scan.vulnerabilities.forEach((vuln, vIndex) => {
        text += `  ${vIndex + 1}. ${vuln.title || 'Unknown'} (${vuln.severity || 'N/A'})\n`;
        if (vuln.description) {
          text += `     ${vuln.description}\n`;
        }
      });
    }
    text += '\n';
  });
  
  return text;
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Python scanner ready');
  console.log('New features: Export & Advanced Search enabled');
});
