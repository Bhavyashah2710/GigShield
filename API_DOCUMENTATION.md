# GigShield API Documentation

## Base URLs

- **Backend API**: `http://localhost:5000`
- **AI Engine**: `http://localhost:5001`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All responses are in JSON format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Register a new delivery partner account.

**Request Body:**
```json
{
  "fullName": "Rajan Kumar",
  "age": 28,
  "panCard": "ABCDE1234F",
  "email": "rajan@example.com",
  "password": "securepassword",
  "deliveryPlatform": "swiggy",
  "deliveryUniqueId": "SWIGGY_12345",
  "workingZones": ["Andheri", "Bandra"]
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "fullName": "Rajan Kumar",
    "email": "rajan@example.com",
    "onboardingComplete": false,
    "activeSubscription": null
  }
}
```

### Login
**POST** `/api/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "rajan@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "fullName": "Rajan Kumar",
    "email": "rajan@example.com",
    "onboardingComplete": true,
    "activeSubscription": {
      "planId": 1,
      "status": "active"
    }
  }
}
```

### Get Current User
**GET** `/api/auth/me`

Get authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "fullName": "Rajan Kumar",
  "age": 28,
  "panCard": "ABCDE1234F",
  "panVerified": true,
  "deliveryPlatform": "swiggy",
  "deliveryUniqueId": "SWIGGY_12345",
  "workingZones": ["Andheri", "Bandra"],
  "email": "rajan@example.com",
  "onboardingComplete": true,
  "activeSubscription": {
    "planId": 1,
    "status": "active"
  }
}
```

---

## User Endpoints

### Complete Onboarding
**POST** `/api/user/onboarding`

Complete user onboarding with delivery partner details.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "Rajan Kumar",
  "age": 28,
  "panCard": "ABCDE1234F",
  "deliveryPlatform": "swiggy",
  "deliveryUniqueId": "SWIGGY_12345",
  "workingZones": ["Andheri", "Bandra", "Kurla"]
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "fullName": "Rajan Kumar",
    "onboardingComplete": true
  }
}
```

### Get User Profile
**GET** `/api/user/profile`

Get current user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "fullName": "Rajan Kumar",
  "age": 28,
  "panCard": "ABCDE1234F",
  "panVerified": true,
  "deliveryPlatform": "swiggy",
  "deliveryUniqueId": "SWIGGY_12345",
  "workingZones": ["Andheri", "Bandra"],
  "email": "rajan@example.com",
  "createdAt": "2024-03-20T08:00:00Z"
}
```

---

## Plans Endpoints

### List All Plans
**GET** `/api/plans`

Get all available insurance plans.

**Response:**
```json
[
  {
    "id": 1,
    "name": "bronze",
    "weeklyPrice": 59,
    "maxWeeklyPayout": 150,
    "rainCoverage": true,
    "temperatureCoverage": true,
    "pollutionCoverage": false,
    "trafficCoverage": false,
    "strikeCoverage": false,
    "riskScoreWeights": {
      "rain": 0.60,
      "temperature": 0.40,
      "pollution": 0,
      "traffic": 0,
      "strike": 0
    }
  },
  {
    "id": 2,
    "name": "silver",
    "weeklyPrice": 89,
    "maxWeeklyPayout": 250,
    "rainCoverage": true,
    "temperatureCoverage": true,
    "pollutionCoverage": true,
    "trafficCoverage": false,
    "strikeCoverage": true,
    "riskScoreWeights": {
      "rain": 0.375,
      "temperature": 0.250,
      "pollution": 0.250,
      "traffic": 0,
      "strike": 0.125
    }
  },
  {
    "id": 3,
    "name": "gold",
    "weeklyPrice": 118,
    "maxWeeklyPayout": 400,
    "rainCoverage": true,
    "temperatureCoverage": true,
    "pollutionCoverage": true,
    "trafficCoverage": true,
    "strikeCoverage": true,
    "riskScoreWeights": {
      "rain": 0.30,
      "temperature": 0.20,
      "pollution": 0.20,
      "traffic": 0.20,
      "strike": 0.10
    }
  }
]
```

### Subscribe to Plan
**POST** `/api/plans/subscribe`

Subscribe user to a plan.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "planId": 1
}
```

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": 1,
    "userId": 1,
    "planId": 1,
    "status": "active",
    "activatedAt": "2024-03-20T08:00:00Z",
    "renewalDate": "2024-03-27T08:00:00Z",
    "lockInEndDate": "2024-04-10T08:00:00Z",
    "payoutsThisWeek": 0,
    "payoutsThisMonth": 0
  }
}
```

### Get Active Subscription
**GET** `/api/plans/active`

Get user's active subscription details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "plan": {
    "id": 1,
    "name": "bronze",
    "weeklyPrice": 59,
    "maxWeeklyPayout": 150
  },
  "subscription": {
    "id": 1,
    "userId": 1,
    "planId": 1,
    "status": "active",
    "activatedAt": "2024-03-20T08:00:00Z",
    "renewalDate": "2024-03-27T08:00:00Z",
    "lockInEndDate": "2024-04-10T08:00:00Z",
    "payoutsThisWeek": 0,
    "payoutsThisMonth": 0
  }
}
```

---

## Zones Endpoints

### List All Zones
**GET** `/api/zones`

Get all available working zones.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Andheri",
    "city": "Mumbai",
    "latitude": 19.1136,
    "longitude": 72.8697,
    "rainfall": 5,
    "temperature": 32,
    "aqi": 120,
    "trafficCongestion": 45,
    "strikeActive": false
  }
]
```

### Get Zone Status
**GET** `/api/zones/status?zones=Andheri,Bandra`

Get environmental status for specific zones.

**Query Parameters:**
- `zones` (optional): Comma-separated zone names

**Response:**
```json
[
  {
    "id": 1,
    "name": "Andheri",
    "rainfall": 5,
    "temperature": 32,
    "aqi": 120,
    "trafficCongestion": 45,
    "strikeActive": false
  }
]
```

---

## Risk Score Endpoints

### Calculate Risk Score
**GET** `/api/risk-score/:zone`

Calculate risk score for a specific zone.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `zone`: Zone name (e.g., "Andheri")

**Response:**
```json
{
  "riskScore": 45.5,
  "breakdown": {
    "rainScore": 40,
    "tempScore": 50,
    "aqiScore": 50,
    "trafficScore": 30,
    "strikeScore": 0
  },
  "zone": {
    "id": 1,
    "name": "Andheri",
    "rainfall": 5,
    "temperature": 32,
    "aqi": 120,
    "trafficCongestion": 45,
    "strikeActive": false
  }
}
```

---

## Claims Endpoints

### Trigger Payout Claim
**POST** `/api/claims/trigger`

Trigger a payout claim for a zone.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "zone": "Andheri"
}
```

**Response:**
```json
{
  "success": true,
  "claim": {
    "id": 1,
    "userId": 1,
    "subscriptionId": 1,
    "riskScore": 75.5,
    "payoutLevel": "medium",
    "payoutAmount": 166.5,
    "claimedZone": "Andheri",
    "status": "approved",
    "fraudConfidenceScore": 0.1,
    "claimDate": "2024-03-20T08:00:00Z",
    "approvalDate": "2024-03-20T08:05:00Z",
    "paidDate": "2024-03-20T08:10:00Z"
  }
}
```

### Get Claim History
**GET** `/api/claims/history`

Get all past claims for the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "riskScore": 75.5,
    "payoutLevel": "medium",
    "payoutAmount": 166.5,
    "claimedZone": "Andheri",
    "status": "paid",
    "claimDate": "2024-03-20T08:00:00Z"
  }
]
```

### Get Pending Claims
**GET** `/api/claims/pending`

Get all pending claims under verification.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 2,
    "userId": 1,
    "riskScore": 65.2,
    "payoutLevel": "medium",
    "payoutAmount": 166.5,
    "claimedZone": "Bandra",
    "status": "pending",
    "fraudConfidenceScore": 0.15,
    "claimDate": "2024-03-20T09:00:00Z"
  }
]
```

---

## AI Engine Endpoints

### Calculate Risk Score (AI Engine)
**POST** `/api/risk-score/calculate`

Calculate risk score using the AI engine.

**Request Body:**
```json
{
  "plan_type": "bronze",
  "rainfall": 10,
  "temperature": 32,
  "aqi": 120,
  "traffic_congestion": 45,
  "strike_active": false
}
```

**Response:**
```json
{
  "risk_score": 45.5,
  "breakdown": {
    "rain_score": 40,
    "temperature_score": 50,
    "aqi_score": 50,
    "traffic_score": 30,
    "strike_score": 0
  }
}
```

### Calculate Fraud Score
**POST** `/api/fraud-detection/score`

Calculate fraud confidence score for a claim.

**Request Body:**
```json
{
  "gps_verified": true,
  "platform_activity_verified": true,
  "ip_geolocation_match": true,
  "wifi_environment_match": true,
  "device_integrity_check": true,
  "claims_in_24h": 1
}
```

**Response:**
```json
{
  "fraud_score": 0.1,
  "fraud_flags": [],
  "risk_level": "low"
}
```

### Determine Payout Level
**POST** `/api/payout-level`

Determine payout level based on risk score.

**Request Body:**
```json
{
  "risk_score": 75,
  "max_weekly_payout": 250
}
```

**Response:**
```json
{
  "risk_score": 75,
  "payout_level": "medium",
  "payout_amount": 166.5,
  "max_weekly_payout": 250
}
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 400 | Bad Request | Missing or invalid parameters |
| 401 | Unauthorized | Invalid or missing authentication token |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

Currently, there are no rate limits. In production, implement:
- 100 requests per minute per user
- 1000 requests per minute per IP

---

## Webhooks (Future)

Webhooks will be available for:
- Claim approved
- Claim rejected
- Payout processed
- Subscription renewed

---

## SDK Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

// Login
const loginResponse = await api.post('/api/auth/login', {
  email: 'rajan@example.com',
  password: 'password'
});

const token = loginResponse.data.token;

// Set token for future requests
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Get risk score
const riskScore = await api.get('/api/risk-score/Andheri');
console.log(riskScore.data);
```

### Python

```python
import requests

API_URL = 'http://localhost:5000'

# Login
response = requests.post(f'{API_URL}/api/auth/login', json={
    'email': 'rajan@example.com',
    'password': 'password'
})

token = response.json()['token']

# Get risk score
headers = {'Authorization': f'Bearer {token}'}
response = requests.get(f'{API_URL}/api/risk-score/Andheri', headers=headers)
print(response.json())
```

### Java

```java
import okhttp3.*;

public class GigShieldClient {
    private static final String API_URL = "http://localhost:5000";
    private OkHttpClient client = new OkHttpClient();
    private String token;

    public void login(String email, String password) throws Exception {
        String json = String.format(
            "{\"email\":\"%s\",\"password\":\"%s\"}",
            email, password
        );
        
        RequestBody body = RequestBody.create(json, MediaType.get("application/json"));
        Request request = new Request.Builder()
            .url(API_URL + "/api/auth/login")
            .post(body)
            .build();

        Response response = client.newCall(request).execute();
        // Parse response and extract token
    }
}
```

---

## Version History

- **v1.0.0** (2024-03-20): Initial API release

---

## Support

For API support, contact: api-support@gigshield.com
