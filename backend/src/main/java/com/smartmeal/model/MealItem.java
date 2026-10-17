package com.smartmeal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "meal_items")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MealItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "food_id", nullable = false)
    private Food food;

    @Column(nullable = false)
    private Double quantityGrams;

    // Calculated at quantity: per100g * qty / 100
    private Double calories;
    private Double protein;
    private Double carbs;
    private Double fat;
    private Double fibre;
    private Double sodium;
}
