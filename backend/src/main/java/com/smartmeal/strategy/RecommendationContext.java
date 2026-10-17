package com.smartmeal.strategy;

import com.smartmeal.model.Food;
import com.smartmeal.model.UserProfile;
import org.springframework.stereotype.Component;

/** Holds and delegates to the active strategy — swapped per request by user goal. */
@Component
public class RecommendationContext {

    private MealRecommendationStrategy strategy;
    private final WeightLossStrategy wl;
    private final MuscleGainStrategy mg;
    private final MaintenanceStrategy mn;
    private final BalancedStrategy bl;

    public RecommendationContext(WeightLossStrategy wl, MuscleGainStrategy mg,
                                  MaintenanceStrategy mn, BalancedStrategy bl) {
        this.wl = wl; this.mg = mg; this.mn = mn; this.bl = bl;
        this.strategy = bl;
    }

    public void selectForGoal(String goal) {
        this.strategy = goal == null ? bl : switch (goal.toUpperCase()) {
            case "WEIGHT_LOSS"  -> wl;
            case "MUSCLE_GAIN"  -> mg;
            case "MAINTENANCE"  -> mn;
            default             -> bl;
        };
    }

    public int score(Food f, UserProfile p, double remaining) { return strategy.score(f, p, remaining); }
    public String explain(Food f, UserProfile p) { return strategy.explain(f, p); }
    public String activeGoal() { return strategy.goalName(); }
}
