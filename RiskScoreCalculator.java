package com.gigshield.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * Risk Score Calculator - Java utility for calculating insurance risk scores
 */
public class RiskScoreCalculator {

    /**
     * Normalize rainfall in mm to score 0-100
     */
    public static int normalizeRainfall(double mm) {
        if (mm <= 0) return 0;
        if (mm <= 5) return 20;
        if (mm <= 15) return 40;
        if (mm <= 30) return 70;
        return 100;
    }

    /**
     * Normalize temperature in Celsius to score 0-100
     */
    public static int normalizeTemperature(double celsius) {
        if (celsius < 30) return 10;
        if (celsius < 35) return 30;
        if (celsius < 40) return 50;
        if (celsius < 45) return 75;
        return 100;
    }

    /**
     * Normalize Air Quality Index to score 0-100
     */
    public static int normalizeAQI(int aqi) {
        if (aqi <= 50) return 10;
        if (aqi <= 100) return 30;
        if (aqi <= 200) return 50;
        if (aqi <= 300) return 75;
        return 100;
    }

    /**
     * Normalize traffic congestion percentage to score 0-100
     */
    public static int normalizeTraffic(int congestionPercent) {
        if (congestionPercent <= 20) return 10;
        if (congestionPercent <= 40) return 30;
        if (congestionPercent <= 60) return 50;
        if (congestionPercent <= 80) return 75;
        return 100;
    }

    /**
     * Calculate risk score for Bronze plan
     * Formula: (0.60 × RainScore) + (0.40 × TemperatureScore)
     */
    public static double calculateBronze(int rainScore, int tempScore) {
        return (0.60 * rainScore) + (0.40 * tempScore);
    }

    /**
     * Calculate risk score for Silver plan
     * Formula: (0.375 × RainScore) + (0.250 × TempScore) + (0.250 × AQIScore) + (0.125 × StrikeScore)
     */
    public static double calculateSilver(int rainScore, int tempScore, int aqiScore, int strikeScore) {
        return (0.375 * rainScore) + (0.250 * tempScore) + (0.250 * aqiScore) + (0.125 * strikeScore);
    }

    /**
     * Calculate risk score for Gold plan
     * Formula: (0.30 × RainScore) + (0.20 × TempScore) + (0.20 × AQIScore) + (0.20 × TrafficScore) + (0.10 × StrikeScore)
     */
    public static double calculateGold(int rainScore, int tempScore, int aqiScore, int trafficScore, int strikeScore) {
        return (0.30 * rainScore) + (0.20 * tempScore) + (0.20 * aqiScore) + (0.20 * trafficScore) + (0.10 * strikeScore);
    }

    /**
     * Calculate overall risk score based on plan type
     */
    public static Map<String, Object> calculateRiskScore(
            String planType,
            double rainfall,
            double temperature,
            int aqi,
            int trafficCongestion,
            boolean strikeActive) {

        // Normalize individual scores
        int rainScore = normalizeRainfall(rainfall);
        int tempScore = normalizeTemperature(temperature);
        int aqiScore = normalizeAQI(aqi);
        int trafficScore = normalizeTraffic(trafficCongestion);
        int strikeScore = strikeActive ? 100 : 0;

        // Calculate based on plan
        double riskScore;
        switch (planType.toLowerCase()) {
            case "bronze":
                riskScore = calculateBronze(rainScore, tempScore);
                break;
            case "silver":
                riskScore = calculateSilver(rainScore, tempScore, aqiScore, strikeScore);
                break;
            case "gold":
                riskScore = calculateGold(rainScore, tempScore, aqiScore, trafficScore, strikeScore);
                break;
            default:
                riskScore = 0;
        }

        // Clamp to 0-100
        riskScore = Math.max(0, Math.min(100, riskScore));

        // Build result map
        Map<String, Object> result = new HashMap<>();
        result.put("riskScore", Math.round(riskScore * 100.0) / 100.0);

        Map<String, Integer> breakdown = new HashMap<>();
        breakdown.put("rainScore", rainScore);
        breakdown.put("temperatureScore", tempScore);
        breakdown.put("aqiScore", aqiScore);
        breakdown.put("trafficScore", trafficScore);
        breakdown.put("strikeScore", strikeScore);
        result.put("breakdown", breakdown);

        return result;
    }

    /**
     * Determine payout level based on risk score
     */
    public static Map<String, Object> determinePayout(double riskScore, double maxWeeklyPayout) {
        String payoutLevel;
        double payoutAmount;

        if (riskScore >= 80) {
            payoutLevel = "full";
            payoutAmount = maxWeeklyPayout;
        } else if (riskScore >= 60) {
            payoutLevel = "medium";
            payoutAmount = maxWeeklyPayout * 0.66;
        } else if (riskScore >= 40) {
            payoutLevel = "small";
            payoutAmount = maxWeeklyPayout * 0.33;
        } else {
            payoutLevel = "none";
            payoutAmount = 0;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("riskScore", riskScore);
        result.put("payoutLevel", payoutLevel);
        result.put("payoutAmount", Math.round(payoutAmount * 100.0) / 100.0);
        result.put("maxWeeklyPayout", maxWeeklyPayout);

        return result;
    }
}
