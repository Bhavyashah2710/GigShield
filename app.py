#!/usr/bin/env python3
"""
GigShield AI Engine - Risk Scoring and Fraud Detection
Flask-based microservice for calculating risk scores and detecting fraud
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import numpy as np
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
PORT = os.getenv('PORT', 5001)
DEBUG = os.getenv('FLASK_ENV', 'development') == 'development'

# ============ RISK SCORING ENGINE ============

class RiskScorer:
    """Calculate risk scores based on environmental data and plan type"""
    
    @staticmethod
    def normalize_rainfall(mm):
        """Normalize rainfall in mm to score 0-100"""
        if mm <= 0:
            return 0
        elif mm <= 5:
            return 20
        elif mm <= 15:
            return 40
        elif mm <= 30:
            return 70
        else:
            return 100
    
    @staticmethod
    def normalize_temperature(celsius):
        """Normalize temperature in Celsius to score 0-100"""
        if celsius < 30:
            return 10
        elif celsius < 35:
            return 30
        elif celsius < 40:
            return 50
        elif celsius < 45:
            return 75
        else:
            return 100
    
    @staticmethod
    def normalize_aqi(aqi):
        """Normalize Air Quality Index to score 0-100"""
        if aqi <= 50:
            return 10
        elif aqi <= 100:
            return 30
        elif aqi <= 200:
            return 50
        elif aqi <= 300:
            return 75
        else:
            return 100
    
    @staticmethod
    def normalize_traffic(congestion_percent):
        """Normalize traffic congestion percentage to score 0-100"""
        if congestion_percent <= 20:
            return 10
        elif congestion_percent <= 40:
            return 30
        elif congestion_percent <= 60:
            return 50
        elif congestion_percent <= 80:
            return 75
        else:
            return 100
    
    @staticmethod
    def calculate_bronze(rain_score, temp_score, **kwargs):
        """Bronze Plan: 60% Rain + 40% Temperature"""
        return (0.60 * rain_score) + (0.40 * temp_score)
    
    @staticmethod
    def calculate_silver(rain_score, temp_score, aqi_score, strike_score, **kwargs):
        """Silver Plan: 37.5% Rain + 25% Temp + 25% AQI + 12.5% Strike"""
        return (0.375 * rain_score) + (0.250 * temp_score) + (0.250 * aqi_score) + (0.125 * strike_score)
    
    @staticmethod
    def calculate_gold(rain_score, temp_score, aqi_score, traffic_score, strike_score, **kwargs):
        """Gold Plan: 30% Rain + 20% Temp + 20% AQI + 20% Traffic + 10% Strike"""
        return (0.30 * rain_score) + (0.20 * temp_score) + (0.20 * aqi_score) + (0.20 * traffic_score) + (0.10 * strike_score)
    
    @classmethod
    def calculate_risk_score(cls, plan_type, rainfall, temperature, aqi, traffic_congestion, strike_active):
        """
        Calculate overall risk score based on plan type and environmental data
        
        Args:
            plan_type: 'bronze', 'silver', or 'gold'
            rainfall: Rainfall in mm
            temperature: Temperature in Celsius
            aqi: Air Quality Index
            traffic_congestion: Traffic congestion percentage (0-100)
            strike_active: Boolean indicating if strike/curfew is active
        
        Returns:
            Dictionary with risk_score and breakdown of component scores
        """
        # Normalize individual scores
        rain_score = cls.normalize_rainfall(rainfall)
        temp_score = cls.normalize_temperature(temperature)
        aqi_score = cls.normalize_aqi(aqi)
        traffic_score = cls.normalize_traffic(traffic_congestion)
        strike_score = 100 if strike_active else 0
        
        # Calculate based on plan
        if plan_type == 'bronze':
            risk_score = cls.calculate_bronze(rain_score, temp_score)
        elif plan_type == 'silver':
            risk_score = cls.calculate_silver(rain_score, temp_score, aqi_score, strike_score)
        elif plan_type == 'gold':
            risk_score = cls.calculate_gold(rain_score, temp_score, aqi_score, traffic_score, strike_score)
        else:
            risk_score = 0
        
        # Clamp to 0-100
        risk_score = max(0, min(100, risk_score))
        
        return {
            'risk_score': round(risk_score, 2),
            'breakdown': {
                'rain_score': rain_score,
                'temperature_score': temp_score,
                'aqi_score': aqi_score,
                'traffic_score': traffic_score,
                'strike_score': strike_score
            }
        }


# ============ FRAUD DETECTION ENGINE ============

class FraudDetector:
    """Detect and score potential fraudulent claims"""
    
    @staticmethod
    def calculate_fraud_score(claim_data):
        """
        Calculate fraud confidence score (0-1) for a claim
        
        Args:
            claim_data: Dictionary with claim information
        
        Returns:
            Dictionary with fraud_score and fraud_flags
        """
        fraud_score = 0.0
        fraud_flags = []
        
        # Check GPS verification
        if not claim_data.get('gps_verified', False):
            fraud_score += 0.15
            fraud_flags.append('GPS_NOT_VERIFIED')
        
        # Check platform activity
        if not claim_data.get('platform_activity_verified', False):
            fraud_score += 0.20
            fraud_flags.append('NO_PLATFORM_ACTIVITY')
        
        # Check IP geolocation match
        if not claim_data.get('ip_geolocation_match', False):
            fraud_score += 0.15
            fraud_flags.append('IP_MISMATCH')
        
        # Check WiFi environment
        if not claim_data.get('wifi_environment_match', False):
            fraud_score += 0.10
            fraud_flags.append('WIFI_MISMATCH')
        
        # Check device integrity
        if not claim_data.get('device_integrity_check', False):
            fraud_score += 0.15
            fraud_flags.append('DEVICE_COMPROMISED')
        
        # Check for multiple claims in short time
        if claim_data.get('claims_in_24h', 0) > 2:
            fraud_score += 0.10
            fraud_flags.append('MULTIPLE_CLAIMS_24H')
        
        # Clamp to 0-1
        fraud_score = max(0, min(1, fraud_score))
        
        return {
            'fraud_score': round(fraud_score, 2),
            'fraud_flags': fraud_flags,
            'risk_level': 'high' if fraud_score > 0.7 else 'medium' if fraud_score > 0.4 else 'low'
        }
    
    @staticmethod
    def detect_coordinated_fraud(claims_data):
        """
        Detect patterns of coordinated fraud across multiple accounts
        
        Args:
            claims_data: List of claim dictionaries
        
        Returns:
            Dictionary with suspicious patterns
        """
        suspicious_patterns = []
        
        # Group claims by zone and time
        zone_time_groups = {}
        for claim in claims_data:
            key = (claim.get('zone'), claim.get('hour'))
            if key not in zone_time_groups:
                zone_time_groups[key] = []
            zone_time_groups[key].append(claim)
        
        # Check for suspicious clusters
        for (zone, hour), claims in zone_time_groups.items():
            if len(claims) > 5:  # More than 5 claims in same zone/hour
                suspicious_patterns.append({
                    'type': 'CLUSTER_FRAUD',
                    'zone': zone,
                    'hour': hour,
                    'claim_count': len(claims),
                    'severity': 'high'
                })
        
        return {
            'suspicious_patterns': suspicious_patterns,
            'coordinated_fraud_detected': len(suspicious_patterns) > 0
        }


# ============ API ROUTES ============

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'GigShield AI Engine',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/risk-score/calculate', methods=['POST'])
def calculate_risk_score():
    """
    Calculate risk score for a claim
    
    Request body:
    {
        "plan_type": "bronze|silver|gold",
        "rainfall": 10,
        "temperature": 32,
        "aqi": 120,
        "traffic_congestion": 45,
        "strike_active": false
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['plan_type', 'rainfall', 'temperature', 'aqi', 'traffic_congestion', 'strike_active']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        result = RiskScorer.calculate_risk_score(
            plan_type=data['plan_type'],
            rainfall=float(data['rainfall']),
            temperature=float(data['temperature']),
            aqi=int(data['aqi']),
            traffic_congestion=int(data['traffic_congestion']),
            strike_active=bool(data['strike_active'])
        )
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/fraud-detection/score', methods=['POST'])
def calculate_fraud_score():
    """
    Calculate fraud confidence score for a claim
    
    Request body:
    {
        "gps_verified": true,
        "platform_activity_verified": true,
        "ip_geolocation_match": true,
        "wifi_environment_match": true,
        "device_integrity_check": true,
        "claims_in_24h": 1
    }
    """
    try:
        data = request.get_json()
        result = FraudDetector.calculate_fraud_score(data)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/fraud-detection/coordinated', methods=['POST'])
def detect_coordinated_fraud():
    """
    Detect coordinated fraud patterns across multiple claims
    
    Request body:
    {
        "claims": [
            {"zone": "Andheri", "hour": 14, "user_id": 1},
            {"zone": "Andheri", "hour": 14, "user_id": 2},
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        claims = data.get('claims', [])
        
        result = FraudDetector.detect_coordinated_fraud(claims)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/payout-level', methods=['POST'])
def determine_payout_level():
    """
    Determine payout level based on risk score
    
    Request body:
    {
        "risk_score": 75,
        "max_weekly_payout": 250
    }
    """
    try:
        data = request.get_json()
        risk_score = float(data.get('risk_score', 0))
        max_payout = float(data.get('max_weekly_payout', 0))
        
        if risk_score >= 80:
            payout_level = 'full'
            payout_amount = max_payout
        elif risk_score >= 60:
            payout_level = 'medium'
            payout_amount = max_payout * 0.66
        elif risk_score >= 40:
            payout_level = 'small'
            payout_amount = max_payout * 0.33
        else:
            payout_level = 'none'
            payout_amount = 0
        
        return jsonify({
            'risk_score': risk_score,
            'payout_level': payout_level,
            'payout_amount': round(payout_amount, 2),
            'max_weekly_payout': max_payout
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/batch-risk-scores', methods=['POST'])
def batch_calculate_risk_scores():
    """
    Calculate risk scores for multiple zones/plans
    
    Request body:
    {
        "requests": [
            {
                "plan_type": "bronze",
                "rainfall": 10,
                "temperature": 32,
                "aqi": 120,
                "traffic_congestion": 45,
                "strike_active": false
            },
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        requests = data.get('requests', [])
        
        results = []
        for req in requests:
            result = RiskScorer.calculate_risk_score(
                plan_type=req['plan_type'],
                rainfall=float(req['rainfall']),
                temperature=float(req['temperature']),
                aqi=int(req['aqi']),
                traffic_congestion=int(req['traffic_congestion']),
                strike_active=bool(req['strike_active'])
            )
            results.append(result)
        
        return jsonify({'results': results})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============ ERROR HANDLING ============

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# ============ MAIN ============

if __name__ == '__main__':
    print(f"Starting GigShield AI Engine on port {PORT}")
    print(f"Debug mode: {DEBUG}")
    app.run(host='0.0.0.0', port=int(PORT), debug=DEBUG)
