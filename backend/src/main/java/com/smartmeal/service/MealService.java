package com.smartmeal.service;

import com.smartmeal.decorator.FoodComponent;
import com.smartmeal.decorator.FoodDecoratorService;
import com.smartmeal.dto.MealDtos.*;
import com.smartmeal.model.*;
import com.smartmeal.observer.NutritionTracker;
import com.smartmeal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealService {

    private final MealRepository mealRepo;
    private final FoodRepository foodRepo;
    private final UserRepository userRepo;
    private final UserProfileRepository profileRepo;
    private final NutritionCalculator calc;
    private final NutritionTracker tracker;
    private final FoodDecoratorService decoratorService;

    @Transactional
    public MealResponse logMeal(Long userId, LogMealRequest req) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Meal meal = Meal.builder()
                .user(user)
                .mealType(req.getMealType().toUpperCase())
                .date(req.getDate() != null ? req.getDate() : LocalDate.now())
                .notes(req.getNotes())
                .build();

        double tCal=0, tPro=0, tCarb=0, tFat=0, tFib=0, tSod=0;
        List<MealItemResponse> itemResponses = new ArrayList<>();

        for (MealItemRequest ir : req.getItems()) {
            Food food = foodRepo.findById(ir.getFoodId())
                    .orElseThrow(() -> new RuntimeException("Food not found: " + ir.getFoodId()));
            double qty = ir.getQuantityGrams();

            double cal  = calc.scale(food.getCaloriesPer100g(), qty);
            double pro  = calc.scale(food.getProteinPer100g(), qty);
            double carb = calc.scale(food.getCarbsPer100g(), qty);
            double fat  = calc.scale(food.getFatPer100g(), qty);
            double fib  = calc.scale(food.getFibrePer100g(), qty);
            double sod  = calc.scale(food.getSodiumPer100g(), qty);

            MealItem item = MealItem.builder().meal(meal).food(food).quantityGrams(qty)
                    .calories(cal).protein(pro).carbs(carb).fat(fat).fibre(fib).sodium(sod).build();
            meal.getItems().add(item);

            tCal+=cal; tPro+=pro; tCarb+=carb; tFat+=fat; tFib+=fib; tSod+=sod;

            FoodComponent dec = decoratorService.decorate(food);
            itemResponses.add(MealItemResponse.builder()
                    .foodId(food.getId()).foodName(food.getName()).category(food.getCategory())
                    .quantityGrams(qty)
                    .calories(calc.round1(cal)).protein(calc.round1(pro))
                    .carbs(calc.round1(carb)).fat(calc.round1(fat))
                    .fibre(calc.round1(fib)).sodium(calc.round1(sod))
                    .tags(decoratorService.tagsAsList(dec))
                    .build());
        }

        meal.setTotalCalories(calc.round1(tCal));
        meal.setTotalProtein(calc.round1(tPro));
        meal.setTotalCarbs(calc.round1(tCarb));
        meal.setTotalFat(calc.round1(tFat));
        meal.setTotalFibre(calc.round1(tFib));
        meal.setTotalSodium(calc.round1(tSod));
        mealRepo.save(meal);

        // OBSERVER PATTERN: one call, three listeners react
        double todayTotal = mealRepo.sumCalories(userId, meal.getDate());
        double target = profileRepo.findByUserId(userId)
                .map(calc::calculateCalorieTarget).orElse(2000.0);
        tracker.notifyAll(meal, todayTotal, target);

        return MealResponse.builder()
                .id(meal.getId()).mealType(meal.getMealType()).date(meal.getDate())
                .items(itemResponses)
                .totalCalories(meal.getTotalCalories()).totalProtein(meal.getTotalProtein())
                .totalCarbs(meal.getTotalCarbs()).totalFat(meal.getTotalFat())
                .totalFibre(meal.getTotalFibre()).totalSodium(meal.getTotalSodium())
                .build();
    }

    public List<MealResponse> getForDate(Long userId, LocalDate date) {
        return mealRepo.findByUserIdAndDateOrderByLoggedAtDesc(userId, date)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<HistoryDayResponse> getHistory(Long userId, LocalDate from, LocalDate to) {
        List<Meal> meals = mealRepo.findByUserIdAndDateBetweenOrderByDateAsc(userId, from, to);
        Map<LocalDate, List<Meal>> byDay = meals.stream()
                .collect(Collectors.groupingBy(Meal::getDate, TreeMap::new, Collectors.toList()));
        return byDay.entrySet().stream().map(e -> {
            List<MealResponse> dayMeals = e.getValue().stream().map(this::toResponse).collect(Collectors.toList());
            double dCal = e.getValue().stream().mapToDouble(m -> m.getTotalCalories() != null ? m.getTotalCalories() : 0).sum();
            double dPro = e.getValue().stream().mapToDouble(m -> m.getTotalProtein()  != null ? m.getTotalProtein()  : 0).sum();
            double dCarb= e.getValue().stream().mapToDouble(m -> m.getTotalCarbs()    != null ? m.getTotalCarbs()    : 0).sum();
            double dFat = e.getValue().stream().mapToDouble(m -> m.getTotalFat()      != null ? m.getTotalFat()      : 0).sum();
            return HistoryDayResponse.builder()
                    .date(e.getKey()).meals(dayMeals)
                    .totalCalories(calc.round1(dCal)).totalProtein(calc.round1(dPro))
                    .totalCarbs(calc.round1(dCarb)).totalFat(calc.round1(dFat))
                    .build();
        }).collect(Collectors.toList());
    }

    private MealResponse toResponse(Meal meal) {
        List<MealItemResponse> items = meal.getItems().stream().map(i -> {
            FoodComponent dec = decoratorService.decorate(i.getFood());
            return MealItemResponse.builder()
                    .foodId(i.getFood().getId()).foodName(i.getFood().getName())
                    .category(i.getFood().getCategory()).quantityGrams(i.getQuantityGrams())
                    .calories(calc.round1(i.getCalories() != null ? i.getCalories() : 0))
                    .protein(calc.round1(i.getProtein()   != null ? i.getProtein()  : 0))
                    .carbs(calc.round1(i.getCarbs()       != null ? i.getCarbs()    : 0))
                    .fat(calc.round1(i.getFat()           != null ? i.getFat()      : 0))
                    .fibre(calc.round1(i.getFibre()       != null ? i.getFibre()    : 0))
                    .sodium(calc.round1(i.getSodium()     != null ? i.getSodium()   : 0))
                    .tags(decoratorService.tagsAsList(dec))
                    .build();
        }).collect(Collectors.toList());
        return MealResponse.builder()
                .id(meal.getId()).mealType(meal.getMealType()).date(meal.getDate())
                .items(items)
                .totalCalories(meal.getTotalCalories()).totalProtein(meal.getTotalProtein())
                .totalCarbs(meal.getTotalCarbs()).totalFat(meal.getTotalFat())
                .totalFibre(meal.getTotalFibre()).totalSodium(meal.getTotalSodium())
                .build();
    }
}
