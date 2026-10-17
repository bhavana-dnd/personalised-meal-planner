package com.smartmeal.observer;

import com.smartmeal.model.Meal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class AlertObserver implements NutritionObserver {
    private static final Logger log = LoggerFactory.getLogger(AlertObserver.class);

    @Override
    public void onMealLogged(Meal meal, double total, double target) {
        if (target <= 0) return;
        double ratio = total / target;
        if      (ratio >= 1.0)  log.warn("[Observer:Alert] ⚠ User {} EXCEEDED daily calorie target! ({:.0f}/{:.0f})", meal.getUser().getId(), total, target);
        else if (ratio >= 0.90) log.info("[Observer:Alert] User {} is at 90% of daily target.", meal.getUser().getId());
        else if (ratio >= 0.75) log.info("[Observer:Alert] User {} is at 75% of daily target.", meal.getUser().getId());
    }
}
