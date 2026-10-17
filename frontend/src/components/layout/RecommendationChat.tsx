import { FormEvent, KeyboardEvent, useState } from 'react'
import { Bot, ChevronDown, Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { dashboardApi, profileApi, recommendApi } from '../../api/services'

type FoodRecommendation = {
  foodId: number
  foodName: string
  category?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  score?: number
  reason?: string
  description?: string
  tags?: string[]
}

type ChatMessage = { role: 'assistant' | 'user'; text: string }

const prompts = ['High-protein ideas', 'Something light for dinner', 'What fits my goal?']

function makeReply(query: string, foods: FoodRecommendation[], profile: any, dashboard: any) {
  const q = query.toLowerCase()
  const wantsProtein = /protein|muscle|gain|strength/.test(q)
  const wantsLight = /light|low.?cal|less calorie|snack|low calorie/.test(q)
  const wantsFiber = /fiber|fibre|digestion|gut/.test(q)
  const wantsVeg = /vegetarian|vegan|plant/.test(q)
  const wantsBreakfast = /breakfast|morning/.test(q)
  const wantsDinner = /dinner|evening|supper/.test(q)

  let ranked = [...foods]
  if (wantsProtein) ranked.sort((a, b) => (b.protein ?? 0) - (a.protein ?? 0))
  else if (wantsLight) ranked.sort((a, b) => (a.calories ?? Infinity) - (b.calories ?? Infinity))
  else if (wantsFiber) ranked.sort((a, b) => Number(/high.?fibre|high.?fiber/i.test(b.tags?.join(' ') ?? '')) - Number(/high.?fibre|high.?fiber/i.test(a.tags?.join(' ') ?? '')))
  else ranked.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  const goal = profile?.goal?.replaceAll('_', ' ').toLowerCase() || dashboard?.activeGoal?.replaceAll('_', ' ').toLowerCase() || 'balanced nutrition'
  const remaining = Math.max(0, Math.round(dashboard?.caloriesRemaining ?? 0))
  const target = Math.round(dashboard?.calorieTarget ?? 0)
  const constraints = [profile?.dietType && profile.dietType !== 'NONE' ? `${profile.dietType.toLowerCase()} diet` : '', profile?.allergies ? `allergies listed in your profile (${profile.allergies})` : ''].filter(Boolean)
  const occasion = wantsDinner ? 'dinner' : wantsBreakfast ? 'breakfast' : 'your next meal'

  if (!ranked.length) return 'I couldn’t find any foods in your current recommendation list. Try updating your profile or opening Recommendations to refresh your matches.'

  const picks = ranked.slice(0, 3)
  const lines = picks.map((food, index) => {
    const portion = wantsProtein ? 150 : 100
    const multiplier = portion / 100
    const grams = (value = 0) => `${Number((value * multiplier).toFixed(1))}g`
    const why = food.reason || food.description || `It scored ${food.score ?? 'well'} against your profile.`
    return `${index + 1}. **${food.foodName}** — try about ${portion}g. That’s roughly ${Math.round((food.calories ?? 0) * multiplier)} kcal, ${grams(food.protein)} protein, ${grams(food.carbs)} carbs, and ${grams(food.fat)} fat. ${why}`
  })

  let intro = wantsProtein
    ? `For ${occasion === 'your next meal' ? 'your next meal' : `a protein-forward ${occasion}`}, these are the strongest options from your personalized matches:`
    : wantsLight
      ? `For a lighter ${occasion}, I’d start with the lower-calorie options in your personalized matches:`
      : wantsFiber
        ? `Here are your best current matches for a fibre-conscious choice. Nutrition values below are estimates based on the app’s per-100g food data:`
        : `Based on your ${goal} goal${wantsVeg ? ' and plant-focused preference' : ''}, here are some good options for ${occasion}:`

  const dailyContext = target ? `You’ve got about ${remaining} kcal remaining from your ${target} kcal daily target today.` : ''
  const caution = constraints.length ? `Your recommendations account for your ${constraints.join(' and ')}.` : ''
  const portionTip = wantsProtein
    ? 'Pair one with vegetables and a grain or other energy source to make it a more complete meal.'
    : 'Use the 100g figures as a guide; actual nutrition changes with portion size and preparation.'

  return [intro, ...lines, [dailyContext, caution, portionTip].filter(Boolean).join(' ')].join('\n\n')
}

export default function RecommendationChat() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hi! I can help you choose meals using your goal, dietary preferences, and today’s nutrition progress. What are you looking for?' },
  ])
  const send = async (text: string) => {
    const query = text.trim()
    if (!query || busy) return
    setDraft('')
    setError('')
    setMessages(prev => [...prev, { role: 'user', text: query }])
    setBusy(true)
    try {
      const [recommendations, profile, dashboard] = await Promise.all([
        recommendApi.get(30),
        profileApi.get().catch(() => ({ data: null })),
        dashboardApi.get().catch(() => ({ data: null })),
      ])
      const reply = makeReply(query, recommendations.data || [], profile.data, dashboard.data)
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch {
      setError('I couldn’t load your personalized recommendations. Please try again in a moment.')
    } finally {
      setBusy(false)
    }
  }

  const submit = (event: FormEvent) => { event.preventDefault(); void send(draft) }
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void send(draft) }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] sm:bottom-6 sm:right-6">
      {open && (
        <section aria-label="SmartMeal recommendation chat" className="mb-3 flex h-[min(680px,calc(100dvh-112px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-[28px] border border-[#EDE8E3] bg-[#FDFCF8] shadow-[0_24px_80px_-18px_rgba(41,37,36,0.3)]">
          <header className="flex items-center justify-between bg-white px-5 py-4 border-b border-[#EDE8E3]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFEBEA] text-[#FF8577]"><Sparkles className="h-5 w-5" /></div>
              <div><p className="font-serif text-lg leading-tight">Meal companion</p><p className="font-mono text-[10px] uppercase tracking-wider text-[#78716C]">Personalized for you</p></div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Minimize chat" className="rounded-full p-2 text-[#78716C] hover:bg-[#F7F6F2]"><ChevronDown className="h-5 w-5" /></button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
            <div className="mx-auto w-fit rounded-full border border-[#EDE8E3] bg-white px-3 py-1 font-mono text-[9px] tracking-wide text-[#78716C]">PROFILE + DAILY NUTRITION CONTEXT</div>
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#FFEBEA] text-[#FF8577]"><Bot className="h-4 w-4" /></div>}
                <div className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-3.5 py-3 text-[13px] leading-relaxed ${message.role === 'user' ? 'rounded-br-md bg-[#292524] text-white' : 'rounded-bl-md border border-[#EDE8E3] bg-white text-[#292524]'}`}>
                  {message.text.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => part.startsWith('**') && part.endsWith('**') ? <strong key={partIndex}>{part.slice(2, -2)}</strong> : part)}
                </div>
              </div>
            ))}
            {busy && <div className="flex items-center gap-2 pl-9 text-xs text-[#78716C]"><Loader2 className="h-4 w-4 animate-spin" />Finding matches for you…</div>}
            {error && <p role="alert" className="ml-9 rounded-xl bg-[#FFEBEA] p-3 text-xs text-[#8D3830]">{error}</p>}
          </div>

          {messages.length === 1 && <div className="flex gap-2 overflow-x-auto px-4 pb-3">{prompts.map(prompt => <button key={prompt} onClick={() => void send(prompt)} className="shrink-0 rounded-full border border-[#EDE8E3] bg-white px-3 py-1.5 text-[11px] font-medium text-[#57534E] hover:border-[#FFB7B2]">{prompt}</button>)}</div>}
          <form onSubmit={submit} className="border-t border-[#EDE8E3] bg-white p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-[#EDE8E3] bg-[#FDFCF8] p-2 focus-within:border-[#FFB7B2] focus-within:ring-2 focus-within:ring-[#FFB7B2]/20">
              <textarea value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={handleKeyDown} rows={1} maxLength={500} aria-label="Ask for a meal recommendation" placeholder="Ask for a meal idea…" className="max-h-24 min-h-[38px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-[#A8A29E]" />
              <button type="submit" disabled={!draft.trim() || busy} aria-label="Send message" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFB7B2] text-[#292524] transition hover:bg-[#FFA5A0] disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /></button>
            </div>
            <p className="mt-1.5 px-1 text-center font-mono text-[9px] text-[#A8A29E]">Nutrition estimates are informational and depend on portion and preparation.</p>
          </form>
        </section>
      )}
      <button onClick={() => setOpen(value => !value)} aria-label={open ? 'Close meal companion' : 'Open meal companion'} aria-expanded={open} className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#292524] text-white shadow-[0_8px_30px_-8px_rgba(41,37,36,0.55)] transition duration-200 hover:-translate-y-1 hover:bg-[#FF8577] hover:text-[#292524] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFB7B2]/50">
        {open ? <X className="h-5 w-5" /> : <><MessageCircle className="h-5 w-5" /><span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-[#FDFCF8] bg-[#A3C4A2]" /></>}
      </button>
    </div>
  )
}
