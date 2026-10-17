package com.smartmeal.config;

import com.smartmeal.factory.FoodFactory;
import com.smartmeal.model.*;
import com.smartmeal.observer.*;
import com.smartmeal.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

/**
 * Seeds all data on startup.
 * FACTORY PATTERN: every food created via FoodFactory.create()
 * OBSERVER PATTERN: all 3 observers registered into NutritionTracker here.
 *
 * PM POSHAN menu data sourced from:
 *   Ministry of Education, Dept of School Education & Literacy
 *   PM POSHAN Scheme (formerly Mid-Day Meal Scheme)
 *   State menus for Tamil Nadu, Maharashtra, Karnataka, UP, West Bengal.
 *
 * DISCLAIMER: Nutrition values are approximate per 100g.
 * Not clinically validated. For educational/demo purposes only.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final FoodFactory factory;
    private final FoodRepository foodRepo;
    private final UserRepository userRepo;
    private final UserProfileRepository profileRepo;
    private final WeightEntryRepository weightRepo;
    private final PasswordEncoder encoder;
    private final NutritionTracker tracker;
    private final DashboardObserver dashboardObs;
    private final AlertObserver alertObs;
    private final RecommendationObserver recObs;

    @Override
    public void run(String... args) {

        // ── Register Observers (OBSERVER PATTERN) ──────────────────
        tracker.register(dashboardObs);
        tracker.register(alertObs);
        tracker.register(recObs);
        log.info("✅ Observer pattern: DashboardObserver, AlertObserver, RecommendationObserver registered");

        if (foodRepo.count() > 0) {
            log.info("✅ Database already seeded — skipping");
            return;
        }

        // ══════════════════════════════════════════════════════════
        // SECTION 1: General Indian Foods  (FACTORY PATTERN)
        // create(category, name, cal, protein, carbs, fat, fibre, sugar, sodium)
        // ══════════════════════════════════════════════════════════

        // FRUITS
        foodRepo.save(factory.create("FRUIT","Apple",         52, 0.3, 14.0, 0.2, 2.4, 10.0,  1));
        foodRepo.save(factory.create("FRUIT","Banana",        89, 1.1, 23.0, 0.3, 2.6, 12.0,  1));
        foodRepo.save(factory.create("FRUIT","Mango",         60, 0.8, 15.0, 0.4, 1.6, 14.0,  1));
        foodRepo.save(factory.create("FRUIT","Papaya",        43, 0.5, 11.0, 0.3, 1.7,  8.0,  8));
        foodRepo.save(factory.create("FRUIT","Guava",         68, 2.6, 14.0, 1.0, 5.4,  9.0,  2));
        foodRepo.save(factory.create("FRUIT","Watermelon",    30, 0.6,  8.0, 0.2, 0.4,  6.0,  1));

        // VEGETABLES
        foodRepo.save(factory.create("VEGETABLE","Spinach (Palak)",    23, 2.9,  3.6, 0.4, 2.2, 0.4, 79));
        foodRepo.save(factory.create("VEGETABLE","Broccoli",           34, 2.8,  7.0, 0.4, 2.6, 1.7, 33));
        foodRepo.save(factory.create("VEGETABLE","Carrot",             41, 0.9,  9.6, 0.2, 2.8, 4.7, 69));
        foodRepo.save(factory.create("VEGETABLE","Tomato",             18, 0.9,  3.9, 0.2, 1.2, 2.6,  5));
        foodRepo.save(factory.create("VEGETABLE","Potato",             77, 2.0, 17.0, 0.1, 2.2, 0.8,  6));
        foodRepo.save(factory.create("VEGETABLE","Bhindi (Okra)",      33, 1.9,  7.5, 0.2, 3.2, 1.5,  8));
        foodRepo.save(factory.create("VEGETABLE","Cauliflower",        25, 1.9,  5.0, 0.3, 2.0, 1.9, 30));
        foodRepo.save(factory.create("VEGETABLE","Onion",              40, 1.1,  9.3, 0.1, 1.7, 4.2,  4));
        foodRepo.save(factory.create("VEGETABLE","Bitter Gourd",       17, 1.0,  3.7, 0.2, 2.8, 1.7,  5));

        // GRAINS
        foodRepo.save(factory.create("GRAIN","Basmati Rice (cooked)", 130, 2.7, 28.0, 0.3, 0.4, 0.0,  1));
        foodRepo.save(factory.create("GRAIN","Brown Rice (cooked)",   111, 2.6, 23.0, 0.9, 1.8, 0.0,  5));
        foodRepo.save(factory.create("GRAIN","Chapati / Roti",        240, 7.5, 40.0, 4.5, 3.9, 0.5,270));
        foodRepo.save(factory.create("GRAIN","Oats",                  389,16.9, 66.0, 6.9,10.6, 1.0,  6));
        foodRepo.save(factory.create("GRAIN","Poha (Flattened Rice)", 130, 2.6, 28.0, 0.4, 0.9, 0.0,  5));
        foodRepo.save(factory.create("GRAIN","Idli (steamed)",         39, 2.0,  8.0, 0.1, 0.4, 0.3,250));
        foodRepo.save(factory.create("GRAIN","Dosa",                  168, 3.9, 25.0, 6.0, 1.1, 0.5,320));
        foodRepo.save(factory.create("GRAIN","Upma",                  135, 3.5, 21.0, 4.5, 1.5, 0.5,180));
        foodRepo.save(factory.create("GRAIN","Wheat Bread (whole)",   247,13.0, 41.0, 3.4, 6.0, 5.0,472));

        // DAIRY
        foodRepo.save(factory.create("DAIRY","Milk (Whole, toned)",    61, 3.2,  4.8, 3.3, 0.0, 4.8, 44));
        foodRepo.save(factory.create("DAIRY","Paneer (cottage cheese)",265,18.0,  3.4,20.0, 0.0, 0.8, 30));
        foodRepo.save(factory.create("DAIRY","Curd / Dahi",            61, 3.5,  4.7, 3.3, 0.0, 4.7, 46));
        foodRepo.save(factory.create("DAIRY","Egg",                   155,13.0,  1.1,11.0, 0.0, 1.1,124));
        foodRepo.save(factory.create("DAIRY","Buttermilk (Chaas)",     40, 3.3,  5.0, 1.0, 0.0, 4.5, 50));

        // MEAT & FISH
        foodRepo.save(factory.create("MEAT","Chicken Breast (cooked)",165,31.0,  0.0, 3.6, 0.0, 0.0, 74));
        foodRepo.save(factory.create("MEAT","Tuna (canned)",          132,28.0,  0.0, 1.3, 0.0, 0.0, 47));
        foodRepo.save(factory.create("MEAT","Salmon",                 208,20.0,  0.0,13.0, 0.0, 0.0, 59));
        foodRepo.save(factory.create("MEAT","Mutton (cooked)",        294,25.0,  0.0,21.0, 0.0, 0.0, 72));

        // LEGUMES
        foodRepo.save(factory.create("LEGUME","Dal (Toor/Yellow)",    116, 9.0, 20.0, 0.4, 7.9, 1.8,238));
        foodRepo.save(factory.create("LEGUME","Chana Dal",            164, 8.9, 27.0, 2.6, 7.6, 4.8, 24));
        foodRepo.save(factory.create("LEGUME","Rajma (Kidney Beans)", 127, 8.7, 22.8, 0.5, 6.4, 0.3, 45));
        foodRepo.save(factory.create("LEGUME","Moong Dal",            105, 7.0, 18.0, 0.4, 4.1, 1.5, 15));
        foodRepo.save(factory.create("LEGUME","Chole (Chickpeas)",    164, 8.9, 27.0, 2.6, 7.6, 4.8, 24));
        foodRepo.save(factory.create("LEGUME","Peanuts",              567,25.8, 16.0,49.0, 8.5, 4.0, 18));

        // SNACKS
        foodRepo.save(factory.create("SNACK","Almonds",               579,21.0, 22.0,50.0,12.5, 4.4,  1));
        foodRepo.save(factory.create("SNACK","Banana Chips",          519, 2.3, 58.0,33.0, 4.3,22.0,102));
        foodRepo.save(factory.create("SNACK","Roasted Chana",         364,19.3, 61.0, 5.0, 8.2, 8.0, 24));

        // BEVERAGES
        foodRepo.save(factory.create("BEVERAGE","Coconut Water",       19, 0.7,  3.7, 0.2, 1.1, 2.6,105));
        foodRepo.save(factory.create("BEVERAGE","Lassi (sweet)",        70, 3.5,  9.0, 2.0, 0.0, 8.5, 50));
        foodRepo.save(factory.create("BEVERAGE","Green Tea",             1, 0.0,  0.2, 0.0, 0.0, 0.0,  1));

        log.info("✅ Factory pattern: {} general foods created via FoodFactory", foodRepo.count());

        // ══════════════════════════════════════════════════════════
        // SECTION 2: PM POSHAN Mid-Day Meal Menu
        // Source: Ministry of Education PM POSHAN Scheme Guidelines
        // State-wise weekly menus (Mon–Sat)
        // Nutrition values approximate per 100g cooked portion.
        // ══════════════════════════════════════════════════════════

        // ── TAMIL NADU ─────────────────────────────────────────────
        // Samacheer Kalvi noon meal programme — typical weekly menu
        savePM("Sambar Rice (TN)",              "GRAIN",  130, 4.5, 24.0, 1.5, 2.0, 0.5,320,
               "Tamil Nadu","Monday","LUNCH","sambar rice,lentil rice,south indian rice");
        savePM("Pongal with Sambar (TN)",       "GRAIN",  145, 4.0, 27.0, 2.5, 1.5, 0.3,280,
               "Tamil Nadu","Tuesday","LUNCH","pongal,khichdi,rice porridge");
        savePM("Tamarind Rice (Puliyodarai)",   "GRAIN",  160, 2.8, 30.0, 3.5, 1.2, 0.5,310,
               "Tamil Nadu","Wednesday","LUNCH","tamarind rice,puliyodarai,tangy rice");
        savePM("Tomato Rice with Papad (TN)",   "GRAIN",  135, 3.2, 25.0, 2.5, 1.3, 2.0,270,
               "Tamil Nadu","Thursday","LUNCH","tomato rice,south indian rice");
        savePM("Curd Rice (Thayir Sadam)",      "DAIRY",  120, 3.8, 20.0, 2.8, 0.3, 1.5,150,
               "Tamil Nadu","Friday","LUNCH","curd rice,yogurt rice,dahi chawal");
        savePM("Lemon Rice (Chitranna TN)",     "GRAIN",  140, 2.7, 26.0, 3.0, 0.8, 0.5,230,
               "Tamil Nadu","Saturday","LUNCH","lemon rice,chitranna,yellow rice");

        // ── MAHARASHTRA ───────────────────────────────────────────
        // State government prescribed mid-day meal menu
        savePM("Khichdi with Vegetables (MH)",  "GRAIN",  138, 5.5, 24.0, 2.5, 3.0, 0.8,230,
               "Maharashtra","Monday","LUNCH","khichdi,rice dal,mixed rice");
        savePM("Roti with Dal (MH)",            "GRAIN",  210, 8.5, 36.0, 3.5, 4.5, 0.5,290,
               "Maharashtra","Tuesday","LUNCH","roti dal,chapati lentil,indian bread");
        savePM("Varan Bhaat (MH)",              "GRAIN",  145, 6.5, 26.0, 1.8, 3.5, 0.5,200,
               "Maharashtra","Wednesday","LUNCH","varan bhaat,maharashtra dal rice,toor dal rice");
        savePM("Poha with Peanuts (MH)",        "GRAIN",  165, 4.5, 28.0, 4.5, 1.8, 0.5,180,
               "Maharashtra","Thursday","BREAKFAST","poha,flattened rice,beaten rice");
        savePM("Upma with Vegetables (MH)",     "GRAIN",  135, 3.5, 21.0, 4.5, 2.0, 0.5,200,
               "Maharashtra","Friday","BREAKFAST","upma,semolina breakfast,rava upma");
        savePM("Chana Dal Rice (MH)",           "LEGUME", 155, 7.5, 26.0, 2.0, 4.5, 0.5,210,
               "Maharashtra","Saturday","LUNCH","chana dal,bengal gram rice,chickpea rice");

        // ── KARNATAKA ─────────────────────────────────────────────
        savePM("Chitranna (Lemon Rice, KA)",    "GRAIN",  140, 2.7, 26.0, 3.0, 0.8, 0.5,230,
               "Karnataka","Monday","LUNCH","chitranna,lemon rice,yellow rice");
        savePM("Bisibelebath (KA)",             "GRAIN",  148, 5.8, 25.0, 2.8, 3.2, 1.0,310,
               "Karnataka","Tuesday","LUNCH","bisibelebath,sambar rice,lentil rice");
        savePM("Jolada Roti with Palya (KA)",   "GRAIN",  190, 6.5, 35.0, 3.0, 5.0, 0.5,180,
               "Karnataka","Wednesday","LUNCH","jowar roti,sorghum flatbread,millet roti");
        savePM("Avalakki (Poha, KA)",           "GRAIN",  155, 3.8, 27.0, 3.8, 1.5, 0.5,165,
               "Karnataka","Thursday","BREAKFAST","avalakki,poha,beaten rice");
        savePM("Pongal with Coconut Chutney",   "GRAIN",  160, 4.5, 28.0, 3.5, 1.8, 0.5,200,
               "Karnataka","Friday","BREAKFAST","pongal,rice porridge,ven pongal");
        savePM("Mudde (Ragi Ball) with Sambar", "GRAIN",  177, 5.5, 38.0, 1.5, 3.5, 0.5,230,
               "Karnataka","Saturday","LUNCH","ragi mudde,finger millet,ragi ball");

        // ── UTTAR PRADESH ─────────────────────────────────────────
        savePM("Dal Chawal (UP)",               "GRAIN",  148, 6.5, 26.0, 1.8, 3.0, 0.5,250,
               "Uttar Pradesh","Monday","LUNCH","dal rice,lentil rice,north indian dal");
        savePM("Roti Sabzi (UP)",               "GRAIN",  195, 6.8, 35.0, 3.5, 4.0, 0.8,280,
               "Uttar Pradesh","Tuesday","LUNCH","roti sabzi,chapati vegetables,indian flatbread");
        savePM("Khichdi with Ghee (UP)",        "GRAIN",  155, 5.8, 25.0, 3.5, 2.8, 0.5,220,
               "Uttar Pradesh","Wednesday","LUNCH","khichdi,dal rice,lentil porridge");
        savePM("Chana Masala Rice (UP)",        "LEGUME", 168, 7.8, 28.0, 2.8, 4.5, 1.0,280,
               "Uttar Pradesh","Thursday","LUNCH","chana masala,chickpea curry,chole");
        savePM("Dalia (Broken Wheat) Porridge", "GRAIN",  127, 5.0, 24.0, 1.5, 4.5, 0.5,120,
               "Uttar Pradesh","Friday","BREAKFAST","dalia,broken wheat,daliya");
        savePM("Rajma Chawal (UP)",             "LEGUME", 158, 8.5, 26.5, 2.0, 5.0, 0.8,270,
               "Uttar Pradesh","Saturday","LUNCH","rajma chawal,kidney bean rice,rajma rice");

        // ── WEST BENGAL ───────────────────────────────────────────
        savePM("Khichuri (WB)",                 "GRAIN",  148, 6.2, 25.5, 2.5, 3.5, 0.5,230,
               "West Bengal","Monday","LUNCH","khichuri,bengali khichdi,dal rice porridge");
        savePM("Dal Bhaat with Sabji (WB)",     "GRAIN",  145, 6.0, 26.0, 1.5, 3.0, 0.5,220,
               "West Bengal","Tuesday","LUNCH","dal bhat,rice lentil,bengali dal");
        savePM("Ruti Torkari (WB)",             "GRAIN",  195, 6.5, 34.0, 4.0, 3.8, 0.8,275,
               "West Bengal","Wednesday","LUNCH","ruti,bengali roti,bengali flatbread");
        savePM("Muri Ghonto Bhaat (WB)",        "GRAIN",  155, 8.0, 22.0, 3.5, 2.5, 0.5,250,
               "West Bengal","Thursday","LUNCH","muri ghonto,fish head rice,bengali rice");
        savePM("Cholar Dal with Luchi (WB)",    "LEGUME", 248,10.0, 38.0, 7.0, 5.5, 1.5,310,
               "West Bengal","Friday","LUNCH","cholar dal,bengali chana dal,puri dal");
        savePM("Sabji Diye Khichuri (WB)",      "GRAIN",  155, 6.5, 26.0, 2.8, 3.8, 0.8,240,
               "West Bengal","Saturday","LUNCH","vegetable khichdi,mixed khichuri,sabji khichdi");

        long total = foodRepo.count();
        log.info("✅ Factory pattern: {} total foods in database ({} PM POSHAN meals)", total,
                 foodRepo.findByIsPoshanMealTrue().size());

        // ══════════════════════════════════════════════════════════
        // SECTION 3: Demo Users
        // ══════════════════════════════════════════════════════════

        // Demo user 1 — general user, weight loss goal
        if (!userRepo.existsByUsername("demo")) {
            User demo = userRepo.save(User.builder()
                    .username("demo").email("demo@smartmeal.com")
                    .password(encoder.encode("demo123")).build());
            profileRepo.save(UserProfile.builder().user(demo)
                    .age(24).gender("MALE").heightCm(175.0).weightKg(78.0)
                    .activityLevel("MODERATE").goal("WEIGHT_LOSS").dietType("NONE")
                    .allergies("").likedFoods("chicken breast,brown rice,spinach,oats")
                    .dislikedFoods("bitter gourd").userType("GENERAL").build());
            weightRepo.save(WeightEntry.builder().user(demo).weightKg(80.0).date(LocalDate.now().minusDays(21)).build());
            weightRepo.save(WeightEntry.builder().user(demo).weightKg(79.0).date(LocalDate.now().minusDays(14)).build());
            weightRepo.save(WeightEntry.builder().user(demo).weightKg(78.5).date(LocalDate.now().minusDays(7)).build());
            weightRepo.save(WeightEntry.builder().user(demo).weightKg(78.0).date(LocalDate.now()).build());
        }

        // Demo user 2 — vegetarian, muscle gain
        if (!userRepo.existsByUsername("priya")) {
            User priya = userRepo.save(User.builder()
                    .username("priya").email("priya@smartmeal.com")
                    .password(encoder.encode("priya123")).build());
            profileRepo.save(UserProfile.builder().user(priya)
                    .age(21).gender("FEMALE").heightCm(162.0).weightKg(55.0)
                    .activityLevel("ACTIVE").goal("MUSCLE_GAIN").dietType("VEGETARIAN")
                    .allergies("dairy").likedFoods("paneer,chole,dal,moong dal")
                    .dislikedFoods("").userType("GENERAL").build());
        }

        // Demo user 3 — school nutrition monitor (PM POSHAN)
        if (!userRepo.existsByUsername("poshan_monitor")) {
            User monitor = userRepo.save(User.builder()
                    .username("poshan_monitor").email("monitor@poshan.gov.in")
                    .password(encoder.encode("poshan123")).build());
            profileRepo.save(UserProfile.builder().user(monitor)
                    .age(30).gender("FEMALE").heightCm(160.0).weightKg(58.0)
                    .activityLevel("LIGHT").goal("MAINTENANCE").dietType("VEGETARIAN")
                    .allergies("").likedFoods("").dislikedFoods("")
                    .userType("CHILD_POSHAN").build());
        }

        log.info("✅ Demo users: demo/demo123 | priya/priya123 | poshan_monitor/poshan123");
        log.info("✅ SmartMeal database seeded successfully");
    }

    /** Shorthand to save a PM POSHAN meal via FoodFactory */
    private void savePM(String name, String category,
                        double cal, double protein, double carbs, double fat,
                        double fibre, double sugar, double sodium,
                        String state, String day, String mealType, String visionLabels) {
        Food f = factory.createPoshanMeal(name, category,
                cal, protein, carbs, fat, fibre, sugar, sodium,
                state, day, mealType, visionLabels);
        foodRepo.save(f);
    }
}
