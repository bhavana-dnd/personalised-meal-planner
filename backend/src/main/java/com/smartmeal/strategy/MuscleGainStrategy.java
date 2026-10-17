package com.smartmeal.strategy;

import com.smartmeal.model.Food;
import com.smartmeal.model.UserProfile;
import org.springframework.stereotype.Component;

@Component
public class MuscleGainStrategy implements MealRecommendationStrategy {
    @Override
    public int score(Food f, UserProfile p, double remaining) {
        int s = 50;
        if (f.getProteinPer100g() > 20) s += 25;
        else if (f.getProteinPer100g() > 12) s += 12;
        else if (f.getProteinPer100g() < 5)  s -= 15;
        if (f.getCaloriesPer100g() > 200) s += 10;
        if (f.getCarbsPer100g() > 20 && f.getFibrePer100g() != null && f.getFibrePer100g() > 3) s += 10;
        if (f.getSugarPer100g() != null && f.getSugarPer100g() > 20) s -= 10;
        return Math.max(0, Math.min(100, s));
    }
    @Override
    public String explain(Food f, UserProfile p) {
        StringBuilder sb = new StringBuilder("Supports muscle gain: ");
        if (f.getProteinPer100g() > 12) sb.append(String.format("%.0fg protein/100g, ", f.getProteinPer100g()));
        if (f.getCaloriesPer100g() > 200) sb.append("calorie-dense for surplus, ");
        if (f.getCarbsPer100g() > 20) sb.append("carbs fuel workouts, ");
        return sb.toString().replaceAll(", $", ".");
    }
    @Override public String goalName() { return "MUSCLE_GAIN"; }
}
