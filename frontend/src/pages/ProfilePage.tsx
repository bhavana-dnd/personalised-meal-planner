import { useEffect, useState } from 'react'
import { profileApi, dashboardApi } from '../api/services'
import { User, Target, Save, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const GOALS = ['WEIGHT_LOSS', 'MUSCLE_GAIN', 'MAINTENANCE', 'BALANCED']
const ACTIVITY = ['SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE']
const DIETS = ['NONE', 'VEGETARIAN', 'VEGAN']
const GENDERS = ['MALE', 'FEMALE', 'OTHER']
const USER_TYPES = ['GENERAL', 'CHILD_POSHAN']

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [targets, setTargets] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([profileApi.get(), dashboardApi.targets()])
      .then(([p, t]) => {
        setProfile(p.data)
        setTargets(t.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setProfile((p: any) => ({ ...p, [k]: e.target.value }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await profileApi.update({
        age: Number(profile.age),
        gender: profile.gender,
        heightCm: Number(profile.heightCm),
        weightKg: Number(profile.weightKg),
        activityLevel: profile.activityLevel,
        goal: profile.goal,
        dietType: profile.dietType,
        allergies: profile.allergies,
        likedFoods: profile.likedFoods,
        dislikedFoods: profile.dislikedFoods,
        userType: profile.userType,
      })
      setProfile(data)
      dashboardApi.targets().then(r => setTargets(r.data))
      toast.success('Profile and nutrition targets updated!')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-10 h-10 border-2 border-[#FFB7B2] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs uppercase tracking-wider text-[#78716C]">Loading user profile…</span>
      </div>
    )

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#EDE8E3]">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFB7B2] border border-[#FF9E99] px-2.5 py-0.5 rounded-full uppercase font-bold">
              [ 09 // SOMATIC PROFILE ]
            </span>
            <span className="font-serif italic text-sm text-[#78716C]">
              tailored parameters · metabolic formula
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-light text-[#292524] tracking-tight font-serif">
            Nutrition <em className="italic font-normal text-[#FF8577]">profile</em>
          </h1>
          <p className="text-sm text-[#78716C] mt-2 font-sans leading-relaxed">
            Personalize biometrics and dietary preferences for automated Mifflin-St Jeor macro calculations.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#78716C] bg-white border border-[#EDE8E3] px-3.5 py-2 rounded-full shadow-soft">
          <User className="w-4 h-4 text-[#FF8577]" />
          <span>CONFIG SYNC</span>
        </div>
      </div>

      {/* Calculated targets card */}
      {targets && (
        <div className="card rounded-[24px] bg-white border border-[#EDE8E3] p-6 space-y-4 shadow-soft">
          <div className="flex items-center justify-between pb-2 border-b border-[#EDE8E3]">
            <h3 className="font-mono text-xs text-[#292524] font-bold uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-[#FF8577]" /> CALCULATED DAILY METRICS
            </h3>
            <span className="font-mono text-[10px] text-[#78716C]">MIFFLIN-ST JEOR</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { label: 'BMR', val: `${targets.bmr} kcal`, sub: 'Basal metabolic', highlight: false },
              { label: 'TDEE', val: `${targets.tdee} kcal`, sub: 'Total energy', highlight: false },
              { label: 'Target', val: `${targets.calorieTarget} kcal`, sub: 'Adjusted goal', highlight: true },
              { label: 'Protein', val: `${targets.proteinTargetG}g`, sub: 'Daily quota', highlight: true },
            ].map(({ label, val, sub, highlight }) => (
              <div key={label} className={`border rounded-2xl p-3.5 shadow-sm ${highlight ? 'bg-[#FFF4F2] border-[#FFB7B2]/50' : 'bg-[#FAF8F5] border-[#EDE8E3]'}`}>
                <p className={`text-base sm:text-lg font-mono font-bold ${highlight ? 'text-[#292524]' : 'text-[#292524]'}`}>{val}</p>
                <p className="text-xs font-mono text-[#78716C] uppercase mt-0.5">{label}</p>
                <p className="text-[10px] font-sans text-[#78716C]">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={save} className="space-y-6">
        {/* Basic Biometrics */}
        <div className="card rounded-[24px] space-y-4 p-6 shadow-soft bg-white border border-[#EDE8E3]">
          <div className="flex items-center justify-between pb-2 border-b border-[#EDE8E3]">
            <h3 className="font-serif text-2xl font-light text-[#292524] tracking-tight">Basic biometrics</h3>
            <span className="font-serif italic text-xs text-[#78716C]">body measurements</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">AGE (YEARS)</label>
              <input
                className="input rounded-2xl"
                type="number"
                min="5"
                max="120"
                value={profile?.age || ''}
                onChange={set('age')}
                required
              />
            </div>
            <div>
              <label className="label">GENDER</label>
              <select
                className="input rounded-2xl"
                value={profile?.gender || 'MALE'}
                onChange={set('gender')}>
                {GENDERS.map(g => (
                  <option key={g} value={g} className="bg-white text-[#292524]">
                    {g.toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">HEIGHT (CM)</label>
              <input
                className="input rounded-2xl"
                type="number"
                min="50"
                max="250"
                value={profile?.heightCm || ''}
                onChange={set('heightCm')}
                required
              />
            </div>
            <div>
              <label className="label">WEIGHT (KG)</label>
              <input
                className="input rounded-2xl"
                type="number"
                min="10"
                max="500"
                step="0.1"
                value={profile?.weightKg || ''}
                onChange={set('weightKg')}
                required
              />
            </div>
          </div>
        </div>

        {/* Goals & Activity */}
        <div className="card rounded-[24px] space-y-4 p-6 shadow-soft bg-white border border-[#EDE8E3]">
          <div className="flex items-center justify-between pb-2 border-b border-[#EDE8E3]">
            <h3 className="font-serif text-2xl font-light text-[#292524] tracking-tight">Goals & activity</h3>
            <span className="font-serif italic text-xs text-[#FF8577]">strategy selector</span>
          </div>

          <div>
            <label className="label">ACTIVITY LEVEL</label>
            <select
              className="input rounded-2xl"
              value={profile?.activityLevel || 'MODERATE'}
              onChange={set('activityLevel')}>
              {ACTIVITY.map(a => (
                <option key={a} value={a} className="bg-white text-[#292524]">
                  {a.replace('_', ' ').toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">
              PRIMARY GOAL <span className="text-[10px] text-[#78716C] lowercase font-mono">(selects recommendation strategy)</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {GOALS.map(g => {
                const isSelected = profile?.goal === g
                return (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setProfile((p: any) => ({ ...p, goal: g }))}
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-mono tracking-wider transition-all text-left flex items-center justify-between border ${
                      isSelected
                        ? 'bg-[#FFB7B2] text-[#292524] font-bold border-[#FF9E99] shadow-soft scale-102'
                        : 'bg-[#FAF8F5] text-[#78716C] border-[#EDE8E3] hover:text-[#292524] hover:bg-white'
                    }`}>
                    <span>{g.replace('_', ' ').toLowerCase()}</span>
                    {isSelected && <Check className="w-4 h-4 ml-1 text-[#292524]" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="label">DIET TYPE</label>
            <div className="flex gap-2 flex-wrap">
              {DIETS.map(d => {
                const isSelected = profile?.dietType === d
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setProfile((p: any) => ({ ...p, dietType: d }))}
                    className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all border ${
                      isSelected
                        ? 'bg-[#FFB7B2] text-[#292524] font-bold border-[#FF9E99] shadow-soft'
                        : 'bg-[#FAF8F5] text-[#78716C] border-[#EDE8E3] hover:text-[#292524] hover:bg-white'
                    }`}>
                    {d.toLowerCase()}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="label">USER TYPE</label>
            <div className="flex gap-2 flex-wrap">
              {USER_TYPES.map(t => {
                const isSelected = profile?.userType === t
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setProfile((p: any) => ({ ...p, userType: t }))}
                    className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all border ${
                      isSelected
                        ? 'bg-[#FFB7B2] text-[#292524] font-bold border-[#FF9E99] shadow-soft'
                        : 'bg-[#FAF8F5] text-[#78716C] border-[#EDE8E3] hover:text-[#292524] hover:bg-white'
                    }`}>
                    {t === 'CHILD_POSHAN' ? 'PM POSHAN Monitor' : 'General Consumer'}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Preferences & Allergies */}
        <div className="card rounded-[24px] space-y-4 p-6 shadow-soft bg-white border border-[#EDE8E3]">
          <div className="flex items-center justify-between pb-2 border-b border-[#EDE8E3]">
            <h3 className="font-serif text-2xl font-light text-[#292524] tracking-tight">Dietary preferences & allergies</h3>
            <span className="font-serif italic text-xs text-[#78716C]">filtering rules</span>
          </div>

          <div>
            <label className="label">
              ALLERGIES <span className="text-[10px] text-[#78716C] lowercase font-mono">(comma-separated: e.g. nuts, dairy)</span>
            </label>
            <input
              className="input rounded-2xl"
              placeholder="e.g. nuts, dairy, gluten"
              value={profile?.allergies || ''}
              onChange={set('allergies')}
            />
          </div>

          <div>
            <label className="label">
              LIKED FOODS <span className="text-[10px] text-[#78716C] lowercase font-mono">(prioritized in strategy ranking)</span>
            </label>
            <input
              className="input rounded-2xl"
              placeholder="e.g. chicken breast, spinach, dal, paneer"
              value={profile?.likedFoods || ''}
              onChange={set('likedFoods')}
            />
          </div>

          <div>
            <label className="label">
              DISLIKED FOODS <span className="text-[10px] text-[#78716C] lowercase font-mono">(filtered out of recommendations)</span>
            </label>
            <input
              className="input rounded-2xl"
              placeholder="e.g. bitter gourd, okra, mutton"
              value={profile?.dislikedFoods || ''}
              onChange={set('dislikedFoods')}
            />
          </div>
        </div>

        <button className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 group" disabled={saving}>
          <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>{saving ? 'updating profile…' : 'save profile & recalculate'}</span>
        </button>
      </form>

      <p className="font-mono text-[11px] text-[#78716C] text-center leading-relaxed">
        [ SMARTMEAL IS AN EDUCATIONAL METABOLIC TOOL · CONSULT A MEDICAL DIETITIAN FOR CLINICAL THERAPY ]
      </p>
    </div>
  )
}
