const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock Database
const mockDatabase = {
  users: [
    {
      id: 1,
      fullName: 'Rajan Kumar',
      age: 28,
      panCard: 'ABCDE1234F',
      panVerified: true,
      deliveryPlatform: 'swiggy',
      deliveryUniqueId: 'SWIGGY_12345',
      workingZones: ['Andheri', 'Bandra'],
      email: 'rajan@example.com',
      passwordHash: 'hashed_password',
      onboardingComplete: true,
      activeSubscription: { planId: 1, status: 'active' },
      createdAt: new Date()
    }
  ],
  plans: [
    {
      id: 1,
      name: 'bronze',
      weeklyPrice: 59,
      maxWeeklyPayout: 150,
      rainCoverage: true,
      temperatureCoverage: true,
      pollutionCoverage: false,
      trafficCoverage: false,
      strikeCoverage: false,
      riskScoreWeights: { rain: 0.60, temperature: 0.40, pollution: 0, traffic: 0, strike: 0 }
    },
    {
      id: 2,
      name: 'silver',
      weeklyPrice: 89,
      maxWeeklyPayout: 250,
      rainCoverage: true,
      temperatureCoverage: true,
      pollutionCoverage: true,
      trafficCoverage: false,
      strikeCoverage: true,
      riskScoreWeights: { rain: 0.375, temperature: 0.250, pollution: 0.250, traffic: 0, strike: 0.125 }
    },
    {
      id: 3,
      name: 'gold',
      weeklyPrice: 118,
      maxWeeklyPayout: 400,
      rainCoverage: true,
      temperatureCoverage: true,
      pollutionCoverage: true,
      trafficCoverage: true,
      strikeCoverage: true,
      riskScoreWeights: { rain: 0.30, temperature: 0.20, pollution: 0.20, traffic: 0.20, strike: 0.10 }
    }
  ],
  zones: [
    {
      id: 1,
      name: 'Andheri',
      city: 'Mumbai',
      rainfall: 5,
      temperature: 32,
      aqi: 120,
      trafficCongestion: 45,
      strikeActive: false
    },
    {
      id: 2,
      name: 'Bandra',
      city: 'Mumbai',
      rainfall: 3,
      temperature: 31,
      aqi: 110,
      trafficCongestion: 40,
      strikeActive: false
    },
    {
      id: 3,
      name: 'Kurla',
      city: 'Mumbai',
      rainfall: 8,
      temperature: 33,
      aqi: 130,
      trafficCongestion: 50,
      strikeActive: false
    }
  ],
  claims: [],
  subscriptions: []
};

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ============ AUTHENTICATION ROUTES ============

app.post('/api/auth/register', (req, res) => {
  const { fullName, age, panCard, email, password, deliveryPlatform, deliveryUniqueId, workingZones } = req.body;

  // Validation
  if (!fullName || !age || !panCard || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user already exists
  const existingUser = mockDatabase.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Create new user
  const newUser = {
    id: mockDatabase.users.length + 1,
    fullName,
    age: parseInt(age),
    panCard,
    panVerified: true,
    deliveryPlatform: deliveryPlatform || 'swiggy',
    deliveryUniqueId: deliveryUniqueId || '',
    workingZones: workingZones || [],
    email,
    passwordHash: password, // In production, hash the password
    onboardingComplete: false,
    activeSubscription: null,
    createdAt: new Date()
  };

  mockDatabase.users.push(newUser);

  // Generate JWT token
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    success: true,
    token,
    user: { ...newUser, passwordHash: undefined }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = mockDatabase.users.find(u => u.email === email && u.passwordHash === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    success: true,
    token,
    user: { ...user, passwordHash: undefined }
  });
});

app.get('/api/auth/me', verifyToken, (req, res) => {
  const user = mockDatabase.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ ...user, passwordHash: undefined });
});

// ============ USER ROUTES ============

app.post('/api/user/onboarding', verifyToken, (req, res) => {
  const { fullName, age, panCard, deliveryPlatform, deliveryUniqueId, workingZones } = req.body;

  const user = mockDatabase.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.fullName = fullName;
  user.age = age;
  user.panCard = panCard;
  user.panVerified = true;
  user.deliveryPlatform = deliveryPlatform;
  user.deliveryUniqueId = deliveryUniqueId;
  user.workingZones = workingZones;
  user.onboardingComplete = true;

  res.json({ success: true, user: { ...user, passwordHash: undefined } });
});

app.get('/api/user/profile', verifyToken, (req, res) => {
  const user = mockDatabase.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ ...user, passwordHash: undefined });
});

// ============ PLANS ROUTES ============

app.get('/api/plans', (req, res) => {
  res.json(mockDatabase.plans);
});

app.post('/api/plans/subscribe', verifyToken, (req, res) => {
  const { planId } = req.body;

  const plan = mockDatabase.plans.find(p => p.id === planId);
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  const user = mockDatabase.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const now = new Date();
  const renewalDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const lockInEndDate = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);

  const subscription = {
    id: mockDatabase.subscriptions.length + 1,
    userId: user.id,
    planId: planId,
    status: 'active',
    activatedAt: now,
    renewalDate,
    lockInEndDate,
    payoutsThisWeek: 0,
    payoutsThisMonth: 0
  };

  mockDatabase.subscriptions.push(subscription);
  user.activeSubscription = { planId, status: 'active' };

  res.json({ success: true, subscription });
});

app.get('/api/plans/active', verifyToken, (req, res) => {
  const user = mockDatabase.users.find(u => u.id === req.user.id);
  if (!user || !user.activeSubscription) {
    return res.status(404).json({ error: 'No active subscription' });
  }

  const plan = mockDatabase.plans.find(p => p.id === user.activeSubscription.planId);
  const subscription = mockDatabase.subscriptions.find(s => s.userId === user.id && s.status === 'active');

  res.json({ plan, subscription });
});

// ============ ZONES ROUTES ============

app.get('/api/zones', (req, res) => {
  res.json(mockDatabase.zones);
});

app.get('/api/zones/status', (req, res) => {
  const { zones } = req.query;
  const zoneNames = zones ? zones.split(',') : [];

  const zoneData = mockDatabase.zones.filter(z => zoneNames.length === 0 || zoneNames.includes(z.name));
  res.json(zoneData);
});

// ============ RISK SCORE ROUTES ============

app.get('/api/risk-score/:zone', verifyToken, (req, res) => {
  const { zone } = req.params;
  const user = mockDatabase.users.find(u => u.id === req.user.id);
  const zoneData = mockDatabase.zones.find(z => z.name === zone);

  if (!zoneData) {
    return res.status(404).json({ error: 'Zone not found' });
  }

  if (!user.activeSubscription) {
    return res.status(400).json({ error: 'No active subscription' });
  }

  const plan = mockDatabase.plans.find(p => p.id === user.activeSubscription.planId);
  const weights = plan.riskScoreWeights;

  // Normalize scores
  const normalizeRainfall = (mm) => {
    if (mm <= 0) return 0;
    if (mm <= 5) return 20;
    if (mm <= 15) return 40;
    if (mm <= 30) return 70;
    return 100;
  };

  const normalizeTemperature = (celsius) => {
    if (celsius < 30) return 10;
    if (celsius < 35) return 30;
    if (celsius < 40) return 50;
    if (celsius < 45) return 75;
    return 100;
  };

  const normalizeAQI = (aqi) => {
    if (aqi <= 50) return 10;
    if (aqi <= 100) return 30;
    if (aqi <= 200) return 50;
    if (aqi <= 300) return 75;
    return 100;
  };

  const normalizeTraffic = (congestion) => {
    if (congestion <= 20) return 10;
    if (congestion <= 40) return 30;
    if (congestion <= 60) return 50;
    if (congestion <= 80) return 75;
    return 100;
  };

  const rainScore = normalizeRainfall(zoneData.rainfall);
  const tempScore = normalizeTemperature(zoneData.temperature);
  const aqiScore = normalizeAQI(zoneData.aqi);
  const trafficScore = normalizeTraffic(zoneData.trafficCongestion);
  const strikeScore = zoneData.strikeActive ? 100 : 0;

  let riskScore = 0;
  if (plan.name === 'bronze') {
    riskScore = (weights.rain * rainScore) + (weights.temperature * tempScore);
  } else if (plan.name === 'silver') {
    riskScore = (weights.rain * rainScore) + (weights.temperature * tempScore) + (weights.pollution * aqiScore) + (weights.strike * strikeScore);
  } else if (plan.name === 'gold') {
    riskScore = (weights.rain * rainScore) + (weights.temperature * tempScore) + (weights.pollution * aqiScore) + (weights.traffic * trafficScore) + (weights.strike * strikeScore);
  }

  riskScore = Math.min(100, Math.max(0, riskScore));

  res.json({
    riskScore,
    breakdown: { rainScore, tempScore, aqiScore, trafficScore, strikeScore },
    zone: zoneData
  });
});

// ============ CLAIMS ROUTES ============

app.post('/api/claims/trigger', verifyToken, (req, res) => {
  const { zone } = req.body;
  const user = mockDatabase.users.find(u => u.id === req.user.id);
  const zoneData = mockDatabase.zones.find(z => z.name === zone);

  if (!zoneData) {
    return res.status(404).json({ error: 'Zone not found' });
  }

  if (!user.activeSubscription) {
    return res.status(400).json({ error: 'No active subscription' });
  }

  const subscription = mockDatabase.subscriptions.find(s => s.userId === user.id && s.status === 'active');
  if (!subscription) {
    return res.status(400).json({ error: 'Subscription not found' });
  }

  // Check lock-in period
  if (new Date() < subscription.lockInEndDate) {
    return res.status(400).json({ error: 'Still in 3-week lock-in period' });
  }

  // Check payout limits
  if (subscription.payoutsThisWeek >= 1) {
    return res.status(400).json({ error: 'Already claimed once this week' });
  }
  if (subscription.payoutsThisMonth >= 3) {
    return res.status(400).json({ error: 'Already claimed 3 times this month' });
  }

  const plan = mockDatabase.plans.find(p => p.id === user.activeSubscription.planId);

  // Calculate risk score (simplified)
  const riskScore = Math.random() * 100;

  let payoutLevel = 'none';
  let payoutAmount = 0;

  if (riskScore >= 80) {
    payoutLevel = 'full';
    payoutAmount = plan.maxWeeklyPayout;
  } else if (riskScore >= 60) {
    payoutLevel = 'medium';
    payoutAmount = plan.maxWeeklyPayout * 0.66;
  } else if (riskScore >= 40) {
    payoutLevel = 'small';
    payoutAmount = plan.maxWeeklyPayout * 0.33;
  }

  const claim = {
    id: mockDatabase.claims.length + 1,
    userId: user.id,
    subscriptionId: subscription.id,
    riskScore: parseFloat(riskScore.toFixed(2)),
    payoutLevel,
    payoutAmount: parseFloat(payoutAmount.toFixed(2)),
    claimedZone: zone,
    weatherData: { rainfall: zoneData.rainfall, temperature: zoneData.temperature },
    aqi: zoneData.aqi,
    trafficLevel: zoneData.trafficCongestion,
    strikeActive: zoneData.strikeActive,
    status: 'approved',
    fraudConfidenceScore: 0.1,
    claimDate: new Date(),
    approvalDate: new Date(),
    paidDate: new Date()
  };

  mockDatabase.claims.push(claim);
  subscription.payoutsThisWeek += 1;
  subscription.payoutsThisMonth += 1;

  res.json({ success: true, claim });
});

app.get('/api/claims/history', verifyToken, (req, res) => {
  const claims = mockDatabase.claims.filter(c => c.userId === req.user.id);
  res.json(claims);
});

app.get('/api/claims/pending', verifyToken, (req, res) => {
  const pending = mockDatabase.claims.filter(c => c.userId === req.user.id && c.status === 'pending');
  res.json(pending);
});

// ============ ERROR HANDLING ============

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`GigShield Backend Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api/docs`);
});

module.exports = app;
