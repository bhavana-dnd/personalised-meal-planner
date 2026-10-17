import { useEffect, useState } from 'react'
import { dashboardApi } from '../api/services'
import { Link } from 'react-router-dom'
import { Flame, Beef, Wheat, Droplets, Plus, AlertCircle, ArrowUpRight, Utensils, Sparkles } from 'lucide-react'
import FoodImage from '../components/common/FoodImage'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.get().then(r => setData(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (!data)
    return (
      <div className="card text-center py-16 max-w-xl mx-auto rounded-[24px]">
        <AlertCircle className="w-8 h-8 text-[#FF8577] mx-auto mb-3" />
        <p className="font-serif italic text-xl text-[#292524]">Unable to synchronize telemetry</p>
        <p className="text-[#78716C] text-sm mt-1 font-sans">Check local server connectivity and refresh.</p>
      </div>
    )

  const pct = Math.min(100, data.progressPercent ?? 0)

  // Determine technical greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Morning telemetry' : hour < 17 ? 'Afternoon cycle' : 'Evening summary'

  const macros = [
    {
      code: 'CAL.01',
      label: 'Calories',
      icon: Flame,
      consumed: data.caloriesConsumed,
      target: data.calorieTarget,
      unit: 'kcal',
      note: 'energy metabolism',
      color: '#FFB7B2',
      bg: '#FFEBEA',
    },
    {
      code: 'PRO.02',
      label: 'Protein',
      icon: Beef,
      consumed: data.proteinConsumed,
      target: data.proteinTarget,
      unit: 'g',
      note: 'tissue synthesis',
      color: '#A3C4A2',
      bg: '#E8EFE8',
    },
    {
      code: 'CRB.03',
      label: 'Carbs',
      icon: Wheat,
      consumed: data.carbsConsumed,
      target: data.carbsTarget,
      unit: 'g',
      note: 'cellular glycogen',
      color: '#E0C58A',
      bg: '#FAF4E3',
    },
    {
      code: 'FAT.04',
      label: 'Lipids',
      icon: Droplets,
      consumed: data.fatConsumed,
      target: data.fatTarget,
      unit: 'g',
      note: 'hormonal balance',
      color: '#C3B5E0',
      bg: '#EFEDF4',
    },
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header: Newsreader Serif with Italics + Technical Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#EDE8E3]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2.5 py-0.5 rounded-full uppercase font-bold">
              [ {greeting} ]
            </span>
            <span className="font-serif italic text-sm text-[#78716C]">
              feeling balanced today · steady rhythm
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-light text-[#292524] tracking-tight">
            Daily nutrition <em className="italic font-normal text-[#FF8577]">overview</em>
          </h1>
          <p className="font-mono text-xs text-[#78716C] mt-2 uppercase tracking-wider">
            DATE: {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })} · TARGET REF: {data.activeGoal?.replace('_', ' ') || 'MAINTENANCE'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/log-meal" className="btn-primary group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span>Log Meal</span>
          </Link>
          <Link to="/foods" className="btn-secondary">
            Food Library
          </Link>
        </div>
      </div>

      {/* Hero Calorie Section: Coral Pink Gauge + Primary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calorie Ring Card */}
        <div className="card lg:col-span-1 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-white">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] text-[#78716C] tracking-widest uppercase">
              [FIG. 01 // METRIC]
            </span>
            <span className="tech-tag text-[10px]">
              TDEE TRACKER
            </span>
          </div>

          {/* SVG Circular Progress Ring in Coral Pink */}
          <div className="relative w-48 h-48 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r="64"
                stroke="#EDE8E3"
                strokeWidth="10"
                fill="none"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="80"
                cy="80"
                r="64"
                stroke="#FFB7B2"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 * (1 - pct / 100)}
                strokeLinecap="round"
                fill="none"
                style={{
                  transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-3xl font-bold text-[#292524] tracking-tight">
                {Math.round(data.caloriesConsumed ?? 0)}
              </span>
              <span className="text-[11px] font-mono text-[#78716C] uppercase tracking-wider mt-0.5">
                of {Math.round(data.calorieTarget ?? 2000)} kcal
              </span>
              <span className="font-serif italic text-xs text-[#FF8577] mt-1">
                {pct >= 100 ? 'target satisfied' : `${Math.round(data.calorieTarget - data.caloriesConsumed)} kcal rem.`}
              </span>
            </div>
          </div>

          <div className="w-full mt-4 pt-4 border-t border-[#EDE8E3] flex items-center justify-between text-xs">
            <span className="text-[#78716C] font-sans">Daily completion:</span>
            <span className="font-mono font-bold text-[#292524]">{pct.toFixed(0)}%</span>
          </div>
        </div>

        {/* 4-Macro Grid: High Precision Layout */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {macros.map(m => {
            const mPct = m.target ? Math.min(100, (m.consumed / m.target) * 100) : 0
            const Icon = m.icon
            return (
              <div
                key={m.code}
                className="card p-5 flex flex-col justify-between hover:border-[#FFB7B2] hover:shadow-card transition-all duration-300 bg-white">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] text-[#78716C] tracking-wider uppercase">
                      {m.code}
                    </span>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: m.bg, color: m.color }}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-serif text-2xl font-light text-[#292524]">
                      {m.label}
                    </h3>
                    <div className="text-right">
                      <span className="font-mono text-xl font-bold text-[#292524]">
                        {Math.round(m.consumed ?? 0)}
                      </span>
                      <span className="font-mono text-xs text-[#78716C] ml-1">
                        / {Math.round(m.target ?? 0)}{m.unit}
                      </span>
                    </div>
                  </div>

                  <p className="font-serif italic text-xs text-[#78716C]">
                    {m.note}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EDE8E3]">
                  {/* High contrast progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#F7F6F2] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${mPct}%`,
                        backgroundColor: m.color,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#78716C] mt-2">
                    <span>STATUS: {mPct >= 100 ? 'COMPLETE' : 'IN PROGRESS'}</span>
                    <span className="font-bold text-[#292524]">{mPct.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Section Divider with Serrated Aesthetic */}
      <div className="serrated-edge py-2" />

      {/* Logged Meals Breakdown for Today */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EDE8E3]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2 py-0.5 rounded-full uppercase font-bold">
                [FIG. 02 // LOGS]
              </span>
              <h2 className="font-serif text-3xl font-light text-[#292524]">
                Today's meals & plates
              </h2>
            </div>
            <p className="font-serif italic text-xs text-[#78716C] mt-0.5">
              chronological intake logs with verified photography
            </p>
          </div>

          <Link
            to="/log-meal"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#292524] hover:text-[#FF8577] transition-colors">
            <span>ADD INTAKE RECORD</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!data.todayMeals || data.todayMeals.length === 0) ? (
          <div className="card text-center py-12 rounded-[24px] bg-white">
            <Utensils className="w-8 h-8 text-[#78716C] mx-auto mb-3" />
            <p className="font-serif italic text-xl text-[#292524]">No meals logged for today's cycle</p>
            <p className="text-[#78716C] text-sm mt-1 font-sans">
              Record breakfast, lunch, snack, or dinner to activate real-time telemetry.
            </p>
            <div className="mt-5">
              <Link to="/log-meal" className="btn-primary">
                <Plus className="w-4 h-4" />
                <span>Log First Meal</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.todayMeals.map((meal: any) => {
              const firstFood = meal.items?.[0]?.foodName || 'Meal Plate'
              const firstCat = meal.items?.[0]?.category || 'GRAIN'
              return (
                <div
                  key={meal.id}
                  className="card p-4 rounded-[24px] flex items-center justify-between gap-4 hover:border-[#FFB7B2] hover:shadow-card transition-all duration-300 bg-white group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-20 h-20 rounded-[18px] overflow-hidden flex-shrink-0 border border-[#EDE8E3] shadow-sm bg-[#F7F6F2]">
                      <FoodImage
                        name={firstFood}
                        category={firstCat}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={firstFood}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2 py-0.5 rounded-full uppercase font-bold">
                          {meal.mealType?.toLowerCase()}
                        </span>
                        <span className="text-[10px] font-mono text-[#78716C]">
                          {meal.items?.length || 1} item{meal.items?.length === 1 ? '' : 's'}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-normal text-[#292524] truncate group-hover:text-[#FF8577] transition-colors">
                        {meal.items?.map((i: any) => i.foodName).join(', ') || firstFood}
                      </h4>
                      <p className="font-mono text-xs text-[#78716C] mt-0.5">
                        P: {Math.round(meal.totalProtein ?? 0)}g · C: {Math.round(meal.totalCarbs ?? 0)}g · F: {Math.round(meal.totalFat ?? 0)}g
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pr-1">
                    <span className="font-mono text-2xl font-bold text-[#292524]">
                      {Math.round(meal.totalCalories ?? 0)}
                    </span>
                    <span className="font-mono text-[10px] text-[#78716C] uppercase block mt-0.5">
                      kcal
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recommendations Banner */}
      <div className="p-6 bg-white border border-[#EDE8E3] rounded-[24px] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#FFEBEA] border border-[#FFD7D4] flex items-center justify-center text-[#292524] flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#FF8577]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-xl text-[#292524] font-light">Looking for balanced meal ideas?</span>
              <span className="font-mono text-[10px] text-[#292524] bg-[#FFEBEA] px-2 py-0.5 rounded-full uppercase font-bold">
                strategy matched
              </span>
            </div>
            <p className="text-xs text-[#78716C] mt-0.5 font-sans">
              Personalized recommendations matched with your goal and remaining daily calories.
            </p>
          </div>
        </div>
        <Link to="/recommendations" className="btn-secondary text-xs py-2 px-5 flex-shrink-0 group">
          <span>View Suggestions</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Technical Footer Attribution */}
      <p className="font-mono text-[10px] text-[#78716C] text-center tracking-wider uppercase">
        SMARTMEAL // ISWE404L OBJECT-ORIENTED NUTRITION MONITOR · NON-CLINICAL SENSOR TELEMETRY
      </p>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-8 h-8 border-2 border-[#FFB7B2] border-t-transparent rounded-full animate-spin" />
      <span className="font-serif italic text-base text-[#78716C]">synchronizing nutrition telemetry…</span>
    </div>
  )
}
