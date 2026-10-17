package com.smartmeal.decorator;

import com.smartmeal.model.Food;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;

@Service
public class FoodDecoratorService {

    public FoodComponent decorate(Food food) {
        FoodComponent c = new BasicFood(food);
        if (food.getProteinPer100g()  != null && food.getProteinPer100g() > 15)  c = new HighProteinDecorator(c);
        if (food.getFibrePer100g()    != null && food.getFibrePer100g()   > 5)   c = new HighFibreDecorator(c);
        if (food.getCaloriesPer100g() != null && food.getCaloriesPer100g() < 100) c = new LowCalorieDecorator(c);
        return c;
    }

    /** Parse comma-separated tags string into a list for JSON */
    public List<String> tagsAsList(FoodComponent c) {
        String raw = c.getTags();
        if (raw == null || raw.isBlank()) return List.of();
        return Arrays.stream(raw.split(","))
                .map(String::trim).filter(s -> !s.isEmpty()).toList();
    }
}
