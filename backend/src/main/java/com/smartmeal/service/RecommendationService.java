package com.smartmeal.service;

import com.smartmeal.decorator.FoodComponent;
import com.smartmeal.decorator.FoodDecoratorService;
import com.smartmeal.dto.MealDtos.*;
import com.smartmeal.model.Food;
import com.smartmeal.model.UserProfile;
import com.smartmeal.repository.*;
import com.smartmeal.strategy.RecommendationContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final FoodRepository foodRepo;
    private final UserProfileRepository profileRepo;
    private final MealRepository mealRepo;
    private final RecommendationContext context;
    private final FoodDecoratorService decoratorService;
    private final NutritionCalculator calc;

    public List<RecommendationResponse> recommend(Long userId, int limit) {
        UserProfile profile = profileRepo.findByUserId(userId).orElse(null);
        String goal = profile != null && profile.getGoal() != null ? profile.getGoal() : "BALANCED";

        // STRATEGY PATTERN: select algorithm dynamically
        context.selectForGoal(goal);

        double target = profile != null ? calc.calculateCalorieTarget(profile) : 2000;
        double consumed = mealRepo.sumCalories(userId, LocalDate.now());
        double remaining = Math.max(0, target - consumed);

        Set<String> allergies = splitLower(profile != null ? profile.getAllergies() : null);
        Set<String> dislikes  = splitLower(profile != null ? profile.getDislikedFoods() : null);
        Set<String> likes     = splitLower(profile != null ? profile.getLikedFoods() : null);
        String diet           = profile != null && profile.getDietType() != null ? profile.getDietType() : "NONE";

        return foodRepo.findAll().stream()
                .filter(f -> !hasAllergen(f, allergies))
                .filter(f -> passesDiet(f, diet))
                .filter(f -> !dislikes.contains(f.getName().toLowerCase()))
                .map(f -> {
                    int score = context.score(f, profile, remaining);
                    if (likes.contains(f.getName().toLowerCase())) score = Math.min(100, score + 15);
                    FoodComponent dec = decoratorService.decorate(f);
                    return RecommendationResponse.builder()
                            .foodId(f.getId()).foodName(f.getName()).category(f.getCategory())
                            .tags(decoratorService.tagsAsList(dec))
                            .description(dec.getDescription())
                            .calories(f.getCaloriesPer100g()).protein(f.getProteinPer100g())
                            .carbs(f.getCarbsPer100g()).fat(f.getFatPer100g())
                            .score(score)
                            .reason(context.explain(f, profile))
                            .goal(goal)
                            .isPoshanMeal(f.getIsPoshanMeal())
                            .build();
                })
                .sorted(Comparator.comparingInt(RecommendationResponse::getScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<PoshanMenuResponse> getPoshanMenu(String state) {
        List<Food> meals = state != null && !state.isBlank()
                ? foodRepo.findByIsPoshanMealTrueAndPoshanState(state)
                : foodRepo.findByIsPoshanMealTrue();
        return meals.stream().map(f -> PoshanMenuResponse.builder()
                .state(f.getPoshanState()).day(f.getPoshanDay()).mealType(f.getPoshanMealType())
                .dishName(f.getName())
                .calories(f.getCaloriesPer100g()).protein(f.getProteinPer100g())
                .carbs(f.getCarbsPer100g()).fat(f.getFatPer100g()).fibre(f.getFibrePer100g())
                .foodId(f.getId())
                .nutritionNote("Values per 100g. Portion size typically 200–300g per child.")
                .build()).collect(Collectors.toList());
    }

    private Set<String> splitLower(String csv) {
        if (csv == null || csv.isBlank()) return Set.of();
        return Arrays.stream(csv.split(",")).map(String::trim).map(String::toLowerCase)
                .filter(s -> !s.isEmpty()).collect(Collectors.toSet());
    }

    private boolean hasAllergen(Food f, Set<String> al) {
        if (f.getAllergens() == null || al.isEmpty()) return false;
        String a = f.getAllergens().toLowerCase();
        return al.stream().anyMatch(a::contains);
    }

    private boolean passesDiet(Food f, String diet) {
        return switch (diet.toUpperCase()) {
            case "VEGETARIAN" -> Boolean.TRUE.equals(f.getIsVegetarian());
            case "VEGAN"      -> Boolean.TRUE.equals(f.getIsVegan());
            default           -> true;
        };
    }
}
