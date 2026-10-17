package com.smartmeal.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * All nutrition values per 100g.
 * Factory Pattern creates instances by category.
 * Decorator Pattern adds characteristic tags at runtime.
 */
@Entity @Table(name = "foods")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Food {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // FRUIT, VEGETABLE, GRAIN, DAIRY, MEAT, LEGUME, SNACK, BEVERAGE

    // Nutrition per 100g
    private Double caloriesPer100g;
    private Double proteinPer100g;
    private Double carbsPer100g;
    private Double fatPer100g;
    private Double fibrePer100g;
    private Double sugarPer100g;
    private Double sodiumPer100g; // mg

    // Dietary flags
    @Builder.Default private Boolean isVegetarian = true;
    @Builder.Default private Boolean isVegan = false;
    @Builder.Default private Boolean isGlutenFree = false;

    @Column(length = 300)
    private String allergens; // comma-separated

    // PM POSHAN scheme flag
    @Builder.Default private Boolean isPoshanMeal = false;
    private String poshanState;   // e.g. "Tamil Nadu", "Maharashtra"
    private String poshanDay;     // Monday–Saturday
    private String poshanMealType; // BREAKFAST, LUNCH

    // Vision API label aliases for scanning (comma-separated Google Vision labels)
    @Column(length = 500)
    private String visionLabels;
}
