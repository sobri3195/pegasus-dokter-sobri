import sys
import json
import re
import requests
import dns.resolver
import socket
import ssl
import subprocess
from urllib.parse import urlparse, urljoin
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import warnings

warnings.filterwarnings('ignore', message='Unverified HTTPS request')

class AdvancedScanner:
    def __init__(self, url, config=None):
        self.url = url if url.startswith(('http://', 'https://')) else 'https://' + url
        self.parsed_url = urlparse(self.url)
        self.hostname = self.parsed_url.hostname
        self.config = config or {}
        self.signatures = self.load_signatures()
        self.vulnerabilities = []
        self.findings = {
            'subdomains': [],
            'directories': [],
            'open_ports': [],
            'headers': {},
            'cookies': {},
            'ssl_info': {},
            'tool_results': {}
        }
        
    def load_signatures(self):
        try:
            with open('data/vuln_signatures.json', 'r') as f:
                return json.load(f)
        except:
            return {}
    
    def calculate_risk_score(self):
        """Calculate risk score from 0-100 based on vulnerabilities"""
        score = 100
        severity_weights = {'Critical': 15, 'High': 10, 'Medium': 5, 'Low': 2}
        
        for vuln in self.vulnerabilities:
            severity = vuln.get('severity', 'Low')
            score -= severity_weights.get(severity, 2)
        
        return max(0, min(100, score))
    
    def get_risk_level(self, score):
        """Get risk level based on score"""
        if score >= 80:
            return {'level': 'Safe', 'color': 'green'}
        elif score >= 60:
            return {'level': 'Warning', 'color': 'orange'}
        else:
            return {'level': 'Danger', 'color': 'red'}
    
    def enumerate_subdomains(self):
        """Enumerate subdomains using DNS"""
        if not self.config.get('subdomain_enum', False):
            return []
        
        common_subdomains = ['www', 'mail', 'ftp', 'admin', 'blog', 'dev', 'test', 
                            'staging', 'api', 'portal', 'shop', 'store', 'm', 'mobile']
        found_subdomains = []
        
        for subdomain in common_subdomains:
            try:
                full_domain = f"{subdomain}.{self.hostname}"
                dns.resolver.resolve(full_domain, 'A')
                found_subdomains.append(full_domain)
            except:
                pass
        
        self.findings['subdomains'] = found_subdomains
        
        if found_subdomains:
            self.vulnerabilities.append({
                'type': 'Subdomain Discovery',
                'severity': 'Low',
                'description': f'Found {len(found_subdomains)} subdomains',
                'details': found_subdomains,
                'recommendation': 'Ensure all subdomains are properly secured and monitored'
            })
        
        return found_subdomains
    
    def enumerate_directories(self):
        """Enumerate common directories"""
        if not self.config.get('directory_enum', False):
            return []
        
        directories = self.signatures.get('common_directories', [])
        found_dirs = []
        
        for directory in directories:
            try:
                url = urljoin(self.url, directory)
                response = requests.get(url, timeout=5, verify=False, allow_redirects=False)
                if response.status_code in [200, 301, 302, 403]:
                    found_dirs.append({
                        'path': directory,
                        'status': response.status_code,
                        'risk': 'High' if response.status_code == 200 else 'Medium'
                    })
            except:
                pass
        
        self.findings['directories'] = found_dirs
        
        if found_dirs:
            high_risk = [d for d in found_dirs if d['risk'] == 'High']
            self.vulnerabilities.append({
                'type': 'Directory Enumeration',
                'severity': 'High' if high_risk else 'Medium',
                'description': f'Found {len(found_dirs)} accessible directories/paths',
                'details': found_dirs,
                'recommendation': 'Restrict access to sensitive directories and implement proper access controls'
            })
        
        return found_dirs
    
    def check_directory_listing(self):
        """Check for directory listing vulnerability"""
        try:
            response = requests.get(self.url, timeout=10, verify=False)
            content = response.text
            
            for pattern in self.signatures.get('directory_listing_indicators', []):
                if re.search(pattern, content, re.IGNORECASE):
                    self.vulnerabilities.append({
                        'type': 'Directory Listing Enabled',
                        'severity': 'Medium',
                        'description': 'Directory listing is enabled, exposing file structure',
                        'recommendation': 'Disable directory listing in server configuration'
                    })
                    return True
        except:
            pass
        return False
    
    def test_xss_vulnerability(self):
        """Test for XSS vulnerabilities (safe mode)"""
        if not self.config.get('xss_test', False):
            return
        
        try:
            response = requests.get(self.url, timeout=10, verify=False)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Check for input fields
            forms = soup.find_all('form')
            inputs = soup.find_all('input')
            
            if forms or inputs:
                # Safe test - just check if forms exist without actual injection
                self.vulnerabilities.append({
                    'type': 'Potential XSS Vector',
                    'severity': 'Medium',
                    'description': f'Found {len(forms)} forms and {len(inputs)} input fields that could be vulnerable to XSS',
                    'recommendation': 'Implement proper input validation and output encoding',
                    'verified': False
                })
            
            # Check for reflected parameters in URL
            if '?' in self.url:
                self.vulnerabilities.append({
                    'type': 'URL Parameter Reflection',
                    'severity': 'Medium',
                    'description': 'URL contains parameters that may be reflected in the page',
                    'recommendation': 'Validate and sanitize all URL parameters',
                    'verified': False
                })
        except:
            pass
    
    def test_sql_injection(self):
        """Test for SQL injection vulnerabilities (safe mode)"""
        if not self.config.get('sql_test', False):
            return
        
        try:
            # Safe test - check error messages without actual injection
            response = requests.get(self.url, timeout=10, verify=False)
            content = response.text
            
            for pattern in self.signatures.get('sql_injection_errors', []):
                if re.search(pattern, content, re.IGNORECASE):
                    self.vulnerabilities.append({
                        'type': 'Potential SQL Injection',
                        'severity': 'High',
                        'description': 'SQL error messages detected in response',
                        'recommendation': 'Use parameterized queries and proper error handling',
                        'verified': False
                    })
                    return
            
            # Check for database-related keywords in URL or forms
            if any(keyword in self.url.lower() for keyword in ['id=', 'userid=', 'product=', 'category=']):
                self.vulnerabilities.append({
                    'type': 'Potential SQL Injection Vector',
                    'severity': 'Medium',
                    'description': 'Found database-related URL parameters',
                    'recommendation': 'Implement parameterized queries and input validation',
                    'verified': False
                })
        except:
            pass
    
    def analyze_ssl_certificate(self):
        """Detailed SSL/TLS analysis"""
        if self.parsed_url.scheme != 'https':
            self.vulnerabilities.append({
                'type': 'No HTTPS',
                'severity': 'High',
                'description': 'Website is not using HTTPS encryption',
                'recommendation': 'Implement SSL/TLS certificate and redirect all traffic to HTTPS'
            })
            return
        
        try:
            context = ssl.create_default_context()
            with socket.create_connection((self.hostname, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=self.hostname) as ssock:
                    cert = ssock.getpeercert()
                    cipher = ssock.cipher()
                    version = ssock.version()
                    
                    # Parse certificate dates
                    not_after = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                    days_until_expiry = (not_after - datetime.now()).days
                    
                    self.findings['ssl_info'] = {
                        'issuer': dict(x[0] for x in cert['issuer']),
                        'subject': dict(x[0] for x in cert['subject']),
                        'version': version,
                        'cipher': cipher,
                        'expires': cert['notAfter'],
                        'days_until_expiry': days_until_expiry
                    }
                    
                    # Check for weak ciphers
                    if cipher[0] in ['RC4', 'DES', '3DES']:
                        self.vulnerabilities.append({
                            'type': 'Weak SSL Cipher',
                            'severity': 'High',
                            'description': f'Weak cipher suite detected: {cipher[0]}',
                            'recommendation': 'Update SSL/TLS configuration to use strong ciphers'
                        })
                    
                    # Check certificate expiry
                    if days_until_expiry < 30:
                        self.vulnerabilities.append({
                            'type': 'SSL Certificate Expiring Soon',
                            'severity': 'High' if days_until_expiry < 7 else 'Medium',
                            'description': f'Certificate expires in {days_until_expiry} days',
                            'recommendation': 'Renew SSL certificate before expiration'
                        })
                    
                    # Check for self-signed certificate
                    issuer = dict(x[0] for x in cert['issuer'])
                    subject = dict(x[0] for x in cert['subject'])
                    if issuer == subject:
                        self.vulnerabilities.append({
                            'type': 'Self-Signed Certificate',
                            'severity': 'Medium',
                            'description': 'Certificate is self-signed',
                            'recommendation': 'Use a certificate from a trusted CA'
                        })
        except ssl.SSLError as e:
            self.vulnerabilities.append({
                'type': 'SSL/TLS Error',
                'severity': 'High',
                'description': f'SSL error: {str(e)}',
                'recommendation': 'Fix SSL/TLS configuration issues'
            })
        except:
            pass
    
    def analyze_security_headers(self):
        """Detailed security headers analysis"""
        try:
            response = requests.get(self.url, timeout=10, verify=False)
            headers = response.headers
            
            self.findings['headers'] = dict(headers)
            
            # Define required security headers
            security_headers = {
                'X-Frame-Options': {
                    'severity': 'Medium',
                    'description': 'Protects against clickjacking attacks',
                    'recommendation': 'Set to DENY or SAMEORIGIN'
                },
                'X-Content-Type-Options': {
                    'severity': 'Medium',
                    'description': 'Prevents MIME type sniffing',
                    'recommendation': 'Set to nosniff'
                },
                'Strict-Transport-Security': {
                    'severity': 'High',
                    'description': 'Enforces HTTPS connections',
                    'recommendation': 'Set with max-age and includeSubDomains'
                },
                'Content-Security-Policy': {
                    'severity': 'High',
                    'description': 'Prevents XSS and injection attacks',
                    'recommendation': 'Implement a restrictive CSP policy'
                },
                'X-XSS-Protection': {
                    'severity': 'Low',
                    'description': 'Legacy XSS filter protection',
                    'recommendation': 'Set to 1; mode=block'
                },
                'Referrer-Policy': {
                    'severity': 'Low',
                    'description': 'Controls referrer information',
                    'recommendation': 'Set to no-referrer or strict-origin-when-cross-origin'
                },
                'Permissions-Policy': {
                    'severity': 'Low',
                    'description': 'Controls browser features and APIs',
                    'recommendation': 'Restrict unnecessary features'
                }
            }
            
            for header, info in security_headers.items():
                if header not in headers:
                    self.vulnerabilities.append({
                        'type': f'Missing Security Header: {header}',
                        'severity': info['severity'],
                        'description': info['description'],
                        'recommendation': info['recommendation']
                    })
            
            # Check for server version disclosure
            if 'Server' in headers:
                server_header = headers['Server']
                if any(version_pattern in server_header for version_pattern in ['/', 'Apache', 'nginx', 'IIS']):
                    self.vulnerabilities.append({
                        'type': 'Server Version Disclosure',
                        'severity': 'Low',
                        'description': f'Server version disclosed: {server_header}',
                        'recommendation': 'Remove version information from Server header'
                    })
        except:
            pass
    
    def analyze_cookies(self):
        """Analyze cookie security"""
        try:
            response = requests.get(self.url, timeout=10, verify=False)
            cookies = response.cookies
            
            if cookies:
                cookie_issues = []
                for cookie in cookies:
                    issues = []
                    if not cookie.secure:
                        issues.append('Missing Secure flag')
                    if not cookie.has_nonstandard_attr('HttpOnly'):
                        issues.append('Missing HttpOnly flag')
                    if not cookie.has_nonstandard_attr('SameSite'):
                        issues.append('Missing SameSite attribute')
                    
                    if issues:
                        cookie_issues.append({
                            'name': cookie.name,
                            'issues': issues
                        })
                
                if cookie_issues:
                    self.vulnerabilities.append({
                        'type': 'Insecure Cookie Configuration',
                        'severity': 'Medium',
                        'description': f'Found {len(cookie_issues)} cookies with security issues',
                        'details': cookie_issues,
                        'recommendation': 'Set Secure, HttpOnly, and SameSite flags on all cookies'
                    })
        except:
            pass
    
    def scan_ports(self):
        """Scan common ports"""
        if not self.config.get('port_scan', True):
            return
        
        common_ports = {
            21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP',
            80: 'HTTP', 443: 'HTTPS', 3306: 'MySQL', 5432: 'PostgreSQL',
            8080: 'HTTP-Alt', 8443: 'HTTPS-Alt', 27017: 'MongoDB', 6379: 'Redis'
        }
        
        open_ports = []
        for port, service in common_ports.items():
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(2)
                result = sock.connect_ex((self.hostname, port))
                if result == 0:
                    open_ports.append({'port': port, 'service': service})
                sock.close()
            except:
                pass
        
        self.findings['open_ports'] = open_ports
        
        # Check for dangerous open ports
        dangerous_ports = [21, 23, 3306, 5432, 27017, 6379]
        exposed = [p for p in open_ports if p['port'] in dangerous_ports]
        
        if exposed:
            self.vulnerabilities.append({
                'type': 'Exposed Sensitive Ports',
                'severity': 'Critical',
                'description': f'Sensitive ports are exposed: {", ".join([f"{p["port"]} ({p["service"]})" for p in exposed])}',
                'recommendation': 'Close or firewall sensitive ports. Use VPN or IP whitelisting for administrative access'
            })
    
    def run_external_tools(self):
        """Run external penetration testing tools"""
        if not self.config.get('use_external_tools', False):
            return
        
        # Run nmap
        try:
            result = subprocess.run(['nmap', '-F', self.hostname], 
                                  capture_output=True, text=True, timeout=30)
            if result.returncode == 0:
                self.findings['tool_results']['nmap'] = result.stdout
        except:
            pass
        
        # Run whatweb
        try:
            result = subprocess.run(['whatweb', '--color=never', self.url], 
                                  capture_output=True, text=True, timeout=30)
            if result.returncode == 0:
                self.findings['tool_results']['whatweb'] = result.stdout
        except:
            pass
        
        # Run sslscan
        if self.parsed_url.scheme == 'https':
            try:
                result = subprocess.run(['sslscan', '--no-colour', self.hostname], 
                                      capture_output=True, text=True, timeout=30)
                if result.returncode == 0:
                    self.findings['tool_results']['sslscan'] = result.stdout
            except:
                pass
    
    def ai_classify_vulnerabilities(self):
        """AI-assisted vulnerability classification and recommendations"""
        # Simple rule-based classification (can be enhanced with actual ML models)
        vuln_types = {
            'XSS': ['xss', 'script', 'injection', 'cross-site'],
            'SQLi': ['sql', 'injection', 'database'],
            'CSRF': ['csrf', 'cross-site request'],
            'RCE': ['command', 'execution', 'shell'],
            'Insecure Headers': ['header', 'csp', 'hsts', 'x-frame'],
            'SSL/TLS Issues': ['ssl', 'tls', 'certificate', 'cipher'],
            'Information Disclosure': ['disclosure', 'exposure', 'version', 'directory listing'],
            'Authentication': ['authentication', 'authorization', 'access control']
        }
        
        for vuln in self.vulnerabilities:
            vuln_desc = (vuln.get('type', '') + ' ' + vuln.get('description', '')).lower()
            
            # Classify
            classified = False
            for category, keywords in vuln_types.items():
                if any(keyword in vuln_desc for keyword in keywords):
                    vuln['category'] = category
                    classified = True
                    break
            
            if not classified:
                vuln['category'] = 'Other'
            
            # Add AI-generated recommendations (rule-based for now)
            if 'recommendation' not in vuln:
                vuln['recommendation'] = self.generate_recommendation(vuln['category'])
    
    def generate_recommendation(self, category):
        """Generate recommendations based on vulnerability category"""
        recommendations = {
            'XSS': 'Implement Content Security Policy, use output encoding, and validate all user inputs',
            'SQLi': 'Use parameterized queries, implement input validation, and apply least privilege principle',
            'CSRF': 'Implement CSRF tokens, use SameSite cookie attribute, and validate referer headers',
            'RCE': 'Sanitize all inputs, avoid executing user-supplied data, and implement sandboxing',
            'Insecure Headers': 'Configure security headers properly according to OWASP recommendations',
            'SSL/TLS Issues': 'Update SSL/TLS configuration, use strong ciphers, and renew certificates',
            'Information Disclosure': 'Remove version headers, disable directory listing, and implement proper error handling',
            'Authentication': 'Implement strong authentication mechanisms, use MFA, and enforce session management',
            'Other': 'Review security best practices and implement defense in depth'
        }
        return recommendations.get(category, 'Consult security experts for proper remediation')
    
    def perform_deep_scan(self):
        """Perform comprehensive vulnerability scan"""
        print(f"Starting deep scan for: {self.url}", file=sys.stderr)
        
        # Layer 3-4: Network layer
        if self.config.get('port_scan', True):
            self.scan_ports()
        
        # Layer 7: Application layer
        self.analyze_security_headers()
        self.analyze_cookies()
        self.analyze_ssl_certificate()
        
        # Application vulnerabilities
        if self.config.get('xss_test', False):
            self.test_xss_vulnerability()
        
        if self.config.get('sql_test', False):
            self.test_sql_injection()
        
        if self.config.get('directory_enum', False):
            self.check_directory_listing()
            self.enumerate_directories()
        
        if self.config.get('subdomain_enum', False):
            self.enumerate_subdomains()
        
        # External tools
        if self.config.get('use_external_tools', False):
            self.run_external_tools()
        
        # AI classification
        self.ai_classify_vulnerabilities()
        
        # Calculate risk score
        risk_score = self.calculate_risk_score()
        risk_level = self.get_risk_level(risk_score)
        
        return {
            'url': self.url,
            'timestamp': datetime.now().isoformat(),
            'scan_type': 'advanced' if self.config else 'basic',
            'status': 'completed',
            'risk_score': risk_score,
            'risk_level': risk_level,
            'vulnerabilities': self.vulnerabilities,
            'findings': self.findings,
            'summary': {
                'total_vulnerabilities': len(self.vulnerabilities),
                'critical': len([v for v in self.vulnerabilities if v.get('severity') == 'Critical']),
                'high': len([v for v in self.vulnerabilities if v.get('severity') == 'High']),
                'medium': len([v for v in self.vulnerabilities if v.get('severity') == 'Medium']),
                'low': len([v for v in self.vulnerabilities if v.get('severity') == 'Low']),
            }
        }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'URL parameter required'}))
        sys.exit(1)
    
    url = sys.argv[1]
    config = {}
    
    # Parse config if provided
    if len(sys.argv) > 2:
        try:
            config = json.loads(sys.argv[2])
        except:
            pass
    
    scanner = AdvancedScanner(url, config)
    result = scanner.perform_deep_scan()
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
