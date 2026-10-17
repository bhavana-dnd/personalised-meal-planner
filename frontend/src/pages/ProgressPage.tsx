import { useEffect, useState } from 'react'
import { weightApi } from '../api/services'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Plus, ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProgressPage() {
  const [history, setHistory] = useState<any[]>([])
  const [form, setForm] = useState({ weightKg: '', notes: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () =>
    weightApi
      .history()
      .then(r => setHistory(r.data || []))
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await weightApi.log({ weightKg: Number(form.weightKg), notes: form.notes })
      toast.success('Weight entry recorded!')
      setForm({ weightKg: '', notes: '' })
      load()
    } catch {
      toast.error('Failed to log weight')
    } finally {
      setSaving(false)
    }
  }

  const chartData = history.map(h => ({
    date: new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    weight: h.weightKg,
  }))

  const latest = history[history.length - 1]?.weightKg
  const first = history[0]?.weightKg
  const diff = latest && first ? (latest - first).toFixed(1) : null

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#EDE8E3]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2.5 py-0.5 rounded-full uppercase font-bold">
              [ 08 // BIOMETRICS ]
            </span>
            <span className="font-serif italic text-sm text-[#78716C]">
              track your flow · somatic trend
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-light text-[#292524] tracking-tight">
            Weight & <em className="italic font-normal text-[#FF8577]">progress</em>
          </h1>
          <p className="text-sm text-[#78716C] mt-2 font-sans max-w-2xl leading-relaxed">
            Monitor body mass trends and caloric consistency towards your target goal.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#78716C] bg-white border border-[#EDE8E3] px-3.5 py-2 rounded-full shadow-sm">
          <TrendingUp className="w-4 h-4 text-[#FF8577]" />
          <span>WEIGHT TELEMETRY</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-10 h-10 border-2 border-[#FFB7B2] border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#78716C]">Loading progress metrics…</span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          {history.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card rounded-[24px] text-center p-6 bg-white border-[#EDE8E3] shadow-sm hover:border-[#FFB7B2] transition-all">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Current Weight</p>
                <p className="text-4xl font-mono font-bold text-[#292524] mt-1.5 tracking-tight">
                  {latest} <span className="text-sm font-normal text-[#78716C]">kg</span>
                </p>
                <p className="font-serif italic text-xs text-[#78716C] mt-1">most recent entry</p>
              </div>

              <div className="card rounded-[24px] text-center p-6 bg-white border-[#EDE8E3] shadow-sm hover:border-[#FFB7B2] transition-all">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Starting Weight</p>
                <p className="text-4xl font-mono font-bold text-[#292524] mt-1.5 tracking-tight">
                  {first} <span className="text-sm font-normal text-[#78716C]">kg</span>
                </p>
                <p className="font-serif italic text-xs text-[#78716C] mt-1">initial recorded baseline</p>
              </div>

              <div className="card rounded-[24px] text-center p-6 bg-white border-[#EDE8E3] shadow-sm hover:border-[#FFB7B2] transition-all">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Net Trajectory</p>
                <div className="flex items-center justify-center gap-1.5 mt-1.5">
                  {diff !== null && Number(diff) < 0 && <ArrowDownRight className="w-6 h-6 text-[#A3C4A2]" />}
                  {diff !== null && Number(diff) > 0 && <ArrowUpRight className="w-6 h-6 text-[#FF8577]" />}
                  {diff !== null && Number(diff) === 0 && <Minus className="w-6 h-6 text-[#78716C]" />}
                  <p
                    className={`text-4xl font-mono font-bold tracking-tight ${
                      Number(diff) < 0 ? 'text-[#A3C4A2]' : Number(diff) > 0 ? 'text-[#FF8577]' : 'text-[#292524]'
                    }`}>
                    {diff !== null ? `${Number(diff) > 0 ? '+' : ''}${diff}` : '—'}
                    <span className="text-sm font-normal text-[#78716C] ml-1">kg</span>
                  </p>
                </div>
                <p className="font-serif italic text-xs text-[#78716C] mt-1">since inception</p>
              </div>
            </div>
          )}

          {/* Weight Chart with Coral Pink Line */}
          {chartData.length > 1 && (
            <div className="card rounded-[24px] p-6 space-y-4 shadow-sm bg-white border border-[#EDE8E3]">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE8E3]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-2xl font-light text-[#292524] tracking-tight">Weight trajectory</h3>
                    <span className="font-serif italic text-xs text-[#FF8577]">historical progression</span>
                  </div>
                  <p className="font-mono text-xs text-[#78716C] mt-0.5">Continuous somatic recording</p>
                </div>
                <span className="bg-[#FFEBEA] border border-[#FFD7D4] text-xs font-mono text-[#292524] px-3 py-1 rounded-full font-bold">
                  {chartData.length} records
                </span>
              </div>

              <div className="pt-2">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#78716C', fontFamily: 'JetBrains Mono' }}
                      stroke="#EDE8E3"
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 11, fill: '#78716C', fontFamily: 'JetBrains Mono' }}
                      stroke="#EDE8E3"
                      unit=" kg"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #EDE8E3',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#292524',
                        fontFamily: 'JetBrains Mono',
                      }}
                      formatter={(v: any) => [`${v} kg`, 'Body Weight']}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#FFB7B2"
                      strokeWidth={3.5}
                      dot={{ fill: '#FFB7B2', r: 5, strokeWidth: 2, stroke: '#FFFFFF' }}
                      activeDot={{ fill: '#292524', r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Log weight card */}
          <div className="card rounded-[24px] p-6 space-y-3.5 shadow-sm bg-white border border-[#EDE8E3]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-light text-[#292524] tracking-tight">Log today's weight</h3>
                <span className="font-serif italic text-xs text-[#78716C]">morning check-in</span>
              </div>
              <p className="font-mono text-xs text-[#78716C] mt-0.5">
                Record your body mass in the morning under standard fasted conditions.
              </p>
            </div>

            <form onSubmit={submit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <div className="flex-1 flex items-center bg-white border border-[#EDE8E3] rounded-2xl px-3.5 py-1.5 shadow-sm">
                <input
                  className="w-full text-sm py-2 text-[#292524] font-mono font-bold bg-transparent focus:outline-none"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 72.5"
                  value={form.weightKg}
                  onChange={e => setForm(f => ({ ...f, weightKg: e.target.value }))}
                  required
                />
                <span className="text-xs font-mono text-[#78716C] ml-2">kg</span>
              </div>

              <div className="flex-1">
                <input
                  className="input rounded-2xl"
                  placeholder="Optional note: e.g. post-workout, fasted"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>

              <button className="btn-primary sm:w-auto py-3 px-6 flex-shrink-0 group" disabled={saving}>
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span>{saving ? 'saving…' : 'record weight'}</span>
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
