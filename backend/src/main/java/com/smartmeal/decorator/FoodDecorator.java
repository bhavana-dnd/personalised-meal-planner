package com.smartmeal.decorator;

public abstract class FoodDecorator implements FoodComponent {
    protected final FoodComponent wrapped;
    protected FoodDecorator(FoodComponent wrapped) { this.wrapped = wrapped; }
    @Override public String getName()        { return wrapped.getName(); }
    @Override public double getCalories()    { return wrapped.getCalories(); }
    @Override public double getProtein()     { return wrapped.getProtein(); }
    @Override public double getCarbs()       { return wrapped.getCarbs(); }
    @Override public double getFat()         { return wrapped.getFat(); }
    @Override public double getFibre()       { return wrapped.getFibre(); }
    @Override public String getTags()        { return wrapped.getTags(); }
    @Override public String getDescription() { return wrapped.getDescription(); }
}
