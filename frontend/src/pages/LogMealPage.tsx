import { useState, useEffect } from 'react'
import { foodsApi, mealsApi } from '../api/services'
import { Search, Plus, Trash2, UtensilsCrossed, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import FoodImage from '../components/common/FoodImage'

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'SNACK', 'DINNER']

export default function LogMealPage() {
  const navigate = useNavigate()
  const [mealType, setMealType] = useState('BREAKFAST')
  const [query, setQuery] = useState('')
  const [foods, setFoods] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const { data } = await foodsApi.search(query)
        setFoods(data || [])
      } catch {
        // quiet error
      }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  const addItem = (food: any) => {
    if (items.find(i => i.foodId === food.id)) {
      toast('Item already added')
      return
    }
    setItems(prev => [
      ...prev,
      {
        foodId: food.id,
        foodName: food.name,
        category: food.category,
        quantityGrams: 100,
        calories: food.calories,
        protein: food.protein,
      },
    ])
  }

  const removeItem = (foodId: number) => setItems(prev => prev.filter(i => i.foodId !== foodId))

  const updateQty = (foodId: number, qty: number) =>
    setItems(prev => prev.map(i => (i.foodId === foodId ? { ...i, quantityGrams: Math.max(1, qty) } : i)))

  const totalCal = items.reduce((s, i) => s + (i.calories * i.quantityGrams) / 100, 0)
  const totalProtein = items.reduce((s, i) => s + (i.protein * i.quantityGrams) / 100, 0)

  const submit = async () => {
    if (items.length === 0) {
      toast.error('Add at least one food')
      return
    }
    setSubmitting(true)
    try {
      await mealsApi.logMeal({
        mealType,
        date: new Date().toISOString().split('T')[0],
        items: items.map(i => ({ foodId: i.foodId, quantityGrams: i.quantityGrams })),
      })
      toast.success('Meal logged successfully!')
      navigate('/dashboard')
    } catch {
      toast.error('Failed to log meal')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="pb-5 border-b border-[#EDE8E3]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[20px] bg-[#FFEBEA] border border-[#FFD7D4] flex items-center justify-center text-[#292524] shadow-sm">
            <UtensilsCrossed className="w-6 h-6 text-[#FF8577]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2.5 py-0.5 rounded-full uppercase font-bold">
                [ 03 // MEAL INTAKE ]
              </span>
              <span className="font-serif italic text-sm text-[#78716C]">
                mindful plates · calibrate nutrients
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-light text-[#292524] tracking-tight">
              Log a <em className="italic font-normal text-[#FF8577]">meal</em>
            </h1>
            <p className="text-sm text-[#78716C] mt-1 font-sans">
              Record intake portions to synchronize your daily calorie and macronutrient telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Meal Type Selection */}
      <div className="card rounded-[24px] space-y-3 p-5 bg-white border border-[#EDE8E3] shadow-sm">
        <label className="label">1. SELECT MEAL TYPE</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {MEAL_TYPES.map(t => {
            const isSelected = mealType === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setMealType(t)}
                className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-mono tracking-wider transition-all flex items-center justify-center gap-2 border ${
                  isSelected
                    ? 'bg-[#FFB7B2] text-[#292524] font-bold border-[#FF9E99] shadow-sm scale-105'
                    : 'bg-white text-[#78716C] border-[#EDE8E3] hover:text-[#292524] hover:bg-[#F7F6F2]'
                }`}>
                {isSelected && <Check className="w-4 h-4" />}
                <span>{t.toLowerCase()}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2: Food Search */}
      <div className="card rounded-[24px] space-y-4 p-5 bg-white border border-[#EDE8E3] shadow-sm">
        <div>
          <label className="label">2. SEARCH FOOD DATABASE</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-[#78716C]" />
            <input
              className="input pl-11 rounded-2xl"
              placeholder="Search by name: e.g. Dal, Idli, Apple, Chicken, Chapati, Paneer…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Search Results List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1 no-scrollbar">
          {foods.map((f: any) => {
            const isAdded = items.some(i => i.foodId === f.id)
            return (
              <div
                key={f.id}
                onClick={() => !isAdded && addItem(f)}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${
                  isAdded
                    ? 'bg-[#E8EFE8]/50 border-[#D4E2D4] opacity-75 cursor-default'
                    : 'bg-white border-[#EDE8E3] hover:border-[#FFB7B2] hover:bg-[#FDFCF8] cursor-pointer shadow-sm group'
                }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 border border-[#EDE8E3] shadow-sm bg-[#F7F6F2]">
                    <FoodImage name={f.name} category={f.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-sans font-bold text-[#292524] truncate group-hover:text-[#FF8577] transition-colors">{f.name}</p>
                      <span className="bg-[#F7F6F2] text-[#78716C] border border-[#EDE8E3] text-[10px] font-mono px-2 py-0.5 rounded-full">{f.category?.toLowerCase()}</span>
                      {f.isPoshanMeal && <span className="bg-[#FFEBEA] text-[#292524] border border-[#FFD7D4] text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">poshan</span>}
                      {f.isVegetarian && <span className="bg-[#E8EFE8] text-[#292524] border border-[#D4E2D4] text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">veg</span>}
                    </div>
                    <p className="font-mono text-xs text-[#78716C] mt-0.5 truncate">
                      {f.calories} kcal/100g · P: {f.protein}g · C: {f.carbs}g · F: {f.fat}g
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`p-2.5 rounded-2xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ml-2 ${
                    isAdded
                      ? 'bg-[#E8EFE8] text-[#292524]'
                      : 'bg-[#FFB7B2] text-[#292524] group-hover:scale-110 shadow-sm font-bold'
                  }`}>
                  {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />}
                </button>
              </div>
            )
          })}
          {query && foods.length === 0 && (
            <div className="text-center py-6 font-mono text-xs text-[#78716C]">
              No foods found matching "{query}". Try a simpler keyword.
            </div>
          )}
        </div>
      </div>

      {/* Selected Items Card */}
      {items.length > 0 && (
        <div className="card rounded-[24px] space-y-4 p-6 border-2 border-[#FFB7B2] shadow-sm bg-white">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE8E3]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-light text-[#292524]">Selected items ({items.length})</h3>
                <span className="font-serif italic text-sm text-[#FF8577]">ready to synchronize</span>
              </div>
              <p className="font-mono text-xs text-[#78716C] mt-0.5">Adjust portion mass in grams</p>
            </div>
            <div className="flex gap-2">
              <span className="font-mono text-xs font-bold bg-[#FFEBEA] text-[#292524] border border-[#FFD7D4] px-3 py-1 rounded-full">{Math.round(totalCal)} kcal</span>
              <span className="font-mono text-xs font-bold bg-[#E8EFE8] text-[#292524] border border-[#D4E2D4] px-3 py-1 rounded-full">P: {Math.round(totalProtein)}g</span>
            </div>
          </div>

          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.foodId}
                className="flex items-center justify-between gap-3 p-3.5 bg-[#FDFCF8] border border-[#EDE8E3] rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 border border-[#EDE8E3] bg-[#F7F6F2]">
                    <FoodImage name={item.foodName} category={item.category} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-sans font-bold text-[#292524] truncate">{item.foodName}</p>
                    <p className="font-mono text-xs text-[#78716C]">
                      {Math.round((item.calories * item.quantityGrams) / 100)} kcal · Protein:{' '}
                      {Math.round((item.protein * item.quantityGrams) / 100)}g
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="flex items-center bg-white border border-[#EDE8E3] rounded-2xl px-2.5 py-1.5 shadow-sm">
                    <input
                      type="number"
                      min="1"
                      max="2000"
                      className="w-16 text-center text-sm font-mono font-bold text-[#292524] bg-transparent focus:outline-none"
                      value={item.quantityGrams}
                      onChange={e => updateQty(item.foodId, Number(e.target.value))}
                    />
                    <span className="text-xs font-mono text-[#78716C] ml-1">g</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.foodId)}
                    title="Remove item"
                    className="p-2 text-[#78716C] hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 mt-4 group"
            onClick={submit}
            disabled={submitting}>
            <UtensilsCrossed className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>{submitting ? 'saving meal…' : `save ${mealType.toLowerCase()} (${Math.round(totalCal)} kcal)`}</span>
          </button>
        </div>
      )}
    </div>
  )
}
