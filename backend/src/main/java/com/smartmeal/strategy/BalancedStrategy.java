package com.smartmeal.strategy;

import com.smartmeal.model.Food; import com.smartmeal.model.UserProfile;
import org.springframework.stereotype.Component;

@Component
public class BalancedStrategy implements MealRecommendationStrategy {
    @Override
    public int score(Food f, UserProfile p, double remaining) {
        int s = 50;
        if (f.getProteinPer100g() > 15) s += 20;
        if (f.getFibrePer100g() != null && f.getFibrePer100g() > 4) s += 15;
        if (f.getCaloriesPer100g() < 350) s += 10; else s -= 5;
        if (f.getSugarPer100g() != null && f.getSugarPer100g() < 10) s += 10;
        return Math.max(0, Math.min(100, s));
    }
    @Override
    public String explain(Food f, UserProfile p) { return "Well-rounded choice — good protein, fibre, and moderate calories for overall health."; }
    @Override public String goalName() { return "BALANCED"; }
}
