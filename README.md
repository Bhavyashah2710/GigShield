# 🛵 GigShield — Parametric Income Insurance Concept for Gig Workers

**Hackathon project.** A prototype/concept for parametric (weather- and condition-triggered) income insurance for food delivery partners on platforms like Swiggy and Zomato in India. The core idea: when external conditions (heavy rain, extreme temperature, poor air quality, traffic disruption, or strikes/curfews) make it hard for a delivery worker to earn, an automated risk score triggers a payout — no manual claims process.

> **Status: Prototype / hackathon-stage.** This repository currently contains standalone proof-of-concept files demonstrating each layer of the idea (a risk-scoring formula in Java, a Flask entry point in Python, a Node entry point, and a React component) rather than a fully wired, end-to-end running application. See [Current Status](#current-status) below for an honest breakdown of what's implemented versus planned.

## The Idea
Gig delivery workers lose income on bad-weather days, high-pollution days, and during strikes/curfews — with no safety net. GigShield proposes a subscription-based parametric insurance product with three tiers:

| Plan | Price | Coverage Factors | Max Weekly Payout |
|---|---|---|---|
| Bronze | ₹59/week | Rain + Temperature | ₹150 |
| Silver | ₹89/week | + AQI + Strike | ₹250 |
| Gold | ₹118/week | + Traffic | ₹400 |

A risk score (0–100) is calculated from live environmental data per zone, weighted by plan tier, and payouts trigger automatically based on score thresholds (no payout below 40, scaling up to a full payout above 80) — removing the manual claims process that makes traditional insurance impractical at this price point.

## Current Status
What exists in this repository today:
- `RiskScoreCalculator.java` — a standalone risk-scoring formula implementation
- `app.py` — a Python/Flask entry point for the AI/risk engine concept
- `server.js` — a Node.js entry point for the backend concept
- `App.js` / `App.css` — a React front-end component
- `API_DOCUMENTATION.md` and `SETUP_GUIDE.md` — design documents describing the intended full system
- `package.json`, `pom.xml`, `requirements.txt` — dependency manifests for each language's piece

What is **not yet** implemented: the pieces above are not currently wired together into one running application, there is no live database, and the multi-folder service architecture (`frontend/`, `backend/`, `ai-engine/`, `java-utils/`) described in early planning docs has not yet been built out — the code currently lives as flat files in the repository root, organized by file, not by service.

## Tech Stack (per concept layer)
- **Frontend concept:** React, HTML/CSS, JavaScript
- **Backend concept:** Node.js, Express
- **Risk engine concept:** Python, Flask
- **Risk formula reference implementation:** Java

## Risk Score Formulas (design)
**Bronze:** `RiskScore = 0.60 × RainScore + 0.40 × TemperatureScore`
**Silver:** `RiskScore = 0.375 × RainScore + 0.250 × TemperatureScore + 0.250 × PollutionScore + 0.125 × StrikeScore`
**Gold:** `RiskScore = 0.30 × RainScore + 0.20 × TemperatureScore + 0.20 × PollutionScore + 0.20 × TrafficScore + 0.10 × StrikeScore`

Payout tiers: 0–40 → no payout · 40–60 → small (33% of max) · 60–80 → medium (66% of max) · 80–100 → full payout.

## Installation (per component)
Each language component can currently be run/tested independently:

```bash
# Risk engine (Python)
pip install -r requirements.txt
python app.py

# Backend entry point (Node.js)
npm install
node server.js

# Risk formula reference (Java)
mvn clean install
```

## Project Structure (as it actually exists today)
```
GigShield/
├── App.js                     # React front-end component (concept)
├── App.css
├── app.py                     # Python/Flask risk-engine entry point (concept)
├── server.js                  # Node.js backend entry point (concept)
├── RiskScoreCalculator.java   # Risk-scoring formula reference implementation
├── package.json
├── pom.xml
├── requirements.txt
├── API_DOCUMENTATION.md       # Designed API surface (not yet fully implemented)
├── SETUP_GUIDE.md
└── README.md
```

## Future Improvements
- [ ] Reorganize into proper `/frontend`, `/backend`, `/ai-engine` directories and actually wire them together into one running system
- [ ] Stand up a real database (PostgreSQL/MySQL) implementing the users/plans/subscriptions/claims schema from the design docs
- [ ] Connect the risk engine to a live weather/AQI API (OpenWeather, WAQI) instead of mock data
- [ ] Implement the fraud-detection checks described in the original design (GPS verification, platform-activity verification)
- [ ] Add automated tests for the risk-scoring formulas
- [ ] Build a working end-to-end demo and record a short demo video/GIF for this README

## Author
**Bhavya Shah**
GitHub: [@Bhavyashah2710](https://github.com/Bhavyashah2710)

*GigShield — because when the rain stops the deliveries, the bills don't stop coming.*
