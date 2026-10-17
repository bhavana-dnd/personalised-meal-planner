package com.smartmeal.singleton;

/**
 * ══════════════════════════════════════════════════════════
 * DESIGN PATTERN: SINGLETON  (Pattern #1)
 * ══════════════════════════════════════════════════════════
 * PROBLEM: BMR/TDEE constants and macro split ratios must be
 *   identical across NutritionCalculator, all 4 Strategy
 *   implementations, and the Facade. If each class held its
 *   own copy, a formula change would require edits in many
 *   places and risk inconsistency.
 *
 * SOLUTION: One shared, immutable instance — thread-safe via
 *   double-checked locking with volatile.
 *
 * USED BY: NutritionCalculator, all Strategy classes.
 * ══════════════════════════════════════════════════════════
 */
public class NutritionConfiguration {

    private static volatile NutritionConfiguration instance;

    // Activity multipliers (Mifflin-St Jeor)
    private final double SEDENTARY   = 1.2;
    private final double LIGHT       = 1.375;
    private final double MODERATE    = 1.55;
    private final double ACTIVE      = 1.725;
    private final double VERY_ACTIVE = 1.9;

    // Goal-based calorie adjustments (kcal/day from TDEE)
    private final double WEIGHT_LOSS_DEFICIT = -500.0;
    private final double MUSCLE_GAIN_SURPLUS =  300.0;

    // Macro % splits [protein%, carbs%, fat%] per goal
    private final double[] WEIGHT_LOSS_MACROS  = {0.35, 0.40, 0.25};
    private final double[] MUSCLE_GAIN_MACROS  = {0.35, 0.45, 0.20};
    private final double[] MAINTENANCE_MACROS  = {0.25, 0.50, 0.25};
    private final double[] BALANCED_MACROS     = {0.30, 0.45, 0.25};

    // PM POSHAN child nutrition norms (ICMR RDA for 6-14 age group)
    private final double POSHAN_CALORIE_MIN = 450;   // kcal per meal
    private final double POSHAN_PROTEIN_MIN = 12;    // g per meal

    private final double PROTEIN_KCAL = 4.0;
    private final double CARBS_KCAL   = 4.0;
    private final double FAT_KCAL     = 9.0;

    private NutritionConfiguration() {}

    public static NutritionConfiguration getInstance() {
        if (instance == null) {
            synchronized (NutritionConfiguration.class) {
                if (instance == null) {
                    instance = new NutritionConfiguration();
                }
            }
        }
        return instance;
    }

    public double getActivityMultiplier(String level) {
        return switch (level.toUpperCase()) {
            case "SEDENTARY"   -> SEDENTARY;
            case "LIGHT"       -> LIGHT;
            case "MODERATE"    -> MODERATE;
            case "ACTIVE"      -> ACTIVE;
            case "VERY_ACTIVE" -> VERY_ACTIVE;
            default            -> MODERATE;
        };
    }

    public double getCalorieAdjustment(String goal) {
        return switch (goal.toUpperCase()) {
            case "WEIGHT_LOSS" -> WEIGHT_LOSS_DEFICIT;
            case "MUSCLE_GAIN" -> MUSCLE_GAIN_SURPLUS;
            default            -> 0.0;
        };
    }

    public double[] getMacroSplit(String goal) {
        return switch (goal.toUpperCase()) {
            case "WEIGHT_LOSS" -> WEIGHT_LOSS_MACROS;
            case "MUSCLE_GAIN" -> MUSCLE_GAIN_MACROS;
            case "MAINTENANCE" -> MAINTENANCE_MACROS;
            default            -> BALANCED_MACROS;
        };
    }

    public double getPoshanCalorieMin() { return POSHAN_CALORIE_MIN; }
    public double getPoshanProteinMin() { return POSHAN_PROTEIN_MIN; }
    public double getProteinKcal()     { return PROTEIN_KCAL; }
    public double getCarbsKcal()       { return CARBS_KCAL; }
    public double getFatKcal()         { return FAT_KCAL; }
}
