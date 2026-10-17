package com.smartmeal.decorator;
public class LowCalorieDecorator extends FoodDecorator {
    public LowCalorieDecorator(FoodComponent w) { super(w); }
    @Override public String getTags()        { return wrapped.getTags() + "LOW_CALORIE,"; }
    @Override public String getDescription() { return wrapped.getDescription() + " · Low calorie (" + String.format("%.0f", wrapped.getCalories()) + " kcal/100g)"; }
}
