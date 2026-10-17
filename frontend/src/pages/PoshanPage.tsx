import { useEffect, useState } from 'react'
import { poshanApi, mealsApi } from '../api/services'
import { School, Plus, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import FoodImage from '../components/common/FoodImage'

const STATES = ['Tamil Nadu', 'Maharashtra', 'Karnataka', 'Uttar Pradesh', 'West Bengal']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function PoshanPage() {
  const [state, setState] = useState('Tamil Nadu')
  const [menu, setMenu] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loggedDishes, setLoggedDishes] = useState<string[]>([])

  useEffect(() => {
    setLoading(true)
    poshanApi
      .menu(state)
      .then(r => setMenu(r.data || []))
      .finally(() => setLoading(false))
  }, [state])

  const byDay = DAYS.reduce((acc, day) => {
    acc[day] = menu.filter(m => m.day === day)
    return acc
  }, {} as Record<string, any[]>)

  const logMeal = async (item: any) => {
    try {
      await mealsApi.logMeal({
        mealType: item.mealType,
        date: new Date().toISOString().split('T')[0],
        items: [{ foodId: item.foodId, quantityGrams: 200 }],
      })
      toast.success(`${item.dishName} logged (200g portion)`)
      setLoggedDishes(prev => [...prev, item.dishName])
    } catch {
      toast.error('Failed to log meal')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#EDE8E3]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2.5 py-0.5 rounded-full uppercase font-bold">
              [ 06 // NATIONAL INITIATIVE ]
            </span>
            <span className="font-serif italic text-sm text-[#78716C]">
              nourishing future minds · regional directives
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-light text-[#292524] tracking-tight">
            PM POSHAN <em className="italic font-normal text-[#FF8577]">scheme</em>
          </h1>
          <p className="text-sm text-[#78716C] mt-2 font-sans max-w-2xl leading-relaxed">
            Pradhan Mantri Poshan Shakti Nirman — Mid-Day Meals for school children across Indian States (Classes 1–8).
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#78716C] bg-white border border-[#EDE8E3] px-3.5 py-2 rounded-full shadow-sm">
          <School className="w-4 h-4 text-[#FF8577]" />
          <span>GOVT OF INDIA DIRECTIVE</span>
        </div>
      </div>

      {/* Scheme National Norms Banner */}
      <div className="card rounded-[24px] bg-white border border-[#EDE8E3] p-6 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Child Beneficiaries', val: '11.8 Cr+', highlight: true },
            { label: 'Participating Schools', val: '11.2 Lakh+', highlight: false },
            { label: 'Min Calories / Meal', val: '450 kcal', highlight: true },
            { label: 'Min Protein / Meal', val: '12g', highlight: false },
          ].map(({ label, val, highlight }) => (
            <div key={label} className="p-2">
              <p className={`text-2xl sm:text-3xl font-mono font-bold tracking-tight ${highlight ? 'text-[#FF8577]' : 'text-[#292524]'}`}>
                {val}
              </p>
              <p className="font-mono text-[10px] text-[#78716C] mt-1 uppercase tracking-wider font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* State Selector */}
      <div className="card rounded-[24px] space-y-3 p-5 bg-white border border-[#EDE8E3] shadow-sm">
        <div className="flex items-center justify-between">
          <label className="label">SELECT STATE GUIDELINES</label>
          <span className="font-serif italic text-xs text-[#78716C]">regional menus</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATES.map(s => {
            const isSelected = state === s
            return (
              <button
                key={s}
                type="button"
                onClick={() => setState(s)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all border ${
                  isSelected
                    ? 'bg-[#FFB7B2] text-[#292524] font-bold border-[#FF9E99] shadow-sm scale-105'
                    : 'bg-white text-[#78716C] border-[#EDE8E3] hover:text-[#292524] hover:bg-[#F7F6F2]'
                }`}>
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {/* Weekly Menu Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-10 h-10 border-2 border-[#FFB7B2] border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#78716C]">Loading {state} menu guidelines…</span>
        </div>
      ) : (
        <div className="space-y-6">
          {DAYS.map(day => {
            const dayItems = byDay[day] || []
            return (
              <div key={day} className="card rounded-[24px] p-6 space-y-4 shadow-sm bg-white border border-[#EDE8E3]">
                <div className="flex items-center justify-between pb-3 border-b border-[#EDE8E3]">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-2xl font-light text-[#292524] tracking-tight">{day}</h3>
                    <span className="font-serif italic text-xs text-[#FF8577]">prescribed plate</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-3 py-1 rounded-full font-bold">
                    {dayItems.length} {dayItems.length === 1 ? 'dish' : 'dishes'}
                  </span>
                </div>

                {dayItems.length === 0 ? (
                  <p className="font-mono text-xs text-[#78716C] py-2">No menu data logged for {day}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {dayItems.map((item: any) => {
                      const isLogged = loggedDishes.includes(item.dishName)
                      return (
                        <div
                          key={item.dishName}
                          className="flex flex-col justify-between p-4 bg-[#FDFCF8] border border-[#EDE8E3] rounded-[20px] hover:border-[#FFB7B2] hover:shadow-card transition-all duration-300">
                          <div>
                            <div className="flex items-start gap-3.5">
                              <div className="w-16 h-16 rounded-[16px] overflow-hidden flex-shrink-0 border border-[#EDE8E3] bg-[#F7F6F2] shadow-sm">
                                <FoodImage
                                  name={item.dishName}
                                  category={item.category}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <p className="text-base font-serif font-normal text-[#292524] truncate">{item.dishName}</p>
                                  <span className="bg-[#FFEBEA] text-[#292524] border border-[#FFD7D4] text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                                    {item.mealType?.toLowerCase()}
                                  </span>
                                  <span className="bg-[#F7F6F2] text-[#78716C] border border-[#EDE8E3] text-[10px] font-mono px-2 py-0.5 rounded-full font-medium">
                                    {item.category?.toLowerCase()}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 mt-1.5 font-mono text-xs text-[#78716C] flex-wrap">
                                  <span className="text-[#FF8577] font-bold">
                                    {item.calories?.toFixed(0)} kcal
                                  </span>
                                  <span>{item.protein?.toFixed(1)}g pro</span>
                                  <span>{item.carbs?.toFixed(1)}g carb</span>
                                </div>
                              </div>
                            </div>

                            {item.nutritionNote && (
                              <p className="font-mono text-[11px] text-[#78716C] mt-3 pt-2.5 border-t border-[#EDE8E3] leading-relaxed">
                                {item.nutritionNote}
                              </p>
                            )}
                          </div>

                          <div className="mt-3.5 pt-3 border-t border-[#EDE8E3] flex items-center justify-between">
                            <span className="font-mono text-[11px] text-[#78716C]">PORTION: 200g</span>
                            <button
                              type="button"
                              onClick={() => logMeal(item)}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all duration-200 group/log ${
                                isLogged
                                  ? 'bg-[#E8EFE8] text-[#292524]'
                                  : 'bg-[#FFB7B2] hover:bg-[#FFA5A0] text-[#292524] shadow-sm hover:scale-105 active:scale-95'
                              }`}>
                              {isLogged ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Plus className="w-3.5 h-3.5 group-hover/log:rotate-90 transition-transform duration-300" />
                              )}
                              <span>{isLogged ? 'logged' : 'log 200g'}</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Attribution & Reference Footer */}
      <div className="p-5 bg-white border border-[#EDE8E3] rounded-[24px] text-xs font-mono text-[#78716C] text-center space-y-1 shadow-sm">
        <p className="text-[#292524] uppercase tracking-wider font-bold">Government of India PM POSHAN Scheme Guidelines</p>
        <p>
          Menu specifications follow state school education directives. Standard servings average 200–300g per child.
        </p>
        <p className="text-[10px] text-[#78716C]">SOURCE: pmposhan.education.gov.in</p>
      </div>
    </div>
  )
}
