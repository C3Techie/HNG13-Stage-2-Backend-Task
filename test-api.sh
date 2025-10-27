#!/bin/bash

# API Test Script
# Usage: ./test-api.sh [base_url]
# Example: ./test-api.sh http://localhost:3000

BASE_URL="${1:-http://localhost:3000}"

echo "🧪 Testing API at: $BASE_URL"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Root endpoint
echo -e "\n${YELLOW}1. Testing root endpoint${NC}"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/)
http_code=$(echo "$response" | tail -n 1)
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Passed${NC}"
else
    echo -e "${RED}✗ Failed (HTTP $http_code)${NC}"
fi

# Test 2: Status endpoint (before refresh)
echo -e "\n${YELLOW}2. Testing status endpoint (before refresh)${NC}"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/status)
http_code=$(echo "$response" | tail -n 1)
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Passed${NC}"
    echo "$response" | head -n -1
else
    echo -e "${RED}✗ Failed (HTTP $http_code)${NC}"
fi

# Test 3: Refresh countries (this takes time)
echo -e "\n${YELLOW}3. Refreshing countries data (this may take 10-30 seconds)${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/countries/refresh)
http_code=$(echo "$response" | tail -n 1)
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Passed${NC}"
    echo "$response" | head -n -1
else
    echo -e "${RED}✗ Failed (HTTP $http_code)${NC}"
    echo "$response" | head -n -1
fi

# Test 4: Get all countries
echo -e "\n${YELLOW}4. Getting all countries${NC}"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/countries)
http_code=$(echo "$response" | tail -n 1)
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Passed${NC}"
    echo "First 2 countries:"
    echo "$response" | head -n -1 | jq '.[0:2]' 2>/dev/null || echo "Install jq for pretty output"
else
    echo -e "${RED}✗ Failed (HTTP $http_code)${NC}"
fi

# Test 5: Filter by region
echo -e "\n${YELLOW}5. Filtering by region (Africa)${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/countries?region=Africa")
http_code=$(echo "$response" | tail -n 1)
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Passed${NC}"
    count=$(echo "$response" | head -n -1 | jq 'length' 2>/dev/null || echo "?")
    echo "Found $count African countries"
else
    echo -e "${RED}✗ Failed (HTTP $http_code)${NC}"
fi

# Test 6: Sort by GDP
echo -e "\n${YELLOW}6. Sorting by GDP (descending)${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/countries?sort=gdp_desc")
http_code=$(echo "$response" | tail -n 1)
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Passed${NC}"
    echo "Top 3 countries by GDP:"
    echo "$response" | head -n -1 | jq '.[0:3] | .[] | {name, estimated_gdp}' 2>/dev/null || echo "Install jq for pretty output"
else
    echo -e "${RED}✗ Failed (HTTP $http_code)${NC}"
fi

# Test 7: Get specific country
echo -e "\n${YELLOW}7. Getting specific country (Nigeria)${NC}"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/countries/Nigeria)
http_code=$(echo "$response" | tail -n 1)
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Passed${NC}"
    echo "$response" | head -n -1 | jq '{name, capital, population, currency_code}' 2>/dev/null || echo "$response" | head -n -1
else
    echo -e "${RED}✗ Failed (HTTP $http_code)${NC}"
fi

# Test 8: Status after refresh
echo -e "\n${YELLOW}8. Testing status endpoint (after refresh)${NC}"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/status)
http_code=$(echo "$response" | tail -n 1)
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Passed${NC}"
    echo "$response" | head -n -1
else
    echo -e "${RED}✗ Failed (HTTP $http_code)${NC}"
fi

# Test 9: Get summary image
echo -e "\n${YELLOW}9. Getting summary image${NC}"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/countries/image -o test-summary.png)
http_code=$(echo "$response")
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Passed${NC}"
    echo "Image saved as test-summary.png"
else
    echo -e "${RED}✗ Failed (HTTP $http_code)${NC}"
fi

# Test 10: 404 Error handling
echo -e "\n${YELLOW}10. Testing 404 error (non-existent country)${NC}"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/countries/NonExistentCountry123)
http_code=$(echo "$response" | tail -n 1)
if [ "$http_code" -eq 404 ]; then
    echo -e "${GREEN}✓ Passed${NC}"
    echo "$response" | head -n -1
else
    echo -e "${RED}✗ Failed (expected 404, got $http_code)${NC}"
fi

echo -e "\n================================"
echo -e "${GREEN}🎉 Testing complete!${NC}"
echo -e "\nIf all tests passed, your API is working correctly!"
echo -e "Next step: Deploy and submit your project 🚀"
