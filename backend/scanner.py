import sys
import json
import requests
import ssl
import socket
from urllib.parse import urlparse
from datetime import datetime
import warnings

warnings.filterwarnings('ignore', message='Unverified HTTPS request')

def check_http_status(url):
    try:
        response = requests.get(url, timeout=10, allow_redirects=True, verify=False)
        return {
            'status': response.status_code,
            'redirects': len(response.history),
            'final_url': response.url
        }
    except requests.exceptions.RequestException as e:
        return {'status': None, 'error': str(e)}

def check_ssl_certificate(url):
    parsed = urlparse(url)
    hostname = parsed.hostname
    port = parsed.port or 443
    
    if parsed.scheme != 'https':
        return {'valid': False, 'reason': 'Not using HTTPS'}
    
    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, port), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                return {'valid': True, 'issuer': dict(x[0] for x in cert['issuer'])}
    except ssl.SSLError as e:
        return {'valid': False, 'reason': f'SSL Error: {str(e)}'}
    except Exception as e:
        return {'valid': False, 'reason': str(e)}

def check_security_headers(url):
    try:
        response = requests.get(url, timeout=10, verify=False)
        headers = response.headers
        
        security_headers = {
            'X-Frame-Options': headers.get('X-Frame-Options'),
            'X-Content-Type-Options': headers.get('X-Content-Type-Options'),
            'Strict-Transport-Security': headers.get('Strict-Transport-Security'),
            'Content-Security-Policy': headers.get('Content-Security-Policy'),
            'X-XSS-Protection': headers.get('X-XSS-Protection'),
        }
        
        missing = [name for name, value in security_headers.items() if value is None]
        return {'headers': security_headers, 'missing': missing}
    except Exception as e:
        return {'error': str(e)}

def scan_open_ports(url):
    parsed = urlparse(url)
    hostname = parsed.hostname
    common_ports = [21, 22, 80, 443, 3306, 8080]
    open_ports = []
    
    for port in common_ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            result = sock.connect_ex((hostname, port))
            if result == 0:
                open_ports.append(port)
            sock.close()
        except:
            pass
    
    return open_ports

def analyze_vulnerabilities(http_info, ssl_info, headers_info, open_ports):
    vulnerabilities = []
    
    if http_info.get('status') is None:
        vulnerabilities.append({
            'type': 'Website Down',
            'severity': 'High',
            'description': f"Website tidak dapat diakses: {http_info.get('error', 'Unknown error')}"
        })
        return vulnerabilities
    
    if http_info.get('status') != 200:
        vulnerabilities.append({
            'type': 'HTTP Status Issue',
            'severity': 'Medium',
            'description': f"HTTP status code: {http_info['status']}"
        })
    
    if http_info.get('redirects', 0) > 3:
        vulnerabilities.append({
            'type': 'Excessive Redirects',
            'severity': 'Low',
            'description': f"Website memiliki {http_info['redirects']} redirect chains"
        })
    
    if not ssl_info.get('valid'):
        vulnerabilities.append({
            'type': 'Invalid SSL Certificate',
            'severity': 'High',
            'description': f"SSL certificate tidak valid: {ssl_info.get('reason', 'Unknown')}"
        })
    
    missing_headers = headers_info.get('missing', [])
    if missing_headers:
        for header in missing_headers:
            severity = 'High' if header in ['Strict-Transport-Security', 'Content-Security-Policy'] else 'Medium'
            vulnerabilities.append({
                'type': f'Missing Security Header',
                'severity': severity,
                'description': f"Header keamanan '{header}' tidak ditemukan"
            })
    
    dangerous_ports = [port for port in open_ports if port in [21, 22, 3306]]
    if dangerous_ports:
        vulnerabilities.append({
            'type': 'Exposed Sensitive Ports',
            'severity': 'High',
            'description': f"Port sensitif terbuka: {', '.join(map(str, dangerous_ports))}"
        })
    
    return vulnerabilities

def scan_website(url):
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    print(f"Starting scan for: {url}", file=sys.stderr)
    
    http_info = check_http_status(url)
    ssl_info = check_ssl_certificate(url)
    headers_info = check_security_headers(url)
    open_ports = scan_open_ports(url)
    
    vulnerabilities = analyze_vulnerabilities(http_info, ssl_info, headers_info, open_ports)
    
    result = {
        'url': url,
        'timestamp': datetime.now().isoformat(),
        'status': 'Up' if http_info.get('status') is not None else 'Down',
        'http_status': http_info.get('status'),
        'vulnerabilities': vulnerabilities,
        'open_ports': open_ports
    }
    
    return result

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'URL parameter required'}))
        sys.exit(1)
    
    url = sys.argv[1]
    result = scan_website(url)
    print(json.dumps(result, indent=2))
