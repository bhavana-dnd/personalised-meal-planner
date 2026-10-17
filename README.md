# 🥗 SmartMeal — Nutrition Monitoring & Personalised Meal Planning

**Design Patterns Project · ISWE404L · VIT Chennai**

A full-stack health-tech application demonstrating 6 GoF Design Patterns in a real, runnable system.

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+ **OR** use H2 in-memory (no setup needed)
- Google Cloud Vision API key (free tier — 1000 req/month)

---

### 1. Database Setup (PostgreSQL)

```sql
CREATE DATABASE smartmealdb;
-- Default user: postgres / password: postgres
-- Or update application.properties
```

Skip this if using H2 — see step 3 flag.

---

### 2. Backend

```bash
cd backend

# Copy and edit env
cp ../.env.example .env

# Build and run (PostgreSQL)
mvn spring-boot:run

# OR run with H2 in-memory (no PostgreSQL needed — great for demo)
mvn spring-boot:run -Dspring.profiles.active=h2
```

Backend starts on **http://localhost:8080**

On startup:
- ✅ Observers registered (Dashboard, Alert, Recommendation)
- ✅ 45 foods seeded via FoodFactory (FACTORY PATTERN)
- ✅ 30 PM POSHAN scheme meals seeded (5 states × 6 days)
- ✅ 3 demo users created

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on **http://localhost:5173**

---

### 4. Google Vision API (Food Scanner)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → Enable **Cloud Vision API**
3. Create API Key → copy it
4. Set in backend `application.properties`:
   ```
   app.vision.api-key=YOUR_KEY_HERE
   ```

**Without a key:** The scanner runs in **demo mode** — it returns mock predictions ("Rice", "Dal") so the rest of the flow can still be demonstrated.

---

## 🔑 Demo Credentials

| Username | Password | Profile |
|---|---|---|
| `demo` | `demo123` | Male, 24yr, Weight Loss goal |
| `priya` | `priya123` | Female, 21yr, Vegetarian, Muscle Gain |
| `poshan_monitor` | `poshan123` | PM POSHAN scheme monitor |

---

## 🏗️ Architecture

```
React (Vite + TypeScript + Tailwind)
        ↓  REST / JWT
Spring Boot Controllers  ←── thin, no business logic
        ↓
MealMonitoringFacade     ←── FACADE PATTERN (Pattern #6)
        ↓
Services
  MealService            ←── fires OBSERVER PATTERN (Pattern #4)
  RecommendationService  ←── uses STRATEGY PATTERN (Pattern #3)
                             uses DECORATOR PATTERN (Pattern #5)
  FoodScanService        ←── Google Vision API → food match → Decorator
  NutritionCalculator    ←── uses SINGLETON PATTERN (Pattern #1)
        ↓
Factory
  FoodFactory            ←── FACTORY PATTERN (Pattern #2)
        ↓
Spring Data JPA → PostgreSQL
```

---

## 🎨 Design Patterns

| # | Pattern | Class | Problem Solved |
|---|---|---|---|
| 1 | **Singleton** | `NutritionConfiguration` | Shared BMR/TDEE constants, thread-safe |
| 2 | **Factory** | `FoodFactory` | Food creation by category with correct dietary defaults |
| 3 | **Strategy** | `MealRecommendationStrategy` + 4 impls | Swap recommendation algorithm by user goal |
| 4 | **Observer** | `NutritionTracker` + 3 observers | Meal log triggers dashboard, alerts, recs independently |
| 5 | **Decorator** | `FoodDecorator` + 3 decorators | Dynamic nutrition tags without subclass explosion |
| 6 | **Facade** | `MealMonitoringFacade` | Single interface for all controllers |

---

## 🍽️ PM POSHAN Scheme

SmartMeal includes the official PM POSHAN (Pradhan Mantri Poshan Shakti Nirman) Mid-Day Meal menus for:
- Tamil Nadu · Maharashtra · Karnataka · Uttar Pradesh · West Bengal

Each meal is seeded with state, day, meal type, approximate nutrition per 100g, and Vision API label aliases for scan matching.

**Source:** Ministry of Education, Dept of School Education & Literacy, GoI  
**Disclaimer:** Nutrition values are approximate and for educational demonstration only.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login → JWT |
| GET | `/api/dashboard` | Today's summary |
| GET | `/api/dashboard/targets` | BMR/TDEE/macro targets |
| POST | `/api/meals` | Log a meal |
| GET | `/api/meals/today` | Today's meals |
| GET | `/api/meals/history?from=&to=` | Meal history |
| GET | `/api/foods?q=` | Search foods |
| GET | `/api/foods/{id}` | Food detail |
| GET | `/api/recommendations?limit=` | Personalised recommendations |
| GET | `/api/poshan/menu?state=` | PM POSHAN weekly menu |
| POST | `/api/scan` | Scan food image (base64) |
| GET | `/api/scan/history` | Scan history |
| GET | `/api/profile` | Get profile |
| PUT | `/api/profile` | Update profile |
| POST | `/api/weight` | Log weight |
| GET | `/api/weight` | Weight history |

---

## 🗄️ Database Schema

**Tables:** users, user_profiles, foods, meals, meal_items, weight_entries, scan_history

**Key fields on `foods`:**
- `is_poshan_meal`, `poshan_state`, `poshan_day`, `poshan_meal_type` — scheme integration
- `vision_labels` — comma-separated Google Vision label aliases for scan matching

---

## 🧪 Running Tests

```bash
cd backend
mvn test
```

Tests cover: NutritionCalculator, FoodFactory, all Strategies, Observer notifications, allergy/diet filtering.

---

## 📁 Project Structure

```
smartmeal/
├── backend/
│   └── src/main/java/com/smartmeal/
│       ├── singleton/   NutritionConfiguration
│       ├── factory/     FoodFactory
│       ├── strategy/    4 strategy classes + context
│       ├── observer/    NutritionTracker + 3 observers
│       ├── decorator/   BasicFood + 3 decorators + service
│       ├── facade/      MealMonitoringFacade
│       ├── service/     MealService, RecommendationService, FoodScanService, NutritionCalculator
│       ├── controller/  7 controllers
│       ├── model/       9 entities
│       ├── repository/  6 JPA repositories
│       ├── security/    JWT + Spring Security
│       └── config/      SecurityConfig, DataSeeder
└── frontend/
    └── src/
        ├── pages/       10 pages
        ├── components/  Layout, sidebar
        ├── api/         Axios services
        └── context/     AuthContext
```
