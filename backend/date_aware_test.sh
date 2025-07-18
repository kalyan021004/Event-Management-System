#!/bin/bash

BASE_URL="http://localhost:3000/api"
TOKEN="$1"  # Pass token as first argument

if [ -z "$TOKEN" ]; then
    echo "Usage: $0 <your_jwt_token>"
    exit 1
fi

# Generate future dates dynamically
NEXT_WEEK=$(date -u -d '+7 days' +%Y-%m-%d)
NEXT_MONTH=$(date -u -d '+30 days' +%Y-%m-%d)
NEXT_QUARTER=$(date -u -d '+90 days' +%Y-%m-%d)

echo "Creating events with dynamic future dates:"
echo "Next week: $NEXT_WEEK"
echo "Next month: $NEXT_MONTH"
echo "Next quarter: $NEXT_QUARTER"

# Create event for next week
curl -X POST "$BASE_URL/events" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Next Week Workshop\",
    \"description\": \"Workshop scheduled for next week\",
    \"date\": \"$NEXT_WEEK\",
    \"time\": \"14:00\",
    \"location\": \"Workshop Room\",
    \"capacity\": 30,
    \"category\": \"workshop\",
    \"price\": 25
  }"

# Create event for next month
curl -X POST "$BASE_URL/events" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Monthly Conference\",
    \"description\": \"Monthly tech conference\",
    \"date\": \"$NEXT_MONTH\",
    \"time\": \"09:00\",
    \"location\": \"Conference Center\",
    \"capacity\": 100,
    \"category\": \"conference\",
    \"price\": 50
  }"

echo "Events created successfully with future dates!"
