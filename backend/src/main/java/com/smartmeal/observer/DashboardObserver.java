package com.smartmeal.observer;

import com.smartmeal.model.Meal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class DashboardObserver implements NutritionObserver {
    private static final Logger log = LoggerFactory.getLogger(DashboardObserver.class);

    @Override
    public void onMealLogged(Meal meal, double total, double target) {
        double pct = target > 0 ? (total / target) * 100 : 0;
        log.info("[Observer:Dashboard] User={} Meal={} Total={:.0f}/{:.0f} kcal ({:.1f}%)",
                meal.getUser().getId(), meal.getMealType(), total, target, pct);
        // Extension point: push live update via WebSocket
    }
}
