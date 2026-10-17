package com.smartmeal.observer;

import com.smartmeal.model.Meal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class RecommendationObserver implements NutritionObserver {
    private static final Logger log = LoggerFactory.getLogger(RecommendationObserver.class);

    @Override
    public void onMealLogged(Meal meal, double total, double target) {
        double remaining = Math.max(0, target - total);
        log.info("[Observer:Recommendations] Refreshed for user {} — {:.0f} kcal remaining.", meal.getUser().getId(), remaining);
        // Extension point: invalidate recommendation cache for this user
    }
}
