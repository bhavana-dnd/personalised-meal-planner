package com.smartmeal.decorator;

import com.smartmeal.model.Food;

public class BasicFood implements FoodComponent {
    private final Food food;
    public BasicFood(Food food) { this.food = food; }
    @Override public String getName()        { return food.getName(); }
    @Override public double getCalories()    { return food.getCaloriesPer100g() != null ? food.getCaloriesPer100g() : 0; }
    @Override public double getProtein()     { return food.getProteinPer100g()  != null ? food.getProteinPer100g()  : 0; }
    @Override public double getCarbs()       { return food.getCarbsPer100g()    != null ? food.getCarbsPer100g()    : 0; }
    @Override public double getFat()         { return food.getFatPer100g()      != null ? food.getFatPer100g()      : 0; }
    @Override public double getFibre()       { return food.getFibrePer100g()    != null ? food.getFibrePer100g()    : 0; }
    @Override public String getTags()        { return ""; }
    @Override public String getDescription() { return food.getCategory(); }
}
