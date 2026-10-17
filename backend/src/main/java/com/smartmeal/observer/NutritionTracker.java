package com.smartmeal.observer;

import com.smartmeal.model.Meal;
import org.springframework.stereotype.Component;
import java.util.*;

/** Observer Subject — MealService calls notifyAll() after persisting a meal. */
@Component
public class NutritionTracker {
    private final List<NutritionObserver> observers = new ArrayList<>();

    public void register(NutritionObserver o)   { observers.add(o); }
    public void unregister(NutritionObserver o) { observers.remove(o); }

    public void notifyAll(Meal meal, double totalKcal, double target) {
        observers.forEach(o -> o.onMealLogged(meal, totalKcal, target));
    }
}
