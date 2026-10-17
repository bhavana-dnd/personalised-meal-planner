package com.smartmeal.decorator;
public class HighProteinDecorator extends FoodDecorator {
    public HighProteinDecorator(FoodComponent w) { super(w); }
    @Override public String getTags()        { return wrapped.getTags() + "HIGH_PROTEIN,"; }
    @Override public String getDescription() { return wrapped.getDescription() + " · Excellent protein source (" + String.format("%.0f", wrapped.getProtein()) + "g/100g)"; }
}
