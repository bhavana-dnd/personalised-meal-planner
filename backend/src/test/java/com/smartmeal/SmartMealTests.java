package com.smartmeal;

import com.smartmeal.decorator.*;
import com.smartmeal.factory.FoodFactory;
import com.smartmeal.model.*;
import com.smartmeal.observer.*;
import com.smartmeal.service.NutritionCalculator;
import com.smartmeal.singleton.NutritionConfiguration;
import com.smartmeal.strategy.*;
import org.junit.jupiter.api.*;
import org.mockito.Mockito;

import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.*;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.Mockito.*;

/**
 * SmartMeal Design Patterns Test Suite
 * Covers: Singleton, Factory, Strategy, Observer, Decorator, NutritionCalculator
 */
@DisplayName("SmartMeal Design Patterns Tests")
public class SmartMealTests {

    // ════════════════════════════════════════════════════════
    // 1. SINGLETON PATTERN TESTS
    // ════════════════════════════════════════════════════════

    @Nested @DisplayName("Singleton — NutritionConfiguration")
    class SingletonTests {

        @Test @DisplayName("Returns the same instance every time")
        void sameInstance() {
            NutritionConfiguration a = NutritionConfiguration.getInstance();
            NutritionConfiguration b = NutritionConfiguration.getInstance();
            assertThat(a).isSameAs(b);
        }

        @Test @DisplayName("Thread-safe: concurrent access returns same instance")
        void threadSafe() throws Exception {
            int threads = 20;
            ExecutorService pool = Executors.newFixedThreadPool(threads);
            List<Future<NutritionConfiguration>> futures = new java.util.ArrayList<>();
            for (int i = 0; i < threads; i++) {
                futures.add(pool.submit(NutritionConfiguration::getInstance));
            }
            pool.shutdown();
            pool.awaitTermination(5, TimeUnit.SECONDS);
            NutritionConfiguration first = futures.get(0).get();
            futures.forEach(f -> {
                try {
                    assertThat(f.get()).isSameAs(first);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            });
        
        }

        @Test @DisplayName("Activity multipliers are correct")
        void activityMultipliers() {
            NutritionConfiguration cfg = NutritionConfiguration.getInstance();
            assertThat(cfg.getActivityMultiplier("SEDENTARY")).isEqualTo(1.2);
            assertThat(cfg.getActivityMultiplier("MODERATE")).isEqualTo(1.55);
            assertThat(cfg.getActivityMultiplier("VERY_ACTIVE")).isEqualTo(1.9);
        }

        @Test @DisplayName("Calorie adjustments are correct by goal")
        void calorieAdjustments() {
            NutritionConfiguration cfg = NutritionConfiguration.getInstance();
            assertThat(cfg.getCalorieAdjustment("WEIGHT_LOSS")).isEqualTo(-500.0);
            assertThat(cfg.getCalorieAdjustment("MUSCLE_GAIN")).isEqualTo(300.0);
            assertThat(cfg.getCalorieAdjustment("MAINTENANCE")).isEqualTo(0.0);
        }
    }

    // ════════════════════════════════════════════════════════
    // 2. FACTORY PATTERN TESTS
    // ════════════════════════════════════════════════════════

    @Nested @DisplayName("Factory — FoodFactory")
    class FactoryTests {

        private final FoodFactory factory = new FoodFactory();

        @Test @DisplayName("FRUIT: vegan=true, glutenFree=true, no allergens")
        void fruitDefaults() {
            Food f = factory.create("FRUIT","Mango", 60, 0.8, 15, 0.4, 1.6, 14, 1);
            assertThat(f.getIsVegan()).isTrue();
            assertThat(f.getIsVegetarian()).isTrue();
            assertThat(f.getIsGlutenFree()).isTrue();
            assertThat(f.getAllergens()).isBlank();
            assertThat(f.getCategory()).isEqualTo("FRUIT");
        }

        @Test @DisplayName("GRAIN: glutenFree=false, allergens=gluten")
        void grainDefaults() {
            Food f = factory.create("GRAIN","Chapati", 240, 7.5, 40, 4.5, 3.9, 0.5, 270);
            assertThat(f.getIsGlutenFree()).isFalse();
            assertThat(f.getAllergens()).contains("gluten");
        }

        @Test @DisplayName("DAIRY: vegan=false, allergens=dairy")
        void dairyDefaults() {
            Food f = factory.create("DAIRY","Paneer", 265, 18, 3.4, 20, 0, 0.8, 30);
            assertThat(f.getIsVegan()).isFalse();
            assertThat(f.getIsVegetarian()).isTrue();
            assertThat(f.getAllergens()).contains("dairy");
        }

        @Test @DisplayName("MEAT: vegetarian=false, vegan=false")
        void meatDefaults() {
            Food f = factory.create("MEAT","Chicken Breast", 165, 31, 0, 3.6, 0, 0, 74);
            assertThat(f.getIsVegetarian()).isFalse();
            assertThat(f.getIsVegan()).isFalse();
        }

        @Test @DisplayName("PM POSHAN overload sets scheme fields correctly")
        void poshanOverload() {
            Food f = factory.createPoshanMeal(
                "Sambar Rice", "GRAIN", 130, 4.5, 24, 1.5, 2, 0.5, 320,
                "Tamil Nadu", "Monday", "LUNCH", "sambar rice,lentil rice"
            );
            assertThat(f.getIsPoshanMeal()).isTrue();
            assertThat(f.getPoshanState()).isEqualTo("Tamil Nadu");
            assertThat(f.getPoshanDay()).isEqualTo("Monday");
            assertThat(f.getVisionLabels()).contains("sambar rice");
        }

        @Test @DisplayName("Nutrition values are stored correctly")
        void nutritionValues() {
            Food f = factory.create("LEGUME","Dal", 116, 9.0, 20, 0.4, 7.9, 1.8, 238);
            assertThat(f.getCaloriesPer100g()).isEqualTo(116);
            assertThat(f.getProteinPer100g()).isEqualTo(9.0);
            assertThat(f.getFibrePer100g()).isEqualTo(7.9);
        }
    }

    // ════════════════════════════════════════════════════════
    // 3. STRATEGY PATTERN TESTS
    // ════════════════════════════════════════════════════════

    @Nested @DisplayName("Strategy — MealRecommendationStrategy")
    class StrategyTests {

        private final WeightLossStrategy weightLoss = new WeightLossStrategy();
        private final MuscleGainStrategy muscleGain = new MuscleGainStrategy();
        private final MaintenanceStrategy maintenance = new MaintenanceStrategy();
        private final BalancedStrategy balanced = new BalancedStrategy();

        private Food lowCalHighFibre() {
            Food f = new Food();
            f.setName("Spinach"); f.setCategory("VEGETABLE");
            f.setCaloriesPer100g(23.0); f.setProteinPer100g(2.9);
            f.setCarbsPer100g(3.6); f.setFatPer100g(0.4);
            f.setFibrePer100g(6.0); f.setSugarPer100g(0.4); f.setSodiumPer100g(79.0);
            f.setIsVegetarian(true); f.setIsVegan(true); f.setAllergens("");
            return f;
        }

        private Food highProtein() {
            Food f = new Food();
            f.setName("Chicken Breast"); f.setCategory("MEAT");
            f.setCaloriesPer100g(165.0); f.setProteinPer100g(31.0);
            f.setCarbsPer100g(0.0); f.setFatPer100g(3.6);
            f.setFibrePer100g(0.0); f.setSugarPer100g(0.0); f.setSodiumPer100g(74.0);
            f.setIsVegetarian(false); f.setIsVegan(false); f.setAllergens("");
            return f;
        }

        @Test @DisplayName("WeightLoss: prefers low-calorie high-fibre food")
        void weightLossPrefersFibre() {
            int scoreSpinach  = weightLoss.score(lowCalHighFibre(), null, 800);
            int scoreChicken  = weightLoss.score(highProtein(), null, 800);
            assertThat(scoreSpinach).isGreaterThanOrEqualTo(scoreChicken);
        }

        @Test @DisplayName("MuscleGain: prefers high-protein food")
        void muscleGainPrefersProtein() {
            int scoreChicken = muscleGain.score(highProtein(), null, 800);
            int scoreSpinach = muscleGain.score(lowCalHighFibre(), null, 800);
            assertThat(scoreChicken).isGreaterThan(scoreSpinach);
        }

        @Test @DisplayName("All strategies return score between 0 and 100")
        void scoreBounds() {
            Food f = lowCalHighFibre();
            for (MealRecommendationStrategy s : List.of(weightLoss, muscleGain, maintenance, balanced)) {
                int score = s.score(f, null, 500);
                assertThat(score).isBetween(0, 100);
            }
        }

        @Test @DisplayName("RecommendationContext swaps strategy correctly")
        void contextSwap() {
            RecommendationContext ctx = new RecommendationContext(weightLoss, muscleGain, maintenance, balanced);
            ctx.selectForGoal("WEIGHT_LOSS");
            assertThat(ctx.activeGoal()).isEqualTo("WEIGHT_LOSS");
            ctx.selectForGoal("MUSCLE_GAIN");
            assertThat(ctx.activeGoal()).isEqualTo("MUSCLE_GAIN");
        }

        @Test @DisplayName("Explain returns non-empty string for all strategies")
        void explainNotEmpty() {
            Food f = highProtein();
            for (MealRecommendationStrategy s : List.of(weightLoss, muscleGain, maintenance, balanced)) {
                assertThat(s.explain(f, null)).isNotBlank();
            }
        }
    }

    // ════════════════════════════════════════════════════════
    // 4. OBSERVER PATTERN TESTS
    // ════════════════════════════════════════════════════════

    @Nested @DisplayName("Observer — NutritionTracker")
    class ObserverTests {

        @Test @DisplayName("All registered observers are notified")
        void allNotified() {
            NutritionTracker tracker = new NutritionTracker();
            AtomicInteger count = new AtomicInteger();

            NutritionObserver o1 = (m, t, tr) -> count.incrementAndGet();
            NutritionObserver o2 = (m, t, tr) -> count.incrementAndGet();
            NutritionObserver o3 = (m, t, tr) -> count.incrementAndGet();

            tracker.register(o1); tracker.register(o2); tracker.register(o3);

            User user = new User(); user.setId(1L);
            Meal meal = new Meal(); meal.setUser(user); meal.setMealType("LUNCH");
            tracker.notifyAll(meal, 1200, 2000);

            assertThat(count.get()).isEqualTo(3);
        }

        @Test @DisplayName("Unregistered observer is not called")
        void unregister() {
            NutritionTracker tracker = new NutritionTracker();
            AtomicInteger count = new AtomicInteger();
            NutritionObserver obs = (m, t, tr) -> count.incrementAndGet();

            tracker.register(obs);
            tracker.unregister(obs);

            User user = new User(); user.setId(1L);
            Meal meal = new Meal(); meal.setUser(user);
            tracker.notifyAll(meal, 500, 2000);

            assertThat(count.get()).isEqualTo(0);
        }

        @Test @DisplayName("AlertObserver fires on calorie exceed — no exception")
        void alertObserverNoException() {
            AlertObserver alert = new AlertObserver();
            User user = new User(); user.setId(99L);
            Meal meal = new Meal(); meal.setUser(user); meal.setMealType("DINNER");
            assertThatCode(() -> alert.onMealLogged(meal, 2200, 2000)).doesNotThrowAnyException();
        }

        @Test @DisplayName("Observers receive correct calorie data")
        void observersReceiveData() {
            NutritionTracker tracker = new NutritionTracker();
            double[] received = new double[2];
            tracker.register((meal, total, target) -> { received[0] = total; received[1] = target; });

            User user = new User(); user.setId(1L);
            Meal meal = new Meal(); meal.setUser(user);
            tracker.notifyAll(meal, 1500.0, 2000.0);

            assertThat(received[0]).isEqualTo(1500.0);
            assertThat(received[1]).isEqualTo(2000.0);
        }
    }

    // ════════════════════════════════════════════════════════
    // 5. DECORATOR PATTERN TESTS
    // ════════════════════════════════════════════════════════

    @Nested @DisplayName("Decorator — FoodDecorator")
    class DecoratorTests {

        private Food makeFood(double cal, double protein, double fibre) {
            Food f = new Food();
            f.setName("Test Food"); f.setCategory("TEST");
            f.setCaloriesPer100g(cal); f.setProteinPer100g(protein);
            f.setFibrePer100g(fibre); f.setCarbsPer100g(20.0); f.setFatPer100g(5.0);
            return f;
        }

        @Test @DisplayName("BasicFood has empty tags")
        void basicFoodNoTags() {
            FoodComponent c = new BasicFood(makeFood(200, 10, 3));
            assertThat(c.getTags()).isEmpty();
        }

        @Test @DisplayName("HighProtein decorator adds HIGH_PROTEIN tag")
        void highProteinTag() {
            FoodComponent c = new HighProteinDecorator(new BasicFood(makeFood(200, 20, 3)));
            assertThat(c.getTags()).contains("HIGH_PROTEIN");
        }

        @Test @DisplayName("HighFibre decorator adds HIGH_FIBRE tag")
        void highFibreTag() {
            FoodComponent c = new HighFibreDecorator(new BasicFood(makeFood(80, 5, 8)));
            assertThat(c.getTags()).contains("HIGH_FIBRE");
        }

        @Test @DisplayName("LowCalorie decorator adds LOW_CALORIE tag")
        void lowCalorieTag() {
            FoodComponent c = new LowCalorieDecorator(new BasicFood(makeFood(50, 3, 2)));
            assertThat(c.getTags()).contains("LOW_CALORIE");
        }

        @Test @DisplayName("Decorators stack correctly — all three")
        void stackAllThree() {
            FoodComponent c = new BasicFood(makeFood(50, 20, 8));
            c = new HighProteinDecorator(c);
            c = new HighFibreDecorator(c);
            c = new LowCalorieDecorator(c);
            assertThat(c.getTags()).contains("HIGH_PROTEIN","HIGH_FIBRE","LOW_CALORIE");
        }

        @Test @DisplayName("FoodDecoratorService applies correct decorators")
        void serviceAppliesCorrectly() {
            FoodDecoratorService svc = new FoodDecoratorService();
            Food f = makeFood(80, 20, 7); // low cal + high protein + high fibre
            FoodComponent result = svc.decorate(f);
            assertThat(result.getTags()).contains("HIGH_PROTEIN","HIGH_FIBRE","LOW_CALORIE");
        }

        @Test @DisplayName("Description is enriched by each decorator")
        void descriptionEnriched() {
            FoodComponent c = new HighProteinDecorator(
                    new BasicFood(makeFood(200, 25, 3)));
            assertThat(c.getDescription()).contains("protein source");
        }
    }

    // ════════════════════════════════════════════════════════
    // 6. NUTRITION CALCULATOR TESTS
    // ════════════════════════════════════════════════════════

    @Nested @DisplayName("NutritionCalculator")
    class NutritionTests {

        private final NutritionCalculator calc = new NutritionCalculator();

        private UserProfile profile(double weight, double height, int age, String gender,
                                     String activity, String goal) {
            UserProfile p = new UserProfile();
            p.setWeightKg(weight); p.setHeightCm(height); p.setAge(age);
            p.setGender(gender); p.setActivityLevel(activity); p.setGoal(goal);
            return p;
        }

        @Test @DisplayName("BMR is positive for valid profile")
        void bmrPositive() {
            assertThat(calc.calculateBMR(profile(70, 175, 25, "MALE", "MODERATE", "BALANCED")))
                    .isGreaterThan(0);
        }

        @Test @DisplayName("Female BMR is lower than male for same stats")
        void femaleBmrLower() {
            double male   = calc.calculateBMR(profile(70, 170, 25, "MALE",   "MODERATE", "BALANCED"));
            double female = calc.calculateBMR(profile(70, 170, 25, "FEMALE", "MODERATE", "BALANCED"));
            assertThat(female).isLessThan(male);
        }

        @Test @DisplayName("TDEE > BMR for all activity levels")
        void tdeeGtBmr() {
            UserProfile p = profile(70, 175, 25, "MALE", "MODERATE", "BALANCED");
            assertThat(calc.calculateTDEE(p)).isGreaterThan(calc.calculateBMR(p));
        }

        @Test @DisplayName("Weight loss calorie target is below TDEE")
        void weightLossBeforeTdee() {
            UserProfile p = profile(80, 175, 28, "MALE", "MODERATE", "WEIGHT_LOSS");
            assertThat(calc.calculateCalorieTarget(p)).isLessThan(calc.calculateTDEE(p));
        }

        @Test @DisplayName("Muscle gain calorie target is above TDEE")
        void muscleGainAboveTdee() {
            UserProfile p = profile(70, 175, 22, "MALE", "ACTIVE", "MUSCLE_GAIN");
            assertThat(calc.calculateCalorieTarget(p)).isGreaterThan(calc.calculateTDEE(p));
        }

        @Test @DisplayName("Nutrition scales correctly by quantity")
        void nutritionScaling() {
            // 200g of a food with 100kcal/100g = 200 kcal
            assertThat(calc.scale(100.0, 200)).isEqualTo(200.0);
            assertThat(calc.scale(25.0, 50)).isEqualTo(12.5);
        }

        @Test @DisplayName("Macro targets sum approximately to calorie target")
        void macrosSumToCalories() {
            UserProfile p = profile(70, 175, 25, "MALE", "MODERATE", "BALANCED");
            double[] macros = calc.calculateMacroTargets(p);
            // protein*4 + carbs*4 + fat*9 ≈ calorieTarget
            double fromMacros = macros[0]*4 + macros[1]*4 + macros[2]*9;
            double target = calc.calculateCalorieTarget(p);
            assertThat(fromMacros).isCloseTo(target, org.assertj.core.data.Offset.offset(5.0));
        }

        @Test @DisplayName("Null nutrition values scale to 0")
        void nullScalesToZero() {
            assertThat(calc.scale(null, 100)).isEqualTo(0.0);
        }
    }
}
