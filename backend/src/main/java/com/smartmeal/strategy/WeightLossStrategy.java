package com.smartmeal.strategy;

import com.smartmeal.model.Food;
import com.smartmeal.model.UserProfile;
import org.springframework.stereotype.Component;

@Component
public class WeightLossStrategy implements MealRecommendationStrategy {

    @Override
    public int score(Food f, UserProfile p, double remaining) {
        int s = 50;
        // Low calorie density preferred
        if (f.getCaloriesPer100g() < 80)  s += 25;
        else if (f.getCaloriesPer100g() < 150) s += 12;
        else if (f.getCaloriesPer100g() > 350) s -= 20;
        // High fibre = satiety
        if (f.getFibrePer100g() != null && f.getFibrePer100g() > 5) s += 15;
        // Low sugar
        if (f.getSugarPer100g() != null && f.getSugarPer100g() < 5) s += 10;
        else if (f.getSugarPer100g() != null && f.getSugarPer100g() > 15) s -= 10;
        // Protein retention
        if (f.getProteinPer100g() > 15) s += 10;
        // Fits remaining budget (150g typical serving)
        if (f.getCaloriesPer100g() * 1.5 > remaining) s -= 15;
        return clamp(s);
    }

    @Override
    public String explain(Food f, UserProfile p) {
        StringBuilder sb = new StringBuilder("Supports weight loss: ");
        if (f.getCaloriesPer100g() < 150) sb.append("low calorie density, ");
        if (f.getFibrePer100g() != null && f.getFibrePer100g() > 5) sb.append("high fibre keeps you full, ");
        if (f.getProteinPer100g() > 15) sb.append("good protein to preserve muscle, ");
        return sb.toString().replaceAll(", $", ".").replace("Supports weight loss: .", "Fits your weight loss calorie target.");
    }

    @Override public String goalName() { return "WEIGHT_LOSS"; }
    private int clamp(int v) { return Math.max(0, Math.min(100, v)); }
}
