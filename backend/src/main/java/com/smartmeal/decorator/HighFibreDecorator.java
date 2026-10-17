package com.smartmeal.decorator;
public class HighFibreDecorator extends FoodDecorator {
    public HighFibreDecorator(FoodComponent w) { super(w); }
    @Override public String getTags()        { return wrapped.getTags() + "HIGH_FIBRE,"; }
    @Override public String getDescription() { return wrapped.getDescription() + " · High fibre aids digestion"; }
}
