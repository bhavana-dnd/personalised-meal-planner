package com.smartmeal.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

public class MealDtos {

    @Data public static class LogMealRequest {
        private String mealType;
        private LocalDate date;
        private List<MealItemRequest> items;
        private String notes;
    }

    @Data public static class MealItemRequest {
        private Long foodId;
        private Double quantityGrams;
    }

    @Data @Builder public static class MealResponse {
        private Long id;
        private String mealType;
        private LocalDate date;
        private List<MealItemResponse> items;
        private Double totalCalories, totalProtein, totalCarbs, totalFat, totalFibre, totalSodium;
    }

    @Data @Builder public static class MealItemResponse {
        private Long foodId;
        private String foodName;
        private String category;
        private Double quantityGrams;
        private Double calories, protein, carbs, fat, fibre, sodium;
        private List<String> tags;
    }

    @Data @Builder public static class DashboardResponse {
        private LocalDate date;
        private Double calorieTarget, caloriesConsumed, caloriesRemaining;
        private Double proteinTarget, proteinConsumed;
        private Double carbsTarget, carbsConsumed;
        private Double fatTarget, fatConsumed;
        private Double progressPercent;
        private List<MealResponse> meals;
        private String activeGoal;
        private List<String> alerts;
    }

    @Data @Builder public static class NutritionTargetResponse {
        private Double bmr, tdee, calorieTarget;
        private Double proteinTargetG, carbsTargetG, fatTargetG;
        private String goal, activityLevel;
    }

    @Data @Builder public static class RecommendationResponse {
        private Long foodId;
        private String foodName, category;
        private List<String> tags;
        private String description;
        private Double calories, protein, carbs, fat;
        private int score;
        private String reason;
        private String goal;
        private Boolean isPoshanMeal;
    }

    @Data @Builder public static class PoshanMenuResponse {
        private String state;
        private String day;
        private String mealType;
        private String dishName;
        private Double calories, protein, carbs, fat, fibre;
        private Long foodId;
        private String nutritionNote;
    }

    @Data public static class WeightRequest {
        private Double weightKg;
        private String notes;
        private LocalDate date;
    }

    @Data @Builder public static class WeightResponse {
        private Long id;
        private Double weightKg;
        private LocalDate date;
        private String notes;
    }

    @Data public static class ProfileRequest {
        private Integer age;
        private String gender;
        private Double heightCm;
        private Double weightKg;
        private String activityLevel;
        private String goal;
        private String dietType;
        private String allergies;
        private String likedFoods;
        private String dislikedFoods;
        private String userType;
    }

    @Data @Builder public static class ProfileResponse {
        private Long userId;
        private String username;
        private String email;
        private Integer age;
        private String gender;
        private Double heightCm;
        private Double weightKg;
        private String activityLevel;
        private String goal;
        private String dietType;
        private String allergies;
        private String likedFoods;
        private String dislikedFoods;
        private String userType;
    }

    @Data @Builder public static class FoodResponse {
        private Long id;
        private String name, category;
        private Double calories, protein, carbs, fat, fibre, sugar, sodium;
        private Boolean isVegetarian, isVegan, isGlutenFree;
        private String allergens;
        private List<String> tags;
        private Boolean isPoshanMeal;
        private String poshanState, poshanDay, poshanMealType;
    }

    @Data @Builder public static class HistoryDayResponse {
        private LocalDate date;
        private Double totalCalories, totalProtein, totalCarbs, totalFat;
        private List<MealResponse> meals;
    }
}
