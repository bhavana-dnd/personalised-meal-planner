package com.smartmeal.service;

import com.smartmeal.model.UserProfile;
import com.smartmeal.singleton.NutritionConfiguration;
import org.springframework.stereotype.Service;

/** Uses NutritionConfiguration Singleton for all formulas. */
@Service
public class NutritionCalculator {

    private final NutritionConfiguration cfg = NutritionConfiguration.getInstance();

    public double calculateBMR(UserProfile p) {
        if (p.getWeightKg()==null || p.getHeightCm()==null || p.getAge()==null) return 2000;
        double bmr = 10 * p.getWeightKg() + 6.25 * p.getHeightCm() - 5 * p.getAge();
        return "FEMALE".equalsIgnoreCase(p.getGender()) ? bmr - 161 : bmr + 5;
    }

    public double calculateTDEE(UserProfile p) {
        double mult = p.getActivityLevel() != null
                ? cfg.getActivityMultiplier(p.getActivityLevel()) : 1.55;
        return calculateBMR(p) * mult;
    }

    public double calculateCalorieTarget(UserProfile p) {
        String goal = p.getGoal() != null ? p.getGoal() : "BALANCED";
        return calculateTDEE(p) + cfg.getCalorieAdjustment(goal);
    }

    public double[] calculateMacroTargets(UserProfile p) {
        double kcal = calculateCalorieTarget(p);
        String goal = p.getGoal() != null ? p.getGoal() : "BALANCED";
        double[] split = cfg.getMacroSplit(goal);
        return new double[]{
            (kcal * split[0]) / cfg.getProteinKcal(),
            (kcal * split[1]) / cfg.getCarbsKcal(),
            (kcal * split[2]) / cfg.getFatKcal()
        };
    }

    public double scale(Double per100g, double qty) {
        return per100g != null ? per100g * qty / 100.0 : 0;
    }

    public double round1(double v) { return Math.round(v * 10.0) / 10.0; }
}
