import { useEffect, useState } from 'react'
import { mealsApi } from '../api/services'
import { History, Calendar } from 'lucide-react'
import FoodImage from '../components/common/FoodImage'

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const to = new Date().toISOString().split('T')[0]
    const from = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
    mealsApi
      .history(from, to)
      .then(r => setHistory(r.data || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#EDE8E3]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2.5 py-0.5 rounded-full uppercase font-bold">
              [ 07 // LOG TELEMETRY ]
            </span>
            <span className="font-serif italic text-sm text-[#78716C]">
              7-day cadence · historical consistency
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-light text-[#292524] tracking-tight">
            Nutrition <em className="italic font-normal text-[#FF8577]">history</em>
          </h1>
          <p className="text-sm text-[#78716C] mt-2 font-sans max-w-2xl leading-relaxed">
            Review past meals and macronutrient distributions over the previous 7-day cycle.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#78716C] bg-white border border-[#EDE8E3] px-3.5 py-2 rounded-full shadow-sm">
          <History className="w-4 h-4 text-[#FF8577]" />
          <span>7-DAY ARCHIVE</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-10 h-10 border-2 border-[#FFB7B2] border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#78716C]">Loading meal history…</span>
        </div>
      ) : history.length === 0 ? (
        <div className="card rounded-[24px] text-center py-16 text-[#78716C] max-w-md mx-auto shadow-sm bg-white border border-[#EDE8E3]">
          <div className="w-16 h-16 rounded-[20px] bg-[#FFEBEA] border border-[#FFD7D4] flex items-center justify-center mx-auto mb-4 text-[#FF8577]">
            <Calendar className="w-8 h-8 text-[#FF8577]" />
          </div>
          <p className="font-serif italic text-xl text-[#292524]">No meal history recorded yet</p>
          <p className="font-mono text-xs mt-1 text-[#78716C]">Log your meals from the dashboard to populate historical telemetry.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((day: any) => (
            <div key={day.date} className="card rounded-[24px] p-6 space-y-4 shadow-sm bg-white border border-[#EDE8E3]">
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EDE8E3]">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#FF8577]" />
                  <h3 className="font-serif text-2xl font-light text-[#292524] tracking-tight">
                    {new Date(day.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#FFEBEA] text-[#292524] border border-[#FFD7D4] font-mono text-xs font-bold px-3 py-1 rounded-full">
                    {Math.round(day.totalCalories)} kcal
                  </span>
                  <span className="bg-[#E8EFE8] text-[#292524] border border-[#D4E2D4] font-mono text-xs font-bold px-3 py-1 rounded-full">
                    P: {Math.round(day.totalProtein)}g
                  </span>
                </div>
              </div>

              {/* Day's Meals */}
              <div className="space-y-2.5">
                {day.meals?.map((m: any) => {
                  const firstFood = m.items?.[0]?.foodName || 'Meal'
                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3.5 bg-[#FDFCF8] border border-[#EDE8E3] rounded-2xl hover:border-[#FFB7B2] transition-all duration-200 shadow-sm">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 border border-[#EDE8E3] bg-[#F7F6F2] shadow-sm">
                          <FoodImage name={firstFood} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono text-xs uppercase tracking-wider text-[#FF8577] font-bold block">
                            {m.mealType?.toLowerCase()}
                          </span>
                          <p className="text-xs text-[#78716C] truncate mt-0.5 font-sans font-medium">
                            {m.items?.map((i: any) => i.foodName).join(', ') || 'Logged meal items'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 pl-3">
                        <span className="font-mono text-base font-bold text-[#292524]">{Math.round(m.totalCalories)}</span>
                        <span className="font-mono text-xs text-[#78716C] ml-1">kcal</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
