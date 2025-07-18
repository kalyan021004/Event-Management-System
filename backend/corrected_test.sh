#!/bin/bash
BASE_URL="http://localhost:3000/api"

echo "Ì∫Ä Starting Corrected API Tests..."

# Test 1: Health Check
echo "1. Testing health check..."
curl -s -X GET "$BASE_URL/health" | echo
# Test 2: User Registration
echo "2. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "futureuser",
    "email": "future@example.com",
    "password": "FuturePass123",
    "firstName": "Future",
    "lastName": "User"
  }')
echo "Register Response: $REGISTER_RESPONSE"

# Extract token
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Extracted Token: $TOKEN"

if [ -z "$TOKEN" ]; then
    echo "‚ùå Failed to get token. Trying to login existing user..."
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "future@example.com",
        "password": "FuturePass123"
      }')
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "Login Token: $TOKEN"
fi

# Test 3: Create Event with Future Date
echo "3. Testing event creation with future date..."
EVENT_RESPONSE=$(curl -s -X POST "$BASE_URL/events" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Future Test Event",
    "description": "This is a test event with a future date",
    "date": "2025-08-25",
    "time": "15:00",
    "location": "Test Location",
    "capacity": 50,
    "category": "workshop",
    "price": 0
  }')
echo "Event Response: $EVENT_RESPONSE"

# Test 4: Get Events
echo "4. Testing get events..."
EVENTS_RESPONSE=$(curl -s -X GET "$BASE_URL/events")
echo "Events Response: $EVENTS_RESPONSE"

echo "‚úÖ Corrected API Tests Completed!"
