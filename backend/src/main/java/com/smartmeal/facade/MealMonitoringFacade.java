package com.smartmeal.facade;

import com.smartmeal.dto.MealDtos.*;
import com.smartmeal.model.*;
import com.smartmeal.repository.*;
import com.smartmeal.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ══════════════════════════════════════════════════════════
 * DESIGN PATTERN: FACADE  (Pattern #6)
 * ══════════════════════════════════════════════════════════
 * PROBLEM: Each controller would need to inject and coordinate
 *   MealService, RecommendationService, NutritionCalculator,
 *   MealRepository, UserProfileRepository — 5+ dependencies
 *   per controller, creating tight coupling and complex tests.
 *
 * SOLUTION: MealMonitoringFacade exposes a small, clear API.
 *   All 7 controllers inject ONLY this class. Internal
 *   coordination, error handling and data assembly happen here.
 *
 * USED BY: Every REST controller.
 * ══════════════════════════════════════════════════════════
 */
@Service
@RequiredArgsConstructor
public class MealMonitoringFacade {

    private final MealService mealService;
    private final RecommendationService recommendationService;
    private final NutritionCalculator calc;
    private final UserProfileRepository profileRepo;
    private final UserRepository userRepo;
    private final MealRepository mealRepo;
    private final WeightEntryRepository weightRepo;
    private final FoodRepository foodRepo;

    // ── Meals ────────────────────────────────────────────────────

    public MealResponse logMeal(Long userId, LogMealRequest req) {
        return mealService.logMeal(userId, req);
    }

    public List<MealResponse> getTodaysMeals(Long userId) {
        return mealService.getForDate(userId, LocalDate.now());
    }

    public List<HistoryDayResponse> getHistory(Long userId, LocalDate from, LocalDate to) {
        return mealService.getHistory(userId, from, to);
    }

    // ── Dashboard ────────────────────────────────────────────────

    public DashboardResponse getDashboard(Long userId) {
        LocalDate today = LocalDate.now();
        List<MealResponse> meals = mealService.getForDate(userId, today);
        UserProfile p = profileRepo.findByUserId(userId).orElse(null);

        double calTarget  = p != null ? calc.calculateCalorieTarget(p) : 2000;
        double[] macros   = p != null ? calc.calculateMacroTargets(p) : new double[]{50, 250, 65};

        double calCons  = r(meals.stream().mapToDouble(m -> orZero(m.getTotalCalories())).sum());
        double proCons  = r(meals.stream().mapToDouble(m -> orZero(m.getTotalProtein())).sum());
        double carbCons = r(meals.stream().mapToDouble(m -> orZero(m.getTotalCarbs())).sum());
        double fatCons  = r(meals.stream().mapToDouble(m -> orZero(m.getTotalFat())).sum());

        double pct = calTarget > 0 ? Math.min(100, (calCons / calTarget) * 100) : 0;

        // Build alerts
        List<String> alerts = new ArrayList<>();
        if (pct >= 100) alerts.add("You have reached your daily calorie target.");
        else if (pct >= 90) alerts.add("You are at 90% of your daily calorie target.");
        if (p != null && p.getGoal() != null && "WEIGHT_LOSS".equals(p.getGoal()) && fatCons > macros[2])
            alerts.add("Fat intake exceeded daily target.");

        return DashboardResponse.builder()
                .date(today)
                .calorieTarget(r(calTarget)).caloriesConsumed(calCons).caloriesRemaining(r(Math.max(0, calTarget - calCons)))
                .proteinTarget(r(macros[0])).proteinConsumed(proCons)
                .carbsTarget(r(macros[1])).carbsConsumed(carbCons)
                .fatTarget(r(macros[2])).fatConsumed(fatCons)
                .progressPercent(r(pct))
                .meals(meals)
                .activeGoal(p != null ? p.getGoal() : "BALANCED")
                .alerts(alerts)
                .build();
    }

    // ── Nutrition Targets ─────────────────────────────────────────

    public NutritionTargetResponse getNutritionTargets(Long userId) {
        UserProfile p = profileRepo.findByUserId(userId).orElse(null);
        if (p == null) return NutritionTargetResponse.builder().calorieTarget(2000.0).goal("BALANCED").build();
        double[] macros = calc.calculateMacroTargets(p);
        return NutritionTargetResponse.builder()
                .bmr(r(calc.calculateBMR(p))).tdee(r(calc.calculateTDEE(p)))
                .calorieTarget(r(calc.calculateCalorieTarget(p)))
                .proteinTargetG(r(macros[0])).carbsTargetG(r(macros[1])).fatTargetG(r(macros[2]))
                .goal(p.getGoal()).activityLevel(p.getActivityLevel())
                .build();
    }

    // ── Recommendations ───────────────────────────────────────────

    public List<RecommendationResponse> getRecommendations(Long userId, int limit) {
        return recommendationService.recommend(userId, limit);
    }

    public List<PoshanMenuResponse> getPoshanMenu(String state) {
        return recommendationService.getPoshanMenu(state);
    }

    // ── Profile ───────────────────────────────────────────────────

    public ProfileResponse getProfile(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        UserProfile p = profileRepo.findByUserId(userId).orElse(null);
        return ProfileResponse.builder()
                .userId(userId).username(user.getUsername()).email(user.getEmail())
                .age(p!=null?p.getAge():null).gender(p!=null?p.getGender():null)
                .heightCm(p!=null?p.getHeightCm():null).weightKg(p!=null?p.getWeightKg():null)
                .activityLevel(p!=null?p.getActivityLevel():null).goal(p!=null?p.getGoal():null)
                .dietType(p!=null?p.getDietType():null).allergies(p!=null?p.getAllergies():null)
                .likedFoods(p!=null?p.getLikedFoods():null).dislikedFoods(p!=null?p.getDislikedFoods():null)
                .userType(p!=null?p.getUserType():"GENERAL")
                .build();
    }

    public ProfileResponse updateProfile(Long userId, ProfileRequest req) {
        User user = userRepo.findById(userId).orElseThrow();
        UserProfile p = profileRepo.findByUserId(userId)
                .orElse(UserProfile.builder().user(user).build());
        if (req.getAge()           != null) p.setAge(req.getAge());
        if (req.getGender()        != null) p.setGender(req.getGender());
        if (req.getHeightCm()      != null) p.setHeightCm(req.getHeightCm());
        if (req.getWeightKg()      != null) p.setWeightKg(req.getWeightKg());
        if (req.getActivityLevel() != null) p.setActivityLevel(req.getActivityLevel());
        if (req.getGoal()          != null) p.setGoal(req.getGoal());
        if (req.getDietType()      != null) p.setDietType(req.getDietType());
        if (req.getAllergies()      != null) p.setAllergies(req.getAllergies());
        if (req.getLikedFoods()    != null) p.setLikedFoods(req.getLikedFoods());
        if (req.getDislikedFoods() != null) p.setDislikedFoods(req.getDislikedFoods());
        if (req.getUserType()      != null) p.setUserType(req.getUserType());
        profileRepo.save(p);
        return getProfile(userId);
    }

    // ── Weight ────────────────────────────────────────────────────

    public WeightResponse logWeight(Long userId, WeightRequest req) {
        User user = userRepo.findById(userId).orElseThrow();
        WeightEntry entry = WeightEntry.builder()
                .user(user).weightKg(req.getWeightKg())
                .date(req.getDate() != null ? req.getDate() : LocalDate.now())
                .notes(req.getNotes()).build();
        weightRepo.save(entry);
        return WeightResponse.builder().id(entry.getId()).weightKg(entry.getWeightKg())
                .date(entry.getDate()).notes(entry.getNotes()).build();
    }

    public List<WeightResponse> getWeightHistory(Long userId) {
        return weightRepo.findByUserIdOrderByDateAsc(userId).stream()
                .map(e -> WeightResponse.builder().id(e.getId()).weightKg(e.getWeightKg())
                        .date(e.getDate()).notes(e.getNotes()).build())
                .collect(Collectors.toList());
    }

    // ── Foods ─────────────────────────────────────────────────────

    public List<FoodResponse> searchFoods(String q) {
        var foods = q == null || q.isBlank() ? foodRepo.findAll() : foodRepo.search(q);
        return foods.stream().map(this::toFoodResponse).collect(Collectors.toList());
    }

    public FoodResponse getFoodById(Long id) {
        return foodRepo.findById(id).map(this::toFoodResponse)
                .orElseThrow(() -> new RuntimeException("Food not found"));
    }

    private FoodResponse toFoodResponse(Food f) {
        return FoodResponse.builder()
                .id(f.getId()).name(f.getName()).category(f.getCategory())
                .calories(f.getCaloriesPer100g()).protein(f.getProteinPer100g())
                .carbs(f.getCarbsPer100g()).fat(f.getFatPer100g()).fibre(f.getFibrePer100g())
                .sugar(f.getSugarPer100g()).sodium(f.getSodiumPer100g())
                .isVegetarian(f.getIsVegetarian()).isVegan(f.getIsVegan())
                .isGlutenFree(f.getIsGlutenFree()).allergens(f.getAllergens())
                .isPoshanMeal(f.getIsPoshanMeal()).poshanState(f.getPoshanState())
                .poshanDay(f.getPoshanDay()).poshanMealType(f.getPoshanMealType())
                .tags(List.of()) // decorators applied in recommendation flow
                .build();
    }

    private double r(double v) { return calc.round1(v); }
    private double orZero(Double d) { return d != null ? d : 0; }
}
