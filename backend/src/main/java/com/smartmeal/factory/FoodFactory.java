package com.smartmeal.factory;

import com.smartmeal.model.Food;
import org.springframework.stereotype.Component;

/**
 * ══════════════════════════════════════════════════════════
 * DESIGN PATTERN: FACTORY  (Pattern #2)
 * ══════════════════════════════════════════════════════════
 * PROBLEM: Creating Food objects requires setting ~15 fields.
 *   Each category has different defaults (e.g. MEAT is never
 *   vegan; GRAIN always has gluten; FRUIT is always vegan).
 *   Duplicating this logic across DataSeeder and any future
 *   food import service violates DRY.
 *
 * SOLUTION: FoodFactory.create(category, ...) encapsulates
 *   all category-specific defaults. Adding a new category
 *   (e.g. SUPPLEMENT) is one new method here, zero changes
 *   to callers.
 *
 * USED BY: DataSeeder, FoodImportService.
 * ══════════════════════════════════════════════════════════
 */
@Component
public class FoodFactory {

    /** Primary factory method — dispatches by category. */
    public Food create(String category, String name,
                       double cal, double protein, double carbs, double fat,
                       double fibre, double sugar, double sodium) {
        return switch (category.toUpperCase()) {
            case "FRUIT"     -> fruit(name, cal, protein, carbs, fat, fibre, sugar, sodium);
            case "VEGETABLE" -> vegetable(name, cal, protein, carbs, fat, fibre, sugar, sodium);
            case "GRAIN"     -> grain(name, cal, protein, carbs, fat, fibre, sugar, sodium);
            case "DAIRY"     -> dairy(name, cal, protein, carbs, fat, fibre, sugar, sodium);
            case "MEAT"      -> meat(name, cal, protein, carbs, fat, fibre, sugar, sodium);
            case "LEGUME"    -> legume(name, cal, protein, carbs, fat, fibre, sugar, sodium);
            case "SNACK"     -> snack(name, cal, protein, carbs, fat, fibre, sugar, sodium);
            case "BEVERAGE"  -> beverage(name, cal, protein, carbs, fat, fibre, sugar, sodium);
            default          -> generic(name, category, cal, protein, carbs, fat, fibre, sugar, sodium);
        };
    }

    /** Overload for PM POSHAN scheme meals */
    public Food createPoshanMeal(String name, String category,
                                  double cal, double protein, double carbs, double fat,
                                  double fibre, double sugar, double sodium,
                                  String state, String day, String mealType, String visionLabels) {
        Food food = create(category, name, cal, protein, carbs, fat, fibre, sugar, sodium);
        food.setIsPoshanMeal(true);
        food.setPoshanState(state);
        food.setPoshanDay(day);
        food.setPoshanMealType(mealType);
        food.setVisionLabels(visionLabels);
        return food;
    }

    private Food fruit(String name, double cal, double p, double c, double f,
                       double fi, double su, double na) {
        return base(name, "FRUIT", cal, p, c, f, fi, su, na)
                .isVegetarian(true).isVegan(true).isGlutenFree(true).allergens("").build();
    }

    private Food vegetable(String name, double cal, double p, double c, double f,
                           double fi, double su, double na) {
        return base(name, "VEGETABLE", cal, p, c, f, fi, su, na)
                .isVegetarian(true).isVegan(true).isGlutenFree(true).allergens("").build();
    }

    private Food grain(String name, double cal, double p, double c, double f,
                       double fi, double su, double na) {
        return base(name, "GRAIN", cal, p, c, f, fi, su, na)
                .isVegetarian(true).isVegan(true).isGlutenFree(false).allergens("gluten").build();
    }

    private Food dairy(String name, double cal, double p, double c, double f,
                       double fi, double su, double na) {
        return base(name, "DAIRY", cal, p, c, f, fi, su, na)
                .isVegetarian(true).isVegan(false).isGlutenFree(true).allergens("dairy").build();
    }

    private Food meat(String name, double cal, double p, double c, double f,
                      double fi, double su, double na) {
        return base(name, "MEAT", cal, p, c, f, fi, su, na)
                .isVegetarian(false).isVegan(false).isGlutenFree(true).allergens("").build();
    }

    private Food legume(String name, double cal, double p, double c, double f,
                        double fi, double su, double na) {
        return base(name, "LEGUME", cal, p, c, f, fi, su, na)
                .isVegetarian(true).isVegan(true).isGlutenFree(true).allergens("").build();
    }

    private Food snack(String name, double cal, double p, double c, double f,
                       double fi, double su, double na) {
        return base(name, "SNACK", cal, p, c, f, fi, su, na)
                .isVegetarian(true).isVegan(false).isGlutenFree(false).allergens("").build();
    }

    private Food beverage(String name, double cal, double p, double c, double f,
                          double fi, double su, double na) {
        return base(name, "BEVERAGE", cal, p, c, f, fi, su, na)
                .isVegetarian(true).isVegan(true).isGlutenFree(true).allergens("").build();
    }

    private Food generic(String name, String cat, double cal, double p, double c, double f,
                         double fi, double su, double na) {
        return base(name, cat, cal, p, c, f, fi, su, na)
                .isVegetarian(true).isVegan(false).isGlutenFree(false).allergens("").build();
    }

    private Food.FoodBuilder base(String name, String cat, double cal, double p,
                                   double c, double f, double fi, double su, double na) {
        return Food.builder()
                .name(name).category(cat)
                .caloriesPer100g(cal).proteinPer100g(p).carbsPer100g(c)
                .fatPer100g(f).fibrePer100g(fi).sugarPer100g(su).sodiumPer100g(na)
                .isPoshanMeal(false);
    }
}
