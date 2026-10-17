import { useEffect, useState } from 'react'
import { foodsApi } from '../api/services'
import { Search, AlertCircle, Apple } from 'lucide-react'
import FoodImage from '../components/common/FoodImage'

const CATEGORIES = ['ALL', 'GRAIN', 'VEGETABLE', 'FRUIT', 'LEGUME', 'DAIRY', 'MEAT', 'SNACK', 'BEVERAGE']

export default function FoodsPage() {
  const [foods, setFoods] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [selectedCat, setSelectedCat] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      foodsApi.search(q).then(r => setFoods(r.data || [])).finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  const filteredFoods = foods.filter(f => {
    if (selectedCat === 'ALL') return true
    return f.category?.toUpperCase() === selectedCat
  })

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#EDE8E3]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2.5 py-0.5 rounded-full uppercase font-bold">
              [ 02 // DATABASE ]
            </span>
            <span className="font-serif italic text-sm text-[#78716C]">
              whole food energy · raw composition
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-light text-[#292524] tracking-tight">
            Food <em className="italic font-normal text-[#FF8577]">database</em>
          </h1>
          <p className="text-sm text-[#78716C] mt-2 font-sans max-w-2xl leading-relaxed">
            Nutritional profiles per 100g standard portion for Indian staples, regional dishes, and whole ingredients.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#78716C] bg-white border border-[#EDE8E3] px-3.5 py-2 rounded-full shadow-sm">
          <Apple className="w-4 h-4 text-[#FF8577]" />
          <span>{filteredFoods.length} ITEMS INDEXED</span>
        </div>
      </div>

      {/* Search and Category Filter Card */}
      <div className="card rounded-[24px] space-y-4 p-5 bg-white border border-[#EDE8E3] shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-[#78716C]" />
          <input
            className="input pl-11 rounded-2xl"
            placeholder="Search food database: e.g. Paneer, Spinach, Roti, Mango, Dal, Oats, Biryani…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCat === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all border ${
                  isSelected
                    ? 'bg-[#FFB7B2] text-[#292524] font-bold border-[#FF9E99] shadow-sm scale-105'
                    : 'bg-white text-[#78716C] border-[#EDE8E3] hover:text-[#292524] hover:bg-[#F7F6F2]'
                }`}>
                {cat.toLowerCase()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Food Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-10 h-10 border-2 border-[#FFB7B2] border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#78716C]">Searching nutrition database…</span>
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="card rounded-[24px] text-center py-16 text-[#78716C] bg-white border border-[#EDE8E3]">
          <p className="font-serif italic text-xl text-[#292524]">No foods found</p>
          <p className="text-xs mt-1 text-[#78716C] font-mono">Try searching for a different food item or select another category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFoods.map((f: any) => (
            <div
              key={f.id}
              className="card rounded-[24px] p-0 overflow-hidden hover:border-[#FFB7B2] hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group bg-white border border-[#EDE8E3]">
              <div>
                {/* Real Food Photograph with High Rendering */}
                <div className="h-48 w-full relative overflow-hidden bg-[#F7F6F2]">
                  <FoodImage
                    name={f.name}
                    category={f.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 flex gap-1.5 flex-wrap">
                    <span className="bg-white/90 backdrop-blur-md text-[#292524] border border-[#EDE8E3] text-[10px] font-mono px-2.5 py-0.5 rounded-full shadow-sm font-semibold">
                      {f.category?.toLowerCase()}
                    </span>
                    {f.isPoshanMeal && (
                      <span className="bg-[#FFEBEA] text-[#292524] border border-[#FFD7D4] text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                        poshan
                      </span>
                    )}
                    {f.isVegetarian && (
                      <span className="bg-[#E8EFE8] text-[#292524] border border-[#D4E2D4] text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                        veg
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3.5">
                  <div>
                    <h3 className="font-serif text-xl font-normal text-[#292524] line-clamp-1 group-hover:text-[#FF8577] transition-colors">
                      {f.name}
                    </h3>
                    <p className="font-mono text-[11px] text-[#78716C] mt-0.5">Per 100g portion</p>
                  </div>

                  {/* Macros breakdown grid */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { l: 'cal', v: `${f.calories?.toFixed(0)}`, highlight: true },
                      { l: 'pro', v: `${f.protein?.toFixed(1)}g`, highlight: false },
                      { l: 'crb', v: `${f.carbs?.toFixed(1)}g`, highlight: false },
                      { l: 'fat', v: `${f.fat?.toFixed(1)}g`, highlight: false },
                    ].map(({ l, v, highlight }) => (
                      <div key={l} className="bg-[#F7F6F2] border border-[#EDE8E3] rounded-2xl p-2">
                        <p className={`text-xs font-mono font-bold ${highlight ? 'text-[#FF8577]' : 'text-[#292524]'}`}>{v}</p>
                        <p className="text-[10px] font-mono text-[#78716C] uppercase mt-0.5">{l}</p>
                      </div>
                    ))}
                  </div>

                  {f.allergens && (
                    <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-2xl border border-amber-200">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
                      <span className="font-mono text-[11px]">Contains: {f.allergens}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
