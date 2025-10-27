#!/bin/bash

###############################################################################
# Example Scan Script
# This script demonstrates how to use the npm run scan commands
###############################################################################

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}Admin Panel Scanner - Demo${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# Check if URL is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: ./example_scan.sh <URL>${NC}"
    echo ""
    echo "Examples:"
    echo "  ./example_scan.sh https://example.com"
    echo "  ./example_scan.sh https://testphp.vulnweb.com"
    echo ""
    exit 1
fi

URL="$1"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="example_scans"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${GREEN}Target URL: ${NC}$URL"
echo -e "${GREEN}Timestamp: ${NC}$TIMESTAMP"
echo ""

# Basic Scan
echo -e "${BLUE}[1/3] Running Basic Scan...${NC}"
npm run scan "$URL" > "$OUTPUT_DIR/basic_${TIMESTAMP}.json" 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Basic scan completed${NC}"
    echo -e "  Results saved to: $OUTPUT_DIR/basic_${TIMESTAMP}.json"
else
    echo -e "${RED}✗ Basic scan failed${NC}"
fi
echo ""

# Show summary
if [ -f "$OUTPUT_DIR/basic_${TIMESTAMP}.json" ]; then
    echo -e "${YELLOW}Basic Scan Summary:${NC}"
    
    # Extract key information (requires jq)
    if command -v jq &> /dev/null; then
        STATUS=$(jq -r '.status' "$OUTPUT_DIR/basic_${TIMESTAMP}.json" 2>/dev/null)
        HTTP_STATUS=$(jq -r '.http_status' "$OUTPUT_DIR/basic_${TIMESTAMP}.json" 2>/dev/null)
        VULN_COUNT=$(jq '.vulnerabilities | length' "$OUTPUT_DIR/basic_${TIMESTAMP}.json" 2>/dev/null)
        PORTS=$(jq -r '.open_ports | join(", ")' "$OUTPUT_DIR/basic_${TIMESTAMP}.json" 2>/dev/null)
        
        echo -e "  Status: ${GREEN}$STATUS${NC}"
        echo -e "  HTTP Status: $HTTP_STATUS"
        echo -e "  Vulnerabilities Found: ${RED}$VULN_COUNT${NC}"
        echo -e "  Open Ports: $PORTS"
    else
        echo -e "  ${YELLOW}Install 'jq' to see detailed summary${NC}"
        echo -e "  Run: sudo apt install jq"
    fi
    echo ""
fi

echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}Scan completed!${NC}"
echo ""
echo "Next steps:"
echo "  1. View results: cat $OUTPUT_DIR/basic_${TIMESTAMP}.json | jq ."
echo "  2. Run advanced scan: npm run scan:advanced $URL"
echo "  3. Run ultimate scan: npm run scan:ultimate $URL"
echo "  4. Start full application: npm start"
echo ""
