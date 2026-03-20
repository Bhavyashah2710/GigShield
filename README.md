# GigShield - AI-Powered Parametric Income Insurance for India's Food Delivery Workers

## Project Overview

GigShield is a comprehensive mobile-first insurance platform designed exclusively for food delivery partners on Zomato and Swiggy. This standalone version includes complete source code for all components: Frontend (React), Backend (Node.js), AI Engine (Python Flask), and Java utilities.

## Project Structure

```
GigShield-Standalone/
├── frontend/                 # React + HTML + CSS + JavaScript
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.js
│   ├── package.json
│   └── README.md
├── backend/                  # Node.js + Express
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── controllers/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── README.md
├── ai-engine/               # Python Flask
│   ├── app.py
│   ├── risk_scorer.py
│   ├── fraud_detector.py
│   ├── requirements.txt
│   └── README.md
├── java-utils/              # Java Components
│   ├── src/
│   │   └── main/java/
│   ├── pom.xml
│   └── README.md
├── docs/                    # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── SETUP_GUIDE.md
│   ├── DATABASE_SCHEMA.md
│   └── ARCHITECTURE.md
└── README.md
```

## Features

### 1. User Onboarding & Authentication
- First-time user registration with Name, Age, PAN Card verification, Delivery ID, and Zone selection
- Username/password authentication for returning users
- Session management and JWT tokens
- Direct dashboard access after login (skipping plan selection for existing users)

### 2. Insurance Plans
- **Bronze Plan**: ₹59/week - Rain + Temperature coverage, ₹150 max weekly payout
- **Silver Plan**: ₹89/week - Rain + Temperature + AQI + Strike coverage, ₹250 max weekly payout
- **Gold Plan**: ₹118/week - All parameters (Rain + Temp + AQI + Traffic + Strike), ₹400 max weekly payout

### 3. Risk Score Engine
- Real-time calculation using plan-specific weighted formulas
- Environmental data integration (Weather, AQI, Traffic, Strike/Curfew)
- Zone-based scoring system
- Dynamic risk assessment

### 4. Payout System
- Automated payout trigger based on risk score thresholds
- Payout levels: No Payout (0-40), Small (40-60), Medium (60-80), Full (80-100)
- 3-week lock-in period from activation
- Maximum 1 payout per week, 3 payouts per month
- Fraud detection and verification workflow

### 5. Dashboard & History
- Live risk score display with visual indicators
- Current plan status and coverage details
- Zone status with environmental conditions
- Claim history with past payouts
- Pending insurance status with fraud detection scores

## Technology Stack

### Frontend
- **React 18+** - UI framework
- **HTML5** - Markup
- **CSS3** - Styling with responsive design
- **JavaScript (ES6+)** - Logic and interactivity
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **MySQL/SQLite** - Database
- **JWT** - Authentication
- **Sequelize/Knex** - ORM

### AI Engine
- **Python 3.8+** - Programming language
- **Flask** - Web framework
- **NumPy/Pandas** - Data processing
- **Scikit-learn** - ML models (optional)
- **Requests** - HTTP client

### Java Components
- **Java 11+** - Programming language
- **Maven** - Build tool
- **Jackson** - JSON processing
- **OkHttp** - HTTP client

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- Java 11+ and Maven
- MySQL 8.0+ or SQLite 3
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GigShield-Standalone
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on `http://localhost:3000`

3. **Setup Backend**
   ```bash
   cd ../backend
   npm install
   npm start
   ```
   Backend API runs on `http://localhost:5000`

4. **Setup AI Engine**
   ```bash
   cd ../ai-engine
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```
   AI Engine runs on `http://localhost:5001`

5. **Setup Java Utils (Optional)**
   ```bash
   cd ../java-utils
   mvn clean install
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Plans
- `GET /api/plans` - List all plans
- `POST /api/plans/subscribe` - Subscribe to a plan
- `GET /api/plans/active` - Get active subscription

### Risk Scoring
- `GET /api/risk-score/:zone` - Calculate risk score for zone
- `GET /api/zones/status` - Get zone environmental status

### Claims
- `POST /api/claims/trigger` - Trigger payout claim
- `GET /api/claims/history` - Get claim history
- `GET /api/claims/pending` - Get pending claims

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/onboarding` - Complete onboarding

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fullName VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  panCard VARCHAR(20) UNIQUE NOT NULL,
  panVerified BOOLEAN DEFAULT FALSE,
  deliveryPlatform ENUM('swiggy', 'zomato') NOT NULL,
  deliveryUniqueId VARCHAR(100) UNIQUE NOT NULL,
  workingZones JSON NOT NULL,
  email VARCHAR(320),
  passwordHash VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Plans Table
```sql
CREATE TABLE plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name ENUM('bronze', 'silver', 'gold') UNIQUE NOT NULL,
  weeklyPrice DECIMAL(10, 2) NOT NULL,
  maxWeeklyPayout INT NOT NULL,
  rainCoverage BOOLEAN DEFAULT TRUE,
  temperatureCoverage BOOLEAN DEFAULT TRUE,
  pollutionCoverage BOOLEAN DEFAULT FALSE,
  trafficCoverage BOOLEAN DEFAULT FALSE,
  strikeCoverage BOOLEAN DEFAULT FALSE,
  riskScoreWeights JSON NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Subscriptions Table
```sql
CREATE TABLE userSubscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  planId INT NOT NULL,
  status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
  activatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  renewalDate TIMESTAMP NOT NULL,
  lockInEndDate TIMESTAMP NOT NULL,
  payoutsThisWeek INT DEFAULT 0,
  payoutsThisMonth INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (planId) REFERENCES plans(id)
);
```

### Claims Table
```sql
CREATE TABLE claims (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  subscriptionId INT NOT NULL,
  riskScore DECIMAL(5, 2) NOT NULL,
  payoutLevel ENUM('none', 'small', 'medium', 'full') NOT NULL,
  payoutAmount DECIMAL(10, 2) NOT NULL,
  claimedZone VARCHAR(100) NOT NULL,
  weatherData JSON NOT NULL,
  aqi INT,
  trafficLevel INT,
  strikeActive BOOLEAN DEFAULT FALSE,
  status ENUM('pending', 'approved', 'rejected', 'paid') DEFAULT 'pending',
  fraudConfidenceScore DECIMAL(5, 2) DEFAULT 0,
  fraudFlags JSON,
  claimDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approvalDate TIMESTAMP,
  paidDate TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (subscriptionId) REFERENCES userSubscriptions(id)
);
```

## Risk Score Calculation

### Bronze Plan Formula
```
RiskScore = (0.60 × RainScore) + (0.40 × TemperatureScore)
```

### Silver Plan Formula
```
RiskScore = (0.375 × RainScore) + (0.250 × TemperatureScore) + (0.250 × PollutionScore) + (0.125 × StrikeScore)
```

### Gold Plan Formula
```
RiskScore = (0.30 × RainScore) + (0.20 × TemperatureScore) + (0.20 × PollutionScore) + (0.20 × TrafficScore) + (0.10 × StrikeScore)
```

### Payout Thresholds
- **0-40**: No Payout
- **40-60**: Small Payout (33% of max)
- **60-80**: Medium Payout (66% of max)
- **80-100**: Full Payout (100% of max)

## Fraud Detection System

The platform implements a multi-layer fraud detection system:

1. **GPS Verification** - Validates device location
2. **Platform Activity Verification** - Checks delivery activity on Swiggy/Zomato
3. **IP Geolocation Matching** - Verifies IP address matches claimed zone
4. **WiFi Environment Mapping** - Checks nearby WiFi networks
5. **Device Integrity Check** - Detects rooted/jailbroken devices
6. **Coordinated Fraud Detection** - Identifies suspicious claim patterns

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

### AI Engine Tests
```bash
cd ai-engine
pytest
```

## Deployment

### Frontend Deployment
- Build: `npm run build`
- Deploy to Netlify, Vercel, or AWS S3 + CloudFront

### Backend Deployment
- Deploy to Heroku, AWS EC2, or DigitalOcean
- Set environment variables for database and API keys

### AI Engine Deployment
- Deploy to AWS Lambda, Google Cloud Run, or Heroku
- Ensure Python dependencies are installed

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=5000
DATABASE_URL=mysql://user:password@localhost:3306/gigshield
JWT_SECRET=your_jwt_secret_key
AI_ENGINE_URL=http://localhost:5001
```

### AI Engine (.env)
```
FLASK_ENV=production
FLASK_DEBUG=False
PORT=5001
OPENWEATHER_API_KEY=your_api_key
WAQI_API_KEY=your_api_key
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@gigshield.com or open an issue in the repository.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced ML fraud detection
- [ ] Integration with Razorpay for real payouts
- [ ] SMS/Email notifications
- [ ] Multi-language support
- [ ] Analytics dashboard for admins
- [ ] Referral program implementation
- [ ] Smart wallet feature

---

**GigShield - Because when the rain stops them from working, the bills don't stop coming.**
