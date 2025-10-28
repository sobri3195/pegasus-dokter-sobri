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

// Advanced Search & Filter endpoint
app.post('/scans/search', (req, res) => {
  const { query, severity, dateFrom, dateTo, sortBy, sortOrder } = req.body;
  let scans = loadScans();

  // Filter by search query (URL or description)
  if (query) {
    const lowerQuery = query.toLowerCase();
    scans = scans.filter(scan => 
      scan.url?.toLowerCase().includes(lowerQuery) ||
      scan.vulnerabilities?.some(v => 
        v.description?.toLowerCase().includes(lowerQuery) ||
        v.type?.toLowerCase().includes(lowerQuery)
      )
    );
  }

  // Filter by severity
  if (severity && severity !== 'all') {
    scans = scans.filter(scan =>
      scan.vulnerabilities?.some(v => 
        v.severity?.toLowerCase() === severity.toLowerCase()
      )
    );
  }

  // Filter by date range
  if (dateFrom) {
    scans = scans.filter(scan => 
      new Date(scan.timestamp) >= new Date(dateFrom)
    );
  }

  if (dateTo) {
    scans = scans.filter(scan => 
      new Date(scan.timestamp) <= new Date(dateTo)
    );
  }

  // Sort results
  if (sortBy) {
    scans.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.timestamp);
          bValue = new Date(b.timestamp);
          break;
        case 'url':
          aValue = a.url;
          bValue = b.url;
          break;
        case 'vulnerabilities':
          aValue = a.vulnerabilities?.length || 0;
          bValue = b.vulnerabilities?.length || 0;
          break;
        case 'risk':
          aValue = a.risk_score || 0;
          bValue = b.risk_score || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
  }

  res.json({
    total: scans.length,
    scans: scans
  });
});

// Bulk export multiple scans
app.post('/export/bulk', (req, res) => {
  const { scanIds, format } = req.body;
  
  if (!scanIds || !Array.isArray(scanIds) || scanIds.length === 0) {
    return res.status(400).json({ error: 'Scan IDs array is required' });
  }

  const scans = loadScans();
  const selectedScans = scans.filter(scan => scanIds.includes(scan.id));

  if (selectedScans.length === 0) {
    return res.status(404).json({ error: 'No scans found' });
  }

  try {
    switch (format) {
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="scans-bulk-export.json"');
        res.send(JSON.stringify(selectedScans, null, 2));
        break;

      case 'csv':
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="scans-bulk-export.csv"');
        
        let csv = 'Scan ID,URL,Timestamp,Vulnerability Type,Severity,Description,Location\n';
        selectedScans.forEach(scan => {
          if (scan.vulnerabilities && scan.vulnerabilities.length > 0) {
            scan.vulnerabilities.forEach(v => {
              csv += `"${scan.id}","${scan.url}","${scan.timestamp}","${v.type || ''}","${v.severity || ''}","${v.description || ''}","${v.location || ''}"\n`;
            });
          } else {
            csv += `"${scan.id}","${scan.url}","${scan.timestamp}","No vulnerabilities","","",""\n`;
          }
        });
        res.send(csv);
        break;

      case 'txt':
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', 'attachment; filename="scans-bulk-export.txt"');
        
        let txt = `=== BULK VULNERABILITY SCAN REPORT ===\n\n`;
        txt += `Total Scans: ${selectedScans.length}\n`;
        txt += `Generated: ${new Date().toISOString()}\n\n`;
        txt += `${'='.repeat(80)}\n\n`;
        
        selectedScans.forEach((scan, index) => {
          txt += `SCAN ${index + 1}/${selectedScans.length}\n`;
          txt += `ID: ${scan.id}\n`;
          txt += `URL: ${scan.url}\n`;
          txt += `Timestamp: ${scan.timestamp}\n`;
          txt += `Risk Score: ${scan.risk_score || 'N/A'}\n`;
          txt += `Total Vulnerabilities: ${scan.vulnerabilities?.length || 0}\n\n`;
          
          if (scan.vulnerabilities && scan.vulnerabilities.length > 0) {
            txt += 'Vulnerabilities:\n';
            scan.vulnerabilities.forEach((v, vIndex) => {
              txt += `  ${vIndex + 1}. [${v.severity || 'N/A'}] ${v.type || 'Unknown'}\n`;
              txt += `     ${v.description || 'No description'}\n`;
              if (v.location) txt += `     Location: ${v.location}\n`;
              txt += '\n';
            });
          } else {
            txt += 'No vulnerabilities found.\n\n';
          }
          txt += `${'-'.repeat(80)}\n\n`;
        });
        
        res.send(txt);
        break;

      default:
        return res.status(400).json({ error: 'Invalid format. Use json, csv, or txt' });
    }
  } catch (error) {
    console.error('Bulk export error:', error);
    res.status(500).json({ error: 'Failed to export scans' });
  }
});

// ==================== NEW FEATURES ====================

// Scheduler storage
const SCHEDULER_FILE = path.join(__dirname, 'data', 'schedulers.json');

if (!fs.existsSync(SCHEDULER_FILE)) {
  fs.writeFileSync(SCHEDULER_FILE, JSON.stringify([], null, 2));
}

function loadSchedulers() {
  try {
    const data = fs.readFileSync(SCHEDULER_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveSchedulers(schedulers) {
  fs.writeFileSync(SCHEDULER_FILE, JSON.stringify(schedulers, null, 2));
}

// Scheduler endpoints
app.get('/schedulers', (req, res) => {
  const schedulers = loadSchedulers();
  res.json(schedulers);
});

app.post('/schedulers', (req, res) => {
  const { name, url, frequency, scanType, enabled } = req.body;
  
  if (!name || !url || !frequency) {
    return res.status(400).json({ error: 'Name, URL, and frequency are required' });
  }

  const schedulers = loadSchedulers();
  const newScheduler = {
    id: `scheduler-${Date.now()}`,
    name,
    url,
    frequency, // 'daily', 'weekly', 'monthly'
    scanType: scanType || 'basic',
    enabled: enabled !== undefined ? enabled : true,
    createdAt: new Date().toISOString(),
    lastRun: null,
    nextRun: calculateNextRun(frequency),
    totalRuns: 0
  };

  schedulers.push(newScheduler);
  saveSchedulers(schedulers);
  
  res.json({ success: true, scheduler: newScheduler });
});

app.put('/schedulers/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const schedulers = loadSchedulers();
  const index = schedulers.findIndex(s => s.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Scheduler not found' });
  }

  schedulers[index] = { ...schedulers[index], ...updates };
  if (updates.frequency) {
    schedulers[index].nextRun = calculateNextRun(updates.frequency);
  }
  
  saveSchedulers(schedulers);
  res.json({ success: true, scheduler: schedulers[index] });
});

app.delete('/schedulers/:id', (req, res) => {
  const { id } = req.params;
  
  let schedulers = loadSchedulers();
  schedulers = schedulers.filter(s => s.id !== id);
  
  saveSchedulers(schedulers);
  res.json({ success: true });
});

function calculateNextRun(frequency) {
  const now = new Date();
  switch (frequency) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      break;
  }
  return now.toISOString();
}

// Scan Comparison endpoint
app.post('/scans/compare', (req, res) => {
  const { scanId1, scanId2 } = req.body;
  
  if (!scanId1 || !scanId2) {
    return res.status(400).json({ error: 'Two scan IDs are required' });
  }

  const scans = loadScans();
  const scan1 = scans.find(s => s.id === scanId1);
  const scan2 = scans.find(s => s.id === scanId2);

  if (!scan1 || !scan2) {
    return res.status(404).json({ error: 'One or both scans not found' });
  }

  // Compare vulnerabilities
  const vuln1Types = new Set(scan1.vulnerabilities?.map(v => v.type) || []);
  const vuln2Types = new Set(scan2.vulnerabilities?.map(v => v.type) || []);

  const newVulnerabilities = [...vuln2Types].filter(t => !vuln1Types.has(t));
  const fixedVulnerabilities = [...vuln1Types].filter(t => !vuln2Types.has(t));
  const commonVulnerabilities = [...vuln1Types].filter(t => vuln2Types.has(t));

  // Compare severity counts
  const countBySeverity = (scan) => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    scan.vulnerabilities?.forEach(v => {
      const severity = v.severity?.toLowerCase() || 'low';
      if (counts[severity] !== undefined) counts[severity]++;
    });
    return counts;
  };

  const comparison = {
    scan1: {
      id: scan1.id,
      url: scan1.url,
      timestamp: scan1.timestamp,
      totalVulnerabilities: scan1.vulnerabilities?.length || 0,
      riskScore: scan1.risk_score || 0,
      severityCounts: countBySeverity(scan1)
    },
    scan2: {
      id: scan2.id,
      url: scan2.url,
      timestamp: scan2.timestamp,
      totalVulnerabilities: scan2.vulnerabilities?.length || 0,
      riskScore: scan2.risk_score || 0,
      severityCounts: countBySeverity(scan2)
    },
    differences: {
      newVulnerabilities: newVulnerabilities.length,
      fixedVulnerabilities: fixedVulnerabilities.length,
      commonVulnerabilities: commonVulnerabilities.length,
      newVulnTypes: newVulnerabilities,
      fixedVulnTypes: fixedVulnerabilities,
      totalChange: (scan2.vulnerabilities?.length || 0) - (scan1.vulnerabilities?.length || 0),
      riskScoreChange: (scan2.risk_score || 0) - (scan1.risk_score || 0),
      improvement: (scan2.risk_score || 0) > (scan1.risk_score || 0)
    }
  };

  res.json(comparison);
});

// Get scan timeline for a URL
app.post('/scans/timeline', (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const scans = loadScans();
  const urlScans = scans
    .filter(s => s.url === url)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const timeline = urlScans.map(scan => ({
    id: scan.id,
    timestamp: scan.timestamp,
    totalVulnerabilities: scan.vulnerabilities?.length || 0,
    riskScore: scan.risk_score || 0,
    severityCounts: {
      critical: scan.vulnerabilities?.filter(v => v.severity?.toLowerCase() === 'critical').length || 0,
      high: scan.vulnerabilities?.filter(v => v.severity?.toLowerCase() === 'high').length || 0,
      medium: scan.vulnerabilities?.filter(v => v.severity?.toLowerCase() === 'medium').length || 0,
      low: scan.vulnerabilities?.filter(v => v.severity?.toLowerCase() === 'low').length || 0
    }
  }));

  res.json({
    url,
    totalScans: timeline.length,
    timeline
  });
});

// Real-time stats endpoint
app.get('/stats/realtime', (req, res) => {
  const scans = loadScans();
  const schedulers = loadSchedulers();
  
  // Get recent scans (last 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentScans = scans.filter(s => new Date(s.timestamp) > oneDayAgo);

  // Count vulnerabilities by severity
  const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
  scans.forEach(scan => {
    scan.vulnerabilities?.forEach(v => {
      const severity = v.severity?.toLowerCase() || 'low';
      if (severityCounts[severity] !== undefined) {
        severityCounts[severity]++;
      }
    });
  });

  // Calculate trend
  const lastWeekScans = scans.filter(s => 
    new Date(s.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  const stats = {
    totalScans: scans.length,
    scansLast24h: recentScans.length,
    scansLastWeek: lastWeekScans.length,
    totalVulnerabilities: scans.reduce((acc, s) => acc + (s.vulnerabilities?.length || 0), 0),
    severityCounts,
    activeSchedulers: schedulers.filter(s => s.enabled).length,
    totalSchedulers: schedulers.length,
    averageRiskScore: scans.length > 0 
      ? Math.round(scans.reduce((acc, s) => acc + (s.risk_score || 0), 0) / scans.length)
      : 0,
    lastScan: scans.length > 0 ? scans[scans.length - 1] : null
  };

  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Python scanner ready');
  console.log('New features: Export, Search, Scheduler, Comparison & Real-time Stats enabled');
});
