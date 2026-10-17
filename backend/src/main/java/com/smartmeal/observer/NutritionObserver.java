package com.smartmeal.observer;

import com.smartmeal.model.Meal;

/**
 * ══════════════════════════════════════════════════════════
 * DESIGN PATTERN: OBSERVER  (Pattern #4)
 * ══════════════════════════════════════════════════════════
 * PROBLEM: After a meal is logged, 3 subsystems must react:
 *   Dashboard totals, Alert checks, Recommendation refresh.
 *   If MealService calls each directly, it's tightly coupled
 *   to every consumer. Adding a 4th (e.g. streak tracker)
 *   means editing MealService.
 *
 * SOLUTION: MealService fires one event on NutritionTracker
 *   (the Subject). Each Observer handles its own concern.
 *   New consumers just register — no service code changes.
 *
 * SUBJECT: NutritionTracker
 * OBSERVERS: DashboardObserver, AlertObserver, RecommendationObserver
 * ══════════════════════════════════════════════════════════
 */
public interface NutritionObserver {
    void onMealLogged(Meal meal, double totalKcalToday, double kcalTarget);
}
