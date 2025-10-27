#!/usr/bin/env python3
"""
Ultimate Web Vulnerability Scanner
Includes: Safe exploit testing, AI pattern recognition, form fuzzer, 
JS scanner, recursive crawl, tech fingerprinting, CVE matching, 
risk correlation, report generation, and credential checker
"""

import sys
import json
import re
import requests
import dns.resolver
import socket
import ssl
import subprocess
from urllib.parse import urlparse, urljoin, parse_qs, urlunparse
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import warnings
from collections import defaultdict
import hashlib
import os
import base64

warnings.filterwarnings('ignore', message='Unverified HTTPS request')

# Try importing ML libraries
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.naive_bayes import MultinomialNB
    import numpy as np
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False

# Try importing PDF generation
try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
    from reportlab.lib import colors
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False


class AIPatternRecognizer:
    """AI-Based Pattern Recognition for vulnerability detection"""
    
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.trained = False
        
        if ML_AVAILABLE:
            self.train_model()
    
    def train_model(self):
        """Train a simple classifier for vulnerability patterns"""
        # Training data: (text, label)
        # Labels: 0=safe, 1=sqli, 2=xss, 3=error
        training_data = [
            # Safe responses
            ("Welcome to our website", 0),
            ("Page loaded successfully", 0),
            ("Thank you for your submission", 0),
            ("Homepage content", 0),
            
            # SQL Injection indicators
            ("SQL syntax error near", 1),
            ("mysql_fetch_array", 1),
            ("You have an error in your SQL syntax", 1),
            ("Warning: mysql_", 1),
            ("ORA-00933: SQL command not properly ended", 1),
            ("Microsoft SQL Native Client error", 1),
            ("PostgreSQL query failed", 1),
            
            # XSS indicators
            ("<script>alert", 2),
            ("javascript:alert", 2),
            ("<img src=x onerror=", 2),
            ("eval(", 2),
            ("<svg onload=", 2),
            
            # Error/Debug indicators
            ("Fatal error:", 3),
            ("Stack trace:", 3),
            ("Exception:", 3),
            ("Traceback (most recent call last):", 3),
            ("Parse error:", 3),
            ("Warning:", 3)
        ]
        
        texts = [text for text, _ in training_data]
        labels = [label for _, label in training_data]
        
        self.vectorizer = TfidfVectorizer(max_features=100)
        X = self.vectorizer.fit_transform(texts)
        
        self.model = MultinomialNB()
        self.model.fit(X, labels)
        self.trained = True
    
    def classify_response(self, text):
        """Classify a response text for vulnerability indicators"""
        if not self.trained or not ML_AVAILABLE:
            return self.rule_based_classification(text)
        
        try:
            X = self.vectorizer.transform([text])
            prediction = self.model.predict(X)[0]
            confidence = np.max(self.model.predict_proba(X))
            
            categories = {0: 'safe', 1: 'sqli', 2: 'xss', 3: 'error'}
            return {
                'category': categories.get(prediction, 'unknown'),
                'confidence': float(confidence),
                'vulnerable': prediction > 0
            }
        except:
            return self.rule_based_classification(text)
    
    def rule_based_classification(self, text):
        """Fallback rule-based classification"""
        text_lower = text.lower()
        
        sql_patterns = ['sql syntax', 'mysql', 'postgresql', 'ora-', 'database error']
        xss_patterns = ['<script', 'javascript:', 'onerror=', 'onload=']
        error_patterns = ['fatal error', 'exception', 'traceback', 'parse error']
        
        if any(p in text_lower for p in sql_patterns):
            return {'category': 'sqli', 'confidence': 0.8, 'vulnerable': True}
        elif any(p in text_lower for p in xss_patterns):
            return {'category': 'xss', 'confidence': 0.8, 'vulnerable': True}
        elif any(p in text_lower for p in error_patterns):
            return {'category': 'error', 'confidence': 0.7, 'vulnerable': True}
        else:
            return {'category': 'safe', 'confidence': 0.6, 'vulnerable': False}


class UltimateScanner:
    def __init__(self, url, config=None):
        self.url = url if url.startswith(('http://', 'https://')) else 'https://' + url
        self.parsed_url = urlparse(self.url)
        self.hostname = self.parsed_url.hostname
        self.config = config or {}
        
        # Load databases
        self.signatures = self.load_json('data/vuln_signatures.json')
        self.tech_fingerprints = self.load_json('data/tech_fingerprints.json')
        self.cve_db = self.load_json('data/cve_db.json')
        
        # Initialize AI
        self.ai = AIPatternRecognizer() if ML_AVAILABLE else None
        
        # Results storage
        self.vulnerabilities = []
        self.findings = {
            'subdomains': [],
            'directories': [],
            'open_ports': [],
            'headers': {},
            'cookies': {},
            'ssl_info': {},
            'tool_results': {},
            'forms': [],
            'js_libraries': [],
            'tech_stack': [],
            'cve_matches': [],
            'crawled_pages': [],
            'credentials_issues': []
        }
        
        # Crawl tracking
        self.visited_urls = set()
        self.max_crawl_depth = self.config.get('max_crawl_depth', 3)
        self.max_pages = self.config.get('max_pages', 50)
        
    def load_json(self, filepath):
        """Load JSON file"""
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except:
            return {}
    
    def safe_request(self, url, method='GET', **kwargs):
        """Make a safe HTTP request with timeout"""
        try:
            kwargs.setdefault('timeout', 10)
            kwargs.setdefault('verify', False)
            kwargs.setdefault('allow_redirects', True)
            
            if method == 'GET':
                response = requests.get(url, **kwargs)
            elif method == 'POST':
                response = requests.post(url, **kwargs)
            else:
                response = requests.request(method, url, **kwargs)
            
            return response
        except Exception as e:
            return None
    
    # ==================== FEATURE 1: Active Exploit Testing (Safe Mode) ====================
    
    def test_xss_reflection(self, url, param):
        """Test XSS reflection in parameter (safe mode)"""
        test_payloads = self.signatures.get('xss_test_payloads', [
            '<script>alert(1)</script>',
            '<img src=x onerror=alert(1)>',
            '<svg onload=alert(1)>'
        ])
        
        results = []
        for payload in test_payloads:
            test_url = f"{url}?{param}={payload}"
            response = self.safe_request(test_url)
            
            if response and payload in response.text:
                results.append({
                    'payload': payload,
                    'reflected': True,
                    'url': test_url,
                    'safe_mode': True
                })
                
                # AI classification
                if self.ai:
                    classification = self.ai.classify_response(response.text)
                    results[-1]['ai_classification'] = classification
        
        return results
    
    def test_sql_injection(self, url, param):
        """Test SQL injection in parameter (safe mode)"""
        test_payloads = self.signatures.get('sql_test_payloads', [
            "' OR '1'='1",
            "' OR 1=1--",
            '" OR "1"="1',
            "1' AND 1=1--"
        ])
        
        results = []
        baseline_response = self.safe_request(f"{url}?{param}=1")
        baseline_length = len(baseline_response.text) if baseline_response else 0
        
        for payload in test_payloads:
            test_url = f"{url}?{param}={payload}"
            response = self.safe_request(test_url)
            
            if response:
                # Check for SQL error messages
                sql_errors = self.signatures.get('sql_injection_errors', [])
                for error_pattern in sql_errors:
                    if re.search(error_pattern, response.text, re.IGNORECASE):
                        results.append({
                            'payload': payload,
                            'error_detected': error_pattern,
                            'url': test_url,
                            'safe_mode': True,
                            'severity': 'High'
                        })
                        break
                
                # Check for response length differences (blind SQLi indicator)
                response_length = len(response.text)
                if abs(response_length - baseline_length) > 100:
                    results.append({
                        'payload': payload,
                        'length_difference': abs(response_length - baseline_length),
                        'url': test_url,
                        'safe_mode': True,
                        'severity': 'Medium'
                    })
        
        return results
    
    def test_lfi(self, url, param):
        """Test Local File Inclusion (safe mode)"""
        lfi_payloads = [
            '../../etc/passwd',
            '../../../etc/passwd',
            '....//....//etc/passwd',
            '/etc/passwd'
        ]
        
        results = []
        for payload in lfi_payloads:
            test_url = f"{url}?{param}={payload}"
            response = self.safe_request(test_url)
            
            if response:
                # Check for Linux passwd file indicators
                if 'root:x:0:0:' in response.text or 'daemon:' in response.text:
                    results.append({
                        'payload': payload,
                        'file_disclosed': '/etc/passwd',
                        'url': test_url,
                        'safe_mode': True,
                        'severity': 'Critical'
                    })
        
        return results
    
    def active_exploit_testing(self):
        """Run all active exploit tests in safe mode"""
        if not self.config.get('active_exploit_test', False):
            return
        
        # Find URLs with parameters
        test_urls = []
        for page in self.findings.get('crawled_pages', [self.url]):
            parsed = urlparse(page)
            if parsed.query:
                params = parse_qs(parsed.query)
                for param in params:
                    base_url = urlunparse((parsed.scheme, parsed.netloc, parsed.path, '', '', ''))
                    test_urls.append((base_url, param))
        
        # If no params found, test the main URL
        if not test_urls:
            test_urls = [(self.url, 'id'), (self.url, 'page')]
        
        for url, param in test_urls[:5]:  # Limit to 5 tests
            # Test XSS
            xss_results = self.test_xss_reflection(url, param)
            if xss_results:
                self.vulnerabilities.append({
                    'type': 'XSS Reflection (Safe Mode)',
                    'severity': 'High',
                    'description': f'XSS payload reflected in parameter: {param}',
                    'details': xss_results,
                    'recommendation': 'Implement input validation and output encoding'
                })
            
            # Test SQL Injection
            sql_results = self.test_sql_injection(url, param)
            if sql_results:
                self.vulnerabilities.append({
                    'type': 'SQL Injection (Safe Mode)',
                    'severity': 'Critical',
                    'description': f'SQL injection detected in parameter: {param}',
                    'details': sql_results,
                    'recommendation': 'Use parameterized queries and input validation'
                })
            
            # Test LFI
            lfi_results = self.test_lfi(url, param)
            if lfi_results:
                self.vulnerabilities.append({
                    'type': 'Local File Inclusion (Safe Mode)',
                    'severity': 'Critical',
                    'description': f'LFI vulnerability in parameter: {param}',
                    'details': lfi_results,
                    'recommendation': 'Implement strict file path validation'
                })
    
    # ==================== FEATURE 3: Form & Input Fuzzer ====================
    
    def discover_forms(self, url):
        """Discover all forms on a page"""
        response = self.safe_request(url)
        if not response:
            return []
        
        soup = BeautifulSoup(response.text, 'html.parser')
        forms = []
        
        for form in soup.find_all('form'):
            form_data = {
                'action': form.get('action', ''),
                'method': form.get('method', 'get').upper(),
                'inputs': [],
                'url': url
            }
            
            # Get all input fields
            for input_field in form.find_all(['input', 'textarea', 'select']):
                input_data = {
                    'name': input_field.get('name', ''),
                    'type': input_field.get('type', 'text'),
                    'value': input_field.get('value', '')
                }
                form_data['inputs'].append(input_data)
            
            forms.append(form_data)
        
        return forms
    
    def fuzz_form(self, form_data):
        """Fuzz a form with various payloads"""
        results = {'safe': True, 'issues': []}
        
        # Prepare action URL
        action = form_data['action']
        if not action:
            action = form_data['url']
        elif not action.startswith('http'):
            action = urljoin(form_data['url'], action)
        
        # Prepare payloads
        test_payloads = {
            'xss': ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>'],
            'sqli': ["' OR '1'='1", '" OR "1"="1'],
            'command': ['$(whoami)', '`whoami`', ';ls'],
        }
        
        for input_field in form_data['inputs']:
            if not input_field['name']:
                continue
            
            # Test each payload type
            for vuln_type, payloads in test_payloads.items():
                for payload in payloads:
                    # Prepare form data
                    form_params = {}
                    for inp in form_data['inputs']:
                        if inp['name']:
                            form_params[inp['name']] = payload if inp['name'] == input_field['name'] else 'test'
                    
                    # Send request
                    if form_data['method'] == 'POST':
                        response = self.safe_request(action, method='POST', data=form_params)
                    else:
                        response = self.safe_request(action, params=form_params)
                    
                    if response:
                        # Check for reflection/errors
                        if payload in response.text:
                            results['safe'] = False
                            results['issues'].append({
                                'type': vuln_type,
                                'field': input_field['name'],
                                'payload': payload,
                                'reflected': True
                            })
                        
                        # AI classification
                        if self.ai:
                            classification = self.ai.classify_response(response.text)
                            if classification['vulnerable']:
                                results['safe'] = False
                                results['issues'].append({
                                    'type': classification['category'],
                                    'field': input_field['name'],
                                    'ai_detected': True,
                                    'confidence': classification['confidence']
                                })
        
        return results
    
    def form_fuzzer(self):
        """Scan and fuzz all forms"""
        if not self.config.get('form_fuzzer', False):
            return
        
        pages_to_scan = self.findings.get('crawled_pages', [self.url])[:10]
        
        for page in pages_to_scan:
            forms = self.discover_forms(page)
            
            for form in forms:
                self.findings['forms'].append(form)
                
                # Fuzz the form
                fuzz_results = self.fuzz_form(form)
                
                if not fuzz_results['safe']:
                    self.vulnerabilities.append({
                        'type': 'Form Input Vulnerability',
                        'severity': 'High',
                        'description': f'Form at {page} may be vulnerable to injection',
                        'details': fuzz_results['issues'],
                        'form': form,
                        'recommendation': 'Implement input validation and sanitization'
                    })
    
    # ==================== FEATURE 4: JavaScript & Dependency Scanner ====================
    
    def scan_js_libraries(self):
        """Scan for JavaScript libraries and their versions"""
        if not self.config.get('js_scanner', False):
            return
        
        response = self.safe_request(self.url)
        if not response:
            return
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all script tags
        for script in soup.find_all('script'):
            src = script.get('src', '')
            
            if src:
                # Check against known libraries
                for lib_name, lib_data in self.tech_fingerprints.get('libraries', {}).items():
                    for pattern in lib_data.get('cdn_patterns', []):
                        if pattern in src:
                            # Try to extract version
                            version_regex = lib_data.get('version_regex', '')
                            version = None
                            
                            if version_regex:
                                match = re.search(version_regex, src)
                                if match:
                                    version = match.group(1)
                            
                            lib_info = {
                                'name': lib_name,
                                'source': src,
                                'version': version,
                                'check_cve': lib_data.get('check_cve', False)
                            }
                            
                            self.findings['js_libraries'].append(lib_info)
                            
                            # Check for CVEs
                            if lib_data.get('check_cve', False) and version:
                                self.check_library_cve(lib_name, version)
    
    def check_library_cve(self, library, version):
        """Check if a library version has known CVEs"""
        lib_cves = self.cve_db.get('libraries', {}).get(library.lower(), {})
        
        for version_range, data in lib_cves.get('versions', {}).items():
            for vuln in data.get('vulnerabilities', []):
                # Simple version check (assumes semver)
                if self.version_affected(version, vuln['affected']):
                    cve_match = {
                        'library': library,
                        'version': version,
                        'cve': vuln['cve'],
                        'severity': vuln['severity'],
                        'description': vuln['description'],
                        'reference': vuln['reference']
                    }
                    
                    self.findings['cve_matches'].append(cve_match)
                    
                    self.vulnerabilities.append({
                        'type': 'Vulnerable JavaScript Library',
                        'severity': vuln['severity'],
                        'description': f'{library} {version} has known CVE: {vuln["cve"]}',
                        'details': cve_match,
                        'recommendation': f'Update {library} to the latest version'
                    })
    
    def version_affected(self, version, affected_ranges):
        """Check if version is in affected ranges"""
        # Simple implementation - just checks if version string matches
        for range_str in affected_ranges:
            if '<' in range_str:
                # e.g., "<3.0.0"
                max_version = range_str.replace('<', '').strip()
                if self.compare_versions(version, max_version) < 0:
                    return True
        return False
    
    def compare_versions(self, v1, v2):
        """Compare two semantic versions"""
        try:
            v1_parts = [int(x) for x in v1.split('.')]
            v2_parts = [int(x) for x in v2.split('.')]
            
            for i in range(max(len(v1_parts), len(v2_parts))):
                p1 = v1_parts[i] if i < len(v1_parts) else 0
                p2 = v2_parts[i] if i < len(v2_parts) else 0
                if p1 < p2:
                    return -1
                elif p1 > p2:
                    return 1
            return 0
        except:
            return 0
    
    # ==================== FEATURE 5: Crawl + Recursive Scanning ====================
    
    def recursive_crawl(self, url=None, depth=0):
        """Recursively crawl website"""
        if not self.config.get('recursive_crawl', False):
            return
        
        if url is None:
            url = self.url
        
        if depth > self.max_crawl_depth or len(self.visited_urls) >= self.max_pages:
            return
        
        if url in self.visited_urls:
            return
        
        self.visited_urls.add(url)
        
        response = self.safe_request(url)
        if not response:
            return
        
        # Add to crawled pages
        self.findings['crawled_pages'].append({
            'url': url,
            'status_code': response.status_code,
            'depth': depth,
            'title': self.extract_title(response.text)
        })
        
        # Find all links
        soup = BeautifulSoup(response.text, 'html.parser')
        for link in soup.find_all('a', href=True):
            href = link['href']
            
            # Resolve relative URLs
            full_url = urljoin(url, href)
            parsed = urlparse(full_url)
            
            # Only crawl same domain
            if parsed.hostname == self.hostname:
                self.recursive_crawl(full_url, depth + 1)
    
    def extract_title(self, html):
        """Extract page title"""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            title = soup.find('title')
            return title.string if title else 'No title'
        except:
            return 'No title'
    
    # ==================== FEATURE 6: Web Technology Fingerprinting ====================
    
    def fingerprint_technologies(self):
        """Identify web technologies, frameworks, and CMS"""
        if not self.config.get('tech_fingerprint', False):
            return
        
        response = self.safe_request(self.url)
        if not response:
            return
        
        detected_tech = []
        
        # Check CMS
        for cms_name, cms_data in self.tech_fingerprints.get('cms', {}).items():
            detected = False
            
            # Check indicators in content
            for indicator in cms_data.get('indicators', []):
                if indicator in response.text:
                    detected = True
                    break
            
            # Check headers
            for header_pattern in cms_data.get('headers', []):
                for header, value in response.headers.items():
                    if header_pattern in f"{header}: {value}":
                        detected = True
                        break
            
            # Check cookies
            for cookie_pattern in cms_data.get('cookies', []):
                if cookie_pattern in response.headers.get('Set-Cookie', ''):
                    detected = True
                    break
            
            if detected:
                tech_info = {
                    'type': 'CMS',
                    'name': cms_name,
                    'risk_level': cms_data.get('risk_level', 'Low'),
                    'common_vulns': cms_data.get('common_vulns', [])
                }
                detected_tech.append(tech_info)
                self.findings['tech_stack'].append(tech_info)
                
                # Check for CMS CVEs
                self.check_cms_cve(cms_name.lower())
        
        # Check frameworks
        for fw_name, fw_data in self.tech_fingerprints.get('frameworks', {}).items():
            detected = False
            
            for indicator in fw_data.get('indicators', []):
                if indicator in response.text or indicator in str(response.headers):
                    detected = True
                    break
            
            if detected:
                tech_info = {
                    'type': 'Framework',
                    'name': fw_name,
                    'risk_level': fw_data.get('risk_level', 'Low'),
                    'common_vulns': fw_data.get('common_vulns', [])
                }
                detected_tech.append(tech_info)
                self.findings['tech_stack'].append(tech_info)
        
        # Check servers
        server_header = response.headers.get('Server', '')
        for server_name, server_data in self.tech_fingerprints.get('servers', {}).items():
            for indicator in server_data.get('indicators', []):
                if indicator in server_header:
                    tech_info = {
                        'type': 'Server',
                        'name': server_name,
                        'version': server_header,
                        'risk_level': server_data.get('risk_level', 'Low')
                    }
                    detected_tech.append(tech_info)
                    self.findings['tech_stack'].append(tech_info)
        
        # Add vulnerability if risky tech detected
        for tech in detected_tech:
            if tech.get('risk_level') in ['High', 'Critical']:
                self.vulnerabilities.append({
                    'type': 'Technology Stack Risk',
                    'severity': tech['risk_level'],
                    'description': f'{tech["name"]} detected with {tech["risk_level"]} risk',
                    'details': tech,
                    'recommendation': 'Review technology security posture and update to latest version'
                })
    
    def check_cms_cve(self, cms_name):
        """Check for CMS-specific CVEs"""
        cms_cves = self.cve_db.get('cms', {}).get(cms_name, {})
        
        for version_range, data in cms_cves.get('versions', {}).items():
            for vuln in data.get('vulnerabilities', []):
                cve_match = {
                    'cms': cms_name,
                    'cve': vuln['cve'],
                    'severity': vuln['severity'],
                    'description': vuln['description'],
                    'reference': vuln['reference']
                }
                
                self.findings['cve_matches'].append(cve_match)
                
                self.vulnerabilities.append({
                    'type': 'CMS Vulnerability',
                    'severity': vuln['severity'],
                    'description': f'{cms_name} may be affected by {vuln["cve"]}',
                    'details': cve_match,
                    'recommendation': f'Update {cms_name} to the latest version'
                })
    
    # ==================== FEATURE 8: Smart Risk Correlation ====================
    
    def calculate_risk_score(self):
        """Calculate comprehensive risk score with correlation"""
        score = 100
        severity_weights = {'Critical': 20, 'High': 15, 'Medium': 8, 'Low': 3}
        
        # Deduct points for vulnerabilities
        for vuln in self.vulnerabilities:
            severity = vuln.get('severity', 'Low')
            score -= severity_weights.get(severity, 3)
        
        # Correlation bonuses/penalties
        has_outdated_js = any(lib for lib in self.findings.get('js_libraries', []) 
                              if any(cve['library'].lower() == lib['name'].lower() 
                                    for cve in self.findings.get('cve_matches', [])))
        
        has_missing_headers = any(vuln for vuln in self.vulnerabilities 
                                  if 'Security Header' in vuln.get('type', ''))
        
        has_injection = any(vuln for vuln in self.vulnerabilities 
                           if any(term in vuln.get('type', '') 
                                 for term in ['SQL', 'XSS', 'Injection']))
        
        # If both outdated JS and missing headers, extra penalty
        if has_outdated_js and has_missing_headers:
            score -= 10
            self.vulnerabilities.append({
                'type': 'Risk Correlation',
                'severity': 'High',
                'description': 'Outdated JavaScript libraries combined with missing security headers increases risk',
                'recommendation': 'Update libraries AND implement security headers'
            })
        
        # If injection possible and missing headers, critical
        if has_injection and has_missing_headers:
            score -= 15
            self.vulnerabilities.append({
                'type': 'Risk Correlation',
                'severity': 'Critical',
                'description': 'Injection vulnerabilities with insufficient header protection',
                'recommendation': 'Immediate remediation required for injection vulnerabilities'
            })
        
        return max(0, min(100, score))
    
    def get_risk_level(self, score):
        """Get risk level based on score"""
        if score >= 80:
            return {'level': 'Safe', 'color': 'green', 'icon': '✅'}
        elif score >= 60:
            return {'level': 'Warning', 'color': 'orange', 'icon': '⚠️'}
        else:
            return {'level': 'Danger', 'color': 'red', 'icon': '🔴'}
    
    # ==================== FEATURE 10: Credential & Session Security Checker ====================
    
    def check_credential_security(self):
        """Check login page and session security"""
        if not self.config.get('credential_check', False):
            return
        
        # Look for login pages
        login_paths = ['/login', '/admin', '/signin', '/auth', '/account/login']
        
        for path in login_paths:
            login_url = urljoin(self.url, path)
            response = self.safe_request(login_url)
            
            if response and response.status_code == 200:
                issues = []
                
                # Check if page has password input
                soup = BeautifulSoup(response.text, 'html.parser')
                password_inputs = soup.find_all('input', {'type': 'password'})
                
                if password_inputs:
                    # Check if it's over HTTPS
                    if not login_url.startswith('https://'):
                        issues.append({
                            'issue': 'Password form not over HTTPS',
                            'severity': 'Critical',
                            'detail': 'Credentials sent over unencrypted connection'
                        })
                    
                    # Check for CSRF token
                    csrf_found = False
                    for input_field in soup.find_all('input'):
                        name = input_field.get('name', '').lower()
                        if 'csrf' in name or 'token' in name:
                            csrf_found = True
                            break
                    
                    if not csrf_found:
                        issues.append({
                            'issue': 'No CSRF token found',
                            'severity': 'High',
                            'detail': 'Login form may be vulnerable to CSRF attacks'
                        })
                    
                    # Check cookie security
                    cookies = response.headers.get('Set-Cookie', '')
                    if cookies:
                        if 'Secure' not in cookies:
                            issues.append({
                                'issue': 'Cookie missing Secure flag',
                                'severity': 'Medium',
                                'detail': 'Session cookies can be intercepted'
                            })
                        if 'HttpOnly' not in cookies:
                            issues.append({
                                'issue': 'Cookie missing HttpOnly flag',
                                'severity': 'Medium',
                                'detail': 'Cookies accessible via JavaScript (XSS risk)'
                            })
                        if 'SameSite' not in cookies:
                            issues.append({
                                'issue': 'Cookie missing SameSite attribute',
                                'severity': 'Low',
                                'detail': 'CSRF protection not optimal'
                            })
                    
                    # Store findings
                    if issues:
                        security_label = 'Weak' if len(issues) >= 3 else 'Medium' if len(issues) >= 2 else 'Strong'
                        
                        self.findings['credentials_issues'].append({
                            'url': login_url,
                            'security_label': security_label,
                            'issues': issues
                        })
                        
                        for issue in issues:
                            self.vulnerabilities.append({
                                'type': 'Credential Security',
                                'severity': issue['severity'],
                                'description': f"{issue['issue']} at {login_url}",
                                'details': issue['detail'],
                                'recommendation': 'Implement proper credential and session security'
                            })
    
    # ==================== FEATURE 9: Report Generation ====================
    
    def generate_html_report(self, output_path='report.html'):
        """Generate HTML report"""
        risk_score = self.calculate_risk_score()
        risk_level = self.get_risk_level(risk_score)
        
        severity_counts = defaultdict(int)
        for vuln in self.vulnerabilities:
            severity_counts[vuln.get('severity', 'Low')] += 1
        
        html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Security Scan Report - {self.hostname}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }}
        .container {{ max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        h1 {{ color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }}
        h2 {{ color: #374151; margin-top: 30px; }}
        .risk-score {{ font-size: 48px; font-weight: bold; color: {risk_level['color']}; text-align: center; padding: 20px; background: #f9fafb; border-radius: 10px; margin: 20px 0; }}
        .stats {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }}
        .stat-card {{ padding: 20px; background: #f9fafb; border-radius: 10px; text-align: center; }}
        .stat-number {{ font-size: 32px; font-weight: bold; }}
        .critical {{ color: #dc2626; }}
        .high {{ color: #ea580c; }}
        .medium {{ color: #d97706; }}
        .low {{ color: #059669; }}
        .vulnerability {{ margin: 20px 0; padding: 20px; border-left: 4px solid #ddd; background: #f9fafb; border-radius: 5px; }}
        .vulnerability.Critical {{ border-left-color: #dc2626; }}
        .vulnerability.High {{ border-left-color: #ea580c; }}
        .vulnerability.Medium {{ border-left-color: #d97706; }}
        .vulnerability.Low {{ border-left-color: #059669; }}
        .tech-stack {{ display: flex; flex-wrap: wrap; gap: 10px; }}
        .tech-badge {{ padding: 5px 15px; background: #e0e7ff; color: #3730a3; border-radius: 20px; font-size: 14px; }}
        table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }}
        th {{ background: #f3f4f6; font-weight: bold; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 Security Scan Report</h1>
        <p><strong>Target:</strong> {self.url}</p>
        <p><strong>Scan Date:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        
        <div class="risk-score">
            {risk_level['icon']} Risk Score: {risk_score}/100
            <div style="font-size: 24px; margin-top: 10px;">Status: {risk_level['level']}</div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number critical">{severity_counts.get('Critical', 0)}</div>
                <div>Critical</div>
            </div>
            <div class="stat-card">
                <div class="stat-number high">{severity_counts.get('High', 0)}</div>
                <div>High</div>
            </div>
            <div class="stat-card">
                <div class="stat-number medium">{severity_counts.get('Medium', 0)}</div>
                <div>Medium</div>
            </div>
            <div class="stat-card">
                <div class="stat-number low">{severity_counts.get('Low', 0)}</div>
                <div>Low</div>
            </div>
        </div>
        
        <h2>🧬 Technology Stack</h2>
        <div class="tech-stack">
"""
        
        for tech in self.findings.get('tech_stack', []):
            html += f'<span class="tech-badge">{tech["name"]} ({tech["type"]})</span>'
        
        if not self.findings.get('tech_stack'):
            html += '<p>No specific technologies detected</p>'
        
        html += """
        </div>
        
        <h2>🐛 Vulnerabilities</h2>
"""
        
        for vuln in self.vulnerabilities:
            severity = vuln.get('severity', 'Low')
            html += f"""
        <div class="vulnerability {severity}">
            <h3>{vuln.get('type', 'Unknown')} <span class="{severity.lower()}">[{severity}]</span></h3>
            <p><strong>Description:</strong> {vuln.get('description', 'No description')}</p>
            <p><strong>Recommendation:</strong> {vuln.get('recommendation', 'No recommendation provided')}</p>
        </div>
"""
        
        if not self.vulnerabilities:
            html += '<p>No vulnerabilities detected!</p>'
        
        # CVE Matches
        if self.findings.get('cve_matches'):
            html += '<h2>📋 CVE Matches</h2><table><tr><th>Library/CMS</th><th>CVE</th><th>Severity</th><th>Description</th></tr>'
            for cve in self.findings['cve_matches']:
                html += f"""<tr>
                    <td>{cve.get('library', cve.get('cms', 'Unknown'))}</td>
                    <td><a href="{cve.get('reference', '#')}" target="_blank">{cve.get('cve', 'N/A')}</a></td>
                    <td class="{cve.get('severity', 'low').lower()}">{cve.get('severity', 'Unknown')}</td>
                    <td>{cve.get('description', 'No description')}</td>
                </tr>"""
            html += '</table>'
        
        # Forms
        if self.findings.get('forms'):
            html += f'<h2>📝 Forms Detected</h2><p>Found {len(self.findings["forms"])} forms on the website</p>'
        
        # Crawled pages
        if self.findings.get('crawled_pages'):
            html += f'<h2>🕸️ Crawled Pages</h2><p>Crawled {len(self.findings["crawled_pages"])} pages</p>'
        
        html += """
    </div>
</body>
</html>"""
        
        try:
            with open(output_path, 'w') as f:
                f.write(html)
            return output_path
        except Exception as e:
            return None
    
    def generate_pdf_report(self, output_path='report.pdf'):
        """Generate PDF report using reportlab"""
        if not PDF_AVAILABLE:
            return None
        
        try:
            doc = SimpleDocTemplate(output_path, pagesize=letter)
            story = []
            styles = getSampleStyleSheet()
            
            # Title
            title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], fontSize=24, textColor=colors.HexColor('#2563eb'))
            story.append(Paragraph(f"Security Scan Report", title_style))
            story.append(Spacer(1, 12))
            
            # Info
            story.append(Paragraph(f"<b>Target:</b> {self.url}", styles['Normal']))
            story.append(Paragraph(f"<b>Scan Date:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
            story.append(Spacer(1, 20))
            
            # Risk Score
            risk_score = self.calculate_risk_score()
            risk_level = self.get_risk_level(risk_score)
            story.append(Paragraph(f"<b>Risk Score: {risk_score}/100 - {risk_level['level']}</b>", styles['Heading2']))
            story.append(Spacer(1, 20))
            
            # Severity summary
            severity_counts = defaultdict(int)
            for vuln in self.vulnerabilities:
                severity_counts[vuln.get('severity', 'Low')] += 1
            
            data = [['Severity', 'Count']]
            for severity in ['Critical', 'High', 'Medium', 'Low']:
                data.append([severity, str(severity_counts.get(severity, 0))])
            
            table = Table(data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 14),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(table)
            story.append(Spacer(1, 20))
            
            # Vulnerabilities
            story.append(Paragraph("Vulnerabilities", styles['Heading2']))
            story.append(Spacer(1, 12))
            
            for vuln in self.vulnerabilities[:20]:  # Limit to 20 for PDF
                story.append(Paragraph(f"<b>{vuln.get('type', 'Unknown')} [{vuln.get('severity', 'Low')}]</b>", styles['Heading3']))
                story.append(Paragraph(f"<b>Description:</b> {vuln.get('description', 'No description')}", styles['Normal']))
                story.append(Paragraph(f"<b>Recommendation:</b> {vuln.get('recommendation', 'No recommendation')}", styles['Normal']))
                story.append(Spacer(1, 12))
            
            doc.build(story)
            return output_path
        except Exception as e:
            print(f"PDF generation error: {e}", file=sys.stderr)
            return None
    
    # ==================== Main Scan ====================
    
    def scan(self):
        """Execute comprehensive scan"""
        try:
            # Phase 1: Basic checks
            response = self.safe_request(self.url)
            if not response:
                return {
                    'url': self.url,
                    'status': 'Down',
                    'error': 'Unable to connect to target'
                }
            
            self.findings['headers'] = dict(response.headers)
            
            # Phase 2: Technology fingerprinting
            self.fingerprint_technologies()
            
            # Phase 3: Recursive crawling
            if self.config.get('recursive_crawl', False):
                self.recursive_crawl()
            
            # Phase 4: JavaScript library scanning
            self.scan_js_libraries()
            
            # Phase 5: Form discovery and fuzzing
            self.form_fuzzer()
            
            # Phase 6: Active exploit testing
            self.active_exploit_testing()
            
            # Phase 7: Credential security check
            self.check_credential_security()
            
            # Phase 8: Calculate risk score
            risk_score = self.calculate_risk_score()
            risk_level = self.get_risk_level(risk_score)
            
            # Generate reports if requested
            html_report = None
            pdf_report = None
            
            if self.config.get('generate_report', False):
                html_report = self.generate_html_report('reports/report.html')
                pdf_report = self.generate_pdf_report('reports/report.pdf')
            
            # Compile results
            result = {
                'url': self.url,
                'timestamp': datetime.now().isoformat(),
                'status': 'Up',
                'http_status': response.status_code,
                'risk_score': risk_score,
                'risk_level': risk_level,
                'vulnerabilities': self.vulnerabilities,
                'findings': self.findings,
                'severity_summary': {
                    'Critical': len([v for v in self.vulnerabilities if v.get('severity') == 'Critical']),
                    'High': len([v for v in self.vulnerabilities if v.get('severity') == 'High']),
                    'Medium': len([v for v in self.vulnerabilities if v.get('severity') == 'Medium']),
                    'Low': len([v for v in self.vulnerabilities if v.get('severity') == 'Low'])
                },
                'reports': {
                    'html': html_report,
                    'pdf': pdf_report
                },
                'statistics': {
                    'total_vulnerabilities': len(self.vulnerabilities),
                    'pages_crawled': len(self.findings.get('crawled_pages', [])),
                    'forms_found': len(self.findings.get('forms', [])),
                    'js_libraries_found': len(self.findings.get('js_libraries', [])),
                    'tech_stack_detected': len(self.findings.get('tech_stack', [])),
                    'cve_matches': len(self.findings.get('cve_matches', []))
                }
            }
            
            return result
            
        except Exception as e:
            return {
                'url': self.url,
                'status': 'Error',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'URL required'}))
        sys.exit(1)
    
    url = sys.argv[1]
    config = {}
    
    # Parse config if provided
    if len(sys.argv) > 2:
        try:
            config = json.loads(sys.argv[2])
        except:
            pass
    
    # Create reports directory
    os.makedirs('reports', exist_ok=True)
    
    # Run scan
    scanner = UltimateScanner(url, config)
    result = scanner.scan()
    
    # Output JSON
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
