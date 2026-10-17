import { useEffect, useState } from 'react'
import { recommendApi, mealsApi } from '../api/services'
import { Sparkles, Plus, Check, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import FoodImage from '../components/common/FoodImage'

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loggedIds, setLoggedIds] = useState<number[]>([])

  useEffect(() => {
    recommendApi
      .get(12)
      .then(r => setRecs(r.data || []))
      .finally(() => setLoading(false))
  }, [])

  const log = async (r: any) => {
    try {
      await mealsApi.logMeal({
        mealType: 'SNACK',
        date: new Date().toISOString().split('T')[0],
        items: [{ foodId: r.foodId, quantityGrams: 100 }],
      })
      toast.success(`${r.foodName} added to today's meals!`)
      setLoggedIds(prev => [...prev, r.foodId])
    } catch {
      toast.error('Failed to log recommendation')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#EDE8E3]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2.5 py-0.5 rounded-full uppercase font-bold">
              [ 04 // STRATEGY ENGINE ]
            </span>
            <span className="font-serif italic text-sm text-[#78716C]">
              curated for your current goal
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-light text-[#292524] tracking-tight">
            Personalized <em className="italic font-normal text-[#FF8577]">recommendations</em>
          </h1>
          <p className="text-sm text-[#78716C] mt-2 font-sans max-w-2xl leading-relaxed">
            Ranked dynamically by the GoF Strategy Pattern based on your active target, dietary constraints, and remaining daily calories.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#78716C] bg-white border border-[#EDE8E3] px-3.5 py-2 rounded-full shadow-sm">
          <Sparkles className="w-4 h-4 text-[#FF8577]" />
          <span>GOF STRATEGY + DECORATOR</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-10 h-10 border-2 border-[#FFB7B2] border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#78716C]">Calculating recommendation rankings…</span>
        </div>
      ) : recs.length === 0 ? (
        <div className="card rounded-[24px] text-center py-16 text-[#78716C] bg-white border border-[#EDE8E3]">
          <p className="font-serif italic text-xl text-[#292524]">No recommendations found</p>
          <p className="text-xs mt-1 text-[#78716C] font-mono">Make sure you have completed your profile biometrics and targets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recs.map((rec: any) => {
            const isLogged = loggedIds.includes(rec.foodId)
            return (
              <div
                key={rec.foodId}
                className="card rounded-[24px] p-0 overflow-hidden hover:border-[#FFB7B2] hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group bg-white border border-[#EDE8E3]">
                <div>
                  {/* Real Food Photograph with Badges */}
                  <div className="h-48 w-full relative overflow-hidden bg-[#F7F6F2]">
                    <FoodImage
                      name={rec.foodName}
                      category={rec.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
                      <span className="bg-[#FFEBEA] text-[#292524] border border-[#FFD7D4] font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                        SCORE {rec.score}
                      </span>
                      {rec.isPoshanMeal && (
                        <span className="bg-white/90 backdrop-blur-md text-[#292524] border border-[#EDE8E3] font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                          poshan
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-xl font-normal text-[#292524] line-clamp-1 group-hover:text-[#FF8577] transition-colors">
                          {rec.foodName}
                        </h3>
                        <p className="font-mono text-[11px] text-[#78716C] mt-0.5">{rec.category?.toLowerCase()} · 100g portion</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => log(rec)}
                        title="Add 100g to Today's Meals"
                        className={`p-3 rounded-2xl transition-all duration-200 flex-shrink-0 group/btn shadow-sm ${
                          isLogged
                            ? 'bg-[#E8EFE8] text-[#292524]'
                            : 'bg-[#FFB7B2] hover:bg-[#FFA5A0] text-[#292524] font-bold shadow-sm hover:scale-105 active:scale-95'
                        }`}>
                        {isLogged ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
                        )}
                      </button>
                    </div>

                    {/* Tags from Decorator Pattern */}
                    {rec.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {rec.tags.map((t: string) => (
                          <span key={t} className="bg-[#EFEDF4] border border-[#DFDAE8] text-[10px] font-mono text-[#292524] px-2.5 py-0.5 rounded-full font-medium">
                            {t.replace('_', ' ').toLowerCase()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Macro Breakdown */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: 'cal', val: `${rec.calories?.toFixed(0)}`, highlight: true },
                        { label: 'pro', val: `${rec.protein?.toFixed(1)}g`, highlight: false },
                        { label: 'crb', val: `${rec.carbs?.toFixed(1)}g`, highlight: false },
                        { label: 'fat', val: `${rec.fat?.toFixed(1)}g`, highlight: false },
                      ].map(({ label, val, highlight }) => (
                        <div key={label} className="bg-[#F7F6F2] border border-[#EDE8E3] rounded-2xl p-2">
                          <p className={`text-xs font-mono font-bold ${highlight ? 'text-[#FF8577]' : 'text-[#292524]'}`}>{val}</p>
                          <p className="text-[10px] font-mono text-[#78716C] uppercase mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Strategy Reason */}
                    {rec.reason && (
                      <div className="p-3 bg-[#FAF4E3] rounded-2xl border border-[#F0E3BC] text-xs text-[#78716C] flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="font-serif italic leading-relaxed text-[#292524]">{rec.reason}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
