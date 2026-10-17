package com.smartmeal.decorator;

/**
 * ══════════════════════════════════════════════════════════
 * DESIGN PATTERN: DECORATOR  (Pattern #5)
 * ══════════════════════════════════════════════════════════
 * PROBLEM: Foods need dynamic characteristic badges: [High Protein],
 *   [High Fibre], [Low Calorie]. A naive approach creates subclasses
 *   for every combination — HighProteinLowCalorieGrain, etc.
 *   With N characteristics that's 2^N subclasses.
 *
 * SOLUTION: Wrap a BasicFood with any number of decorators at
 *   runtime. Each decorator adds its tag and description.
 *   RecommendationService stacks them based on actual values.
 *
 * USED BY: RecommendationService, FoodScanService.
 * ══════════════════════════════════════════════════════════
 */
public interface FoodComponent {
    String getName();
    double getCalories();
    double getProtein();
    double getCarbs();
    double getFat();
    double getFibre();
    String getTags();
    String getDescription();
}
