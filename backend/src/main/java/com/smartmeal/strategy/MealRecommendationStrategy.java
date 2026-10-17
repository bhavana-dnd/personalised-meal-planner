package com.smartmeal.strategy;

import com.smartmeal.model.Food;
import com.smartmeal.model.UserProfile;

/**
 * ══════════════════════════════════════════════════════════
 * DESIGN PATTERN: STRATEGY  (Pattern #3)
 * ══════════════════════════════════════════════════════════
 * PROBLEM: Recommendation scoring logic differs completely by
 *   user goal. Without Strategy this becomes a 100-line
 *   if-else in RecommendationService. Adding a new goal
 *   means editing existing, tested code.
 *
 * SOLUTION: Each goal gets its own class implementing this
 *   interface. RecommendationContext holds the active one
 *   and swaps it at runtime when the user's goal changes —
 *   zero changes to the service layer.
 *
 * IMPLEMENTATIONS: WeightLossStrategy, MuscleGainStrategy,
 *   MaintenanceStrategy, BalancedStrategy.
 *
 * USED BY: RecommendationService via RecommendationContext.
 * ══════════════════════════════════════════════════════════
 */
public interface MealRecommendationStrategy {
    /** Score 0–100 for how well this food fits the goal. */
    int score(Food food, UserProfile profile, double remainingKcal);
    /** Human-readable reason shown in the UI. */
    String explain(Food food, UserProfile profile);
    /** Goal identifier. */
    String goalName();
}
