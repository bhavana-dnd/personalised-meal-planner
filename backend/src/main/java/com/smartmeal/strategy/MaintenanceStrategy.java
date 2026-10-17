package com.smartmeal.strategy;

import com.smartmeal.model.Food; import com.smartmeal.model.UserProfile;
import org.springframework.stereotype.Component;

@Component
public class MaintenanceStrategy implements MealRecommendationStrategy {
    @Override
    public int score(Food f, UserProfile p, double remaining) {
        int s = 50;
        if (f.getCaloriesPer100g() >= 100 && f.getCaloriesPer100g() <= 300) s += 15;
        else if (f.getCaloriesPer100g() > 500) s -= 15;
        if (f.getProteinPer100g() >= 10 && f.getProteinPer100g() <= 25) s += 15;
        if (f.getFibrePer100g() != null && f.getFibrePer100g() > 3) s += 10;
        if (f.getSodiumPer100g() != null && f.getSodiumPer100g() > 500) s -= 10;
        return Math.max(0, Math.min(100, s));
    }
    @Override
    public String explain(Food f, UserProfile p) { return "Balanced option to maintain current weight and support overall health."; }
    @Override public String goalName() { return "MAINTENANCE"; }
}
