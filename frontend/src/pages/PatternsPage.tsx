import { useState } from 'react'
import { Cpu, ChevronDown, ChevronUp, Code2, BookOpen, Layers } from 'lucide-react'

const patterns = [
  {
    id: 1,
    name: 'Singleton',
    emoji: '🔒',
    class: 'NutritionConfiguration',
    package: 'com.smartmeal.singleton',
    problem:
      'BMR/TDEE constants and macro split ratios must be identical across NutritionCalculator and all 4 Strategy implementations. Without a Singleton, each class holds its own copy and can drift.',
    solution:
      'One shared, immutable instance with double-checked locking + volatile for thread safety. All callers use NutritionConfiguration.getInstance().',
    flow: 'NutritionCalculator → getInstance() → getActivityMultiplier() / getMacroSplit()',
    code: `public class NutritionConfiguration {
  private static volatile NutritionConfiguration instance;

  private NutritionConfiguration() {}  // private constructor

  public static NutritionConfiguration getInstance() {
    if (instance == null) {
      synchronized (NutritionConfiguration.class) {
        if (instance == null) {
          instance = new NutritionConfiguration(); // double-checked
        }
      }
    }
    return instance;
  }
  // BMR multipliers, macro splits, POSHAN norms...
}`,
  },
  {
    id: 2,
    name: 'Factory',
    emoji: '🏭',
    class: 'FoodFactory',
    package: 'com.smartmeal.factory',
    problem:
      'Creating Food objects requires 15+ fields. Each category has different dietary defaults: MEAT is never vegan, GRAIN always has gluten, FRUIT is always gluten-free. Duplicating this across DataSeeder and any import service violates DRY.',
    solution:
      'FoodFactory.create(category, ...) dispatches to a private category builder. Adding a new category is one new method — zero changes to callers.',
    flow: 'DataSeeder → FoodFactory.create("GRAIN", ...) → grain() → Food.builder()...gluten=true',
    code: `public Food create(String category, String name, double cal, ...) {
  return switch (category.toUpperCase()) {
    case "FRUIT"     -> fruit(name, cal, ...);   // vegan=true, glutenFree=true
    case "GRAIN"     -> grain(name, cal, ...);   // glutenFree=false, allergens="gluten"
    case "DAIRY"     -> dairy(name, cal, ...);   // vegan=false, allergens="dairy"
    case "MEAT"      -> meat(name, cal, ...);    // vegetarian=false, vegan=false
    // ...
  };
}

// PM POSHAN overload
public Food createPoshanMeal(String name, ..., String state, String day) {
  Food f = create(category, name, ...);
  f.setIsPoshanMeal(true); f.setPoshanState(state); f.setPoshanDay(day);
  return f;
}`,
  },
  {
    id: 3,
    name: 'Strategy',
    emoji: '⚡',
    class: 'MealRecommendationStrategy + RecommendationContext',
    package: 'com.smartmeal.strategy',
    problem:
      "Recommendation scoring differs completely by goal: weight loss prefers low-calorie + high-fibre foods; muscle gain prefers high-protein + calorie-dense foods. Without Strategy, this becomes a 100-line if-else block. Adding a new goal means editing existing tested code.",
    solution:
      "4 concrete strategy classes. RecommendationContext holds the active one and swaps it at runtime when the user's goal is loaded. RecommendationService calls score() + explain() without knowing which strategy is active.",
    flow: 'User goal=WEIGHT_LOSS → context.selectForGoal() → WeightLossStrategy.score(food) → ranked list',
    code: `// Interface
public interface MealRecommendationStrategy {
  int score(Food food, UserProfile profile, double remainingKcal);
  String explain(Food food, UserProfile profile);
}

// Context swaps at runtime
public void selectForGoal(String goal) {
  this.strategy = switch (goal.toUpperCase()) {
    case "WEIGHT_LOSS"  -> weightLossStrategy;
    case "MUSCLE_GAIN"  -> muscleGainStrategy;
    case "MAINTENANCE"  -> maintenanceStrategy;
    default             -> balancedStrategy;
  };
}

// RecommendationService — doesn't know which strategy is active
int score = context.score(food, profile, remaining);
String reason = context.explain(food, profile);`,
  },
  {
    id: 4,
    name: 'Observer',
    emoji: '👁',
    class: 'NutritionTracker (Subject) + 3 Observers',
    package: 'com.smartmeal.observer',
    problem:
      "After a meal is logged, 3 subsystems must react: Dashboard totals refresh, Alert checks run, Recommendations invalidate. If MealService calls each directly, it's tightly coupled to every consumer. Adding a 4th observer (e.g. streak tracker) means editing MealService.",
    solution:
      'MealService fires one event on NutritionTracker (Subject). DashboardObserver, AlertObserver, RecommendationObserver each handle their concern independently.',
    flow: 'MealService.save() → tracker.notifyAll() → [DashboardObs, AlertObs, RecObs].onMealLogged()',
    code: `// Subject
@Component
public class NutritionTracker {
  private final List<NutritionObserver> observers = new ArrayList<>();
  public void register(NutritionObserver o) { observers.add(o); }
  public void notifyAll(Meal meal, double total, double target) {
    observers.forEach(o -> o.onMealLogged(meal, total, target));
  }
}

// MealService — one call, three listeners
tracker.notifyAll(meal, todayTotal, target);  // ← single line fires all 3

// AlertObserver reacts independently
public void onMealLogged(Meal meal, double total, double target) {
  if (total / target >= 1.0)
    log.warn("⚠ User {} EXCEEDED daily calorie target!", userId);
}`,
  },
  {
    id: 5,
    name: 'Decorator',
    emoji: '🎨',
    class: 'FoodDecorator → HighProtein / HighFibre / LowCalorie',
    package: 'com.smartmeal.decorator',
    problem:
      'Foods need dynamic characteristic badges for filtering and UI display. A naive approach creates a subclass for every combination: HighProteinLowCalorieGrain, HighFibreFruit, etc. With 3 characteristics that is already 8 subclasses — exponential explosion.',
    solution:
      'BasicFood wrapped with any decorators at runtime. FoodDecoratorService stacks them based on actual nutrition values. Each decorator adds its tag and enriches the description.',
    flow: 'FoodDecoratorService.decorate(food) → BasicFood → HighProteinDecorator → HighFibreDecorator → tags=["HIGH_PROTEIN","HIGH_FIBRE"]',
    code: `// FoodDecoratorService stacks decorators
public FoodComponent decorate(Food food) {
  FoodComponent c = new BasicFood(food);
  if (food.getProteinPer100g() > 15)  c = new HighProteinDecorator(c);
  if (food.getFibrePer100g()   > 5)   c = new HighFibreDecorator(c);
  if (food.getCaloriesPer100g()< 100) c = new LowCalorieDecorator(c);
  return c;  // any combination, no subclass needed
}

// Each decorator adds its tag and description
public class HighProteinDecorator extends FoodDecorator {
  @Override public String getTags() {
    return wrapped.getTags() + "HIGH_PROTEIN,";  // stacks
  }
  @Override public String getDescription() {
    return wrapped.getDescription() + " · Excellent protein source";
  }
}`,
  },
  {
    id: 6,
    name: 'Facade',
    emoji: '🎭',
    class: 'MealMonitoringFacade',
    package: 'com.smartmeal.facade',
    problem:
      'Each controller would need to inject and coordinate MealService, RecommendationService, NutritionCalculator, 3 repositories — 5+ dependencies per controller. Testing becomes complex. Any subsystem restructuring breaks all controllers.',
    solution:
      'MealMonitoringFacade exposes a small, clear API. All 7 REST controllers inject only this class. Internal coordination, data assembly and error handling happen inside the Facade.',
    flow: 'DashboardController → facade.getDashboard() → [MealService + NutritionCalculator + ProfileRepo + AlertBuilder]',
    code: `// Every controller injects ONLY the facade
@RestController
public class DashboardController {
  private final MealMonitoringFacade facade;  // single dependency

  @GetMapping("/api/dashboard")
  public ResponseEntity<?> get(Authentication auth) {
    return ResponseEntity.ok(facade.getDashboard(userId)); // one call
  }
}

// Facade coordinates internally — controllers never know the details
public DashboardResponse getDashboard(Long userId) {
  List<MealResponse> meals  = mealService.getForDate(userId, today);
  double calTarget           = calc.calculateCalorieTarget(profile);
  double[] macros            = calc.calculateMacroTargets(profile);
  List<String> alerts        = buildAlerts(meals, calTarget);
  return DashboardResponse.builder()...build();
}`,
  },
]

export default function PatternsPage() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#EDE8E3]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFB7B2] border border-[#FF9E99] px-2.5 py-0.5 rounded-full uppercase font-bold">
              [ 10 // GOF PATTERNS & ARCHITECTURE ]
            </span>
            <span className="font-serif italic text-sm text-[#78716C]">
              software engineering rigor · clean decoupling
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-light text-[#292524] tracking-tight font-serif">
            Architecture & <em className="italic font-normal text-[#FF8577]">patterns</em>
          </h1>
          <p className="text-sm text-[#78716C] mt-2 font-sans max-w-2xl leading-relaxed">
            Object-Oriented Software Engineering (ISWE404L) Gang of Four (GoF) design patterns implemented in SmartMeal backend.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#78716C] bg-white border border-[#EDE8E3] px-3.5 py-2 rounded-full shadow-soft">
          <Cpu className="w-4 h-4 text-[#FF8577]" />
          <span>6 GOF PATTERNS ACTIVE</span>
        </div>
      </div>

      {/* System Architecture */}
      <div className="card rounded-[24px] p-6 space-y-4 shadow-soft bg-white border border-[#EDE8E3]">
        <div className="flex items-center justify-between pb-2 border-b border-[#EDE8E3]">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#FF8577]" />
            <h2 className="font-serif text-2xl font-light text-[#292524] tracking-tight">System layered architecture</h2>
          </div>
          <span className="font-serif italic text-xs text-[#78716C]">clean separation of concerns</span>
        </div>
        <div className="space-y-2.5 text-xs sm:text-sm font-mono">
          {[
            {
              layer: 'Frontend Layer',
              desc: 'React 18 + TypeScript + Vite + Tailwind CSS + Recharts',
              border: 'border-l-2 border-[#FFB7B2]',
            },
            {
              layer: 'REST API & Security',
              desc: 'Spring Boot 3.2 · JWT Auth · CORS · Global Exception Handler',
              border: 'border-l-2 border-[#EDE8E3]',
            },
            {
              layer: 'Controller Layer (Thin)',
              desc: 'AuthController, DashboardController, MealController, FoodController, ScanController, PoshanController, WeightController',
              border: 'border-l-2 border-[#EDE8E3]',
            },
            {
              layer: 'Facade Layer',
              desc: 'MealMonitoringFacade — Single unified entry point decoupling controllers from services',
              border: 'border-l-2 border-[#FFB7B2]',
            },
            {
              layer: 'Service Layer',
              desc: 'MealService (Observer) · RecommendationService (Strategy+Decorator) · FoodScanService (Vision API) · NutritionCalculator (Singleton)',
              border: 'border-l-2 border-[#EDE8E3]',
            },
            {
              layer: 'Pattern Subsystems',
              desc: 'Factory · Strategy · Observer · Decorator · Singleton implementations',
              border: 'border-l-2 border-[#FFB7B2]',
            },
            {
              layer: 'Data Persistence',
              desc: 'Spring Data JPA Repositories — User, Food, Meal, WeightEntry, ScanHistory',
              border: 'border-l-2 border-[#EDE8E3]',
            },
            {
              layer: 'Database Storage',
              desc: 'PostgreSQL (Production) · H2 in-memory (Development/Testing)',
              border: 'border-l-2 border-[#EDE8E3]',
            },
          ].map(({ layer, desc, border }) => (
            <div key={layer} className={`${border} bg-[#FAF8F5] px-4 py-3 rounded-r-2xl border-y border-r border-[#EDE8E3] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-1`}>
              <span className="text-[#292524] font-bold">{layer}:</span>
              <span className="text-[#78716C] font-sans text-xs">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vision Flow & Poshan integration banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card rounded-[24px] p-6 bg-white border border-[#EDE8E3] space-y-2 shadow-soft">
          <div className="flex items-center justify-between pb-1 border-b border-[#EDE8E3]">
            <h3 className="font-serif text-xl font-light text-[#292524]">
              Food scan flow (Vision API)
            </h3>
            <span className="font-mono text-[10px] text-[#292524] bg-[#FFB7B2] border border-[#FF9E99] px-2 py-0.5 rounded-full font-bold uppercase">[ DECORATOR TAGGED ]</span>
          </div>
          <p className="text-xs text-[#78716C] leading-relaxed font-sans pt-1">
            User captures dish image → Base64 payload to <code className="text-xs font-mono bg-[#FAF8F5] px-2 py-0.5 rounded-lg border border-[#EDE8E3] text-[#292524] font-semibold">ScanController</code> → Google Vision API detects label annotations → Matched with food database keywords → Decorator adds dynamic tags.
          </p>
        </div>

        <div className="card rounded-[24px] p-6 bg-white border border-[#EDE8E3] space-y-2 shadow-soft">
          <div className="flex items-center justify-between pb-1 border-b border-[#EDE8E3]">
            <h3 className="font-serif text-xl font-light text-[#292524]">
              PM POSHAN scheme integration
            </h3>
            <span className="font-mono text-[10px] text-[#292524] bg-[#FFB7B2] border border-[#FF9E99] px-2 py-0.5 rounded-full font-bold uppercase">[ FACTORY CREATED ]</span>
          </div>
          <p className="text-xs text-[#78716C] leading-relaxed font-sans pt-1">
            Seeded via <code className="text-xs font-mono bg-[#FAF8F5] px-2 py-0.5 rounded-lg border border-[#EDE8E3] text-[#292524] font-semibold">FoodFactory.createPoshanMeal()</code> across 5 states and 6 days. Surfaces mid-day meal guidelines and nutrition standards for school beneficiaries.
          </p>
        </div>
      </div>

      {/* Pattern Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-light text-[#292524] tracking-tight">Implemented GoF design patterns</h2>
            <p className="font-mono text-xs text-[#78716C] mt-0.5">Click any card to inspect implementation & problem statement</p>
          </div>
          <span className="font-serif italic text-xs text-[#FF8577]">6 patterns active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {patterns.map(p => {
            const isExpanded = active === p.id
            return (
              <div
                key={p.id}
                className={`card rounded-[24px] p-6 cursor-pointer transition-all duration-300 border bg-white ${
                  isExpanded
                    ? 'border-[#FFB7B2] shadow-soft'
                    : 'border-[#EDE8E3] hover:border-[#FFB7B2]/70 shadow-soft hover:-translate-y-0.5'
                }`}
                onClick={() => setActive(isExpanded ? null : p.id)}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{p.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-xl font-light text-[#292524]">
                          #{p.id} {p.name}
                        </h3>
                        <span className="bg-[#FFB7B2] text-[#292524] border border-[#FF9E99] font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">GoF</span>
                      </div>
                      <p className="font-mono text-xs text-[#78716C] mt-0.5">{p.class}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-1.5 rounded-xl text-[#78716C] hover:text-[#292524] bg-[#FAF8F5] border border-[#EDE8E3]">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#292524]" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <p className="font-mono text-xs text-[#78716C] mb-3">PACKAGE: {p.package}</p>

                <div className="text-xs text-[#78716C] space-y-1.5 font-sans leading-relaxed">
                  <p>
                    <strong className="text-[#292524] font-mono uppercase text-[11px]">Problem:</strong> {p.problem}
                  </p>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#EDE8E3] space-y-3.5 text-xs animate-reveal">
                    <div>
                      <p className="font-mono uppercase text-[11px] text-[#292524] font-bold mb-1">Solution applied:</p>
                      <p className="text-[#78716C] leading-relaxed font-sans">{p.solution}</p>
                    </div>

                    <div>
                      <p className="font-mono uppercase text-[11px] text-[#292524] font-bold mb-1">Execution flow:</p>
                      <p className="font-mono bg-[#FAF8F5] p-3 rounded-2xl border border-[#EDE8E3] text-[#292524] shadow-sm">
                        {p.flow}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-2 font-mono text-xs text-[#292524] font-bold">
                        <Code2 className="w-4 h-4 text-[#FF8577]" />
                        <span>Source code excerpt:</span>
                      </div>
                      <pre className="bg-[#1C1917] text-[#FFB7B2] p-4 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed border border-[#292524]/20 shadow-inner">
                        {p.code}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Viva / Academic Examination Quick Reference */}
      <div className="card rounded-[24px] bg-white text-[#292524] p-7 space-y-5 border border-[#EDE8E3] shadow-soft">
        <div className="flex items-center justify-between pb-3 border-b border-[#EDE8E3]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#FF8577]" />
            <h2 className="font-serif text-2xl font-light text-[#292524] tracking-tight">Viva examination quick reference</h2>
          </div>
          <span className="font-serif italic text-xs text-[#78716C]">key takeaways</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {[
            {
              q: 'Why Singleton over Spring @Bean?',
              a: 'NutritionConfiguration is written in pure Java without Spring annotations to demonstrate the GoF pattern in isolation without container abstraction.',
            },
            {
              q: 'How is Observer different from Spring events?',
              a: 'NutritionTracker uses an explicit register()/notifyAll() observer registry to demonstrate the GoF behavioral pattern explicitly.',
            },
            {
              q: 'When is Strategy swapped at runtime?',
              a: 'Per recommendation request, based on the user active goal field from their profile. RecommendationContext.selectForGoal() swaps the scoring logic.',
            },
            {
              q: 'What architectural problem does Facade solve?',
              a: 'Controllers depend on 1 interface instead of 5+ services and repositories, minimizing coupling and simplifying unit tests.',
            },
            {
              q: 'How does Decorator prevent subclass explosion?',
              a: 'Three food characteristics would require 2³ = 8 subclasses. With Decorator, 3 small decorators stack dynamically on BasicFood at runtime.',
            },
            {
              q: 'How does food scanning identify dishes?',
              a: 'Google Vision API returns pre-trained general food labels, which are mapped to database visionLabels without requiring custom CNN training.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-l-2 border-[#FFB7B2] pl-3.5 py-1 space-y-1">
              <p className="font-serif text-sm font-semibold text-[#292524]">Q: {q}</p>
              <p className="text-[#78716C] leading-relaxed font-sans">A: {a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
