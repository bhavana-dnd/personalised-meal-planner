import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Lock, User as UserIcon, ArrowRight, Cpu } from 'lucide-react'
import FoodImage from '../components/common/FoodImage'
import AnimatedLogo from '../components/common/AnimatedLogo'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authApi.login(form.username, form.password)
      login(data)
      toast.success(`Welcome back, ${data.username}!`)
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (username: string, pass: string) => {
    setForm({ username, password: pass })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8] p-4 sm:p-6 lg:p-8 relative selection:bg-[#FFB7B2] selection:text-[#292524]">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Subtle organic ambient glow in soft pink/sage */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFEBEA]/70 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E8EFE8]/70 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-4xl bg-white border border-[#EDE8E3] rounded-[24px] shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 animate-reveal">
        {/* Visual Brand Panel with Animated Logo & Real Food Photo */}
        <div className="relative hidden md:flex flex-col justify-between p-8 bg-gradient-to-b from-[#FFEBEA]/50 via-[#FDFCF8] to-[#E8EFE8]/50 border-r border-[#EDE8E3] overflow-hidden">
          <div className="relative z-10">
            <div className="mb-6">
              <AnimatedLogo size="lg" showText={true} subtitle="telemetry & nutrition" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2.5 py-0.5 rounded-full uppercase font-bold">
                  [ 01 // AUTHENTICATION ]
                </span>
                <span className="font-serif italic text-sm text-[#78716C]">
                  nourish your body with purpose
                </span>
              </div>
              <h2 className="text-3xl font-light text-[#292524] tracking-tight leading-snug">
                Mindful nutrition <em className="italic font-normal text-[#FF8577]">precision</em>.
              </h2>
              <p className="text-sm text-[#78716C] leading-relaxed font-sans">
                Real-time telemetry, automated macronutrient targets, and validated regional Indian meal composition.
              </p>
            </div>
          </div>

          {/* Real Food Picture Feature with High Rendering */}
          <div className="relative z-10 my-6 group">
            <div className="rounded-[20px] overflow-hidden border border-[#EDE8E3] shadow-sm group-hover:border-[#FFB7B2] transition-all duration-500">
              <FoodImage
                name="rice"
                category="GRAIN"
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Nutritious wholesome meal"
              />
            </div>
            <div className="flex items-center justify-between mt-2.5 px-1 font-mono text-[11px] text-[#78716C]">
              <span>[FIG. 00 // STAPLE PLATE]</span>
              <span className="font-serif italic text-xs text-[#78716C]">handcrafted for daily life</span>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-[#EDE8E3] flex items-center justify-between text-xs text-[#78716C]">
            <span className="font-mono text-[11px]">ISWE404L · DESIGN PATTERNS</span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#292524] bg-white px-2.5 py-1 rounded-full border border-[#EDE8E3] shadow-sm">
              <Cpu className="w-3 h-3 text-[#FF8577]" /> SPRING BOOT + REACT
            </span>
          </div>
        </div>

        {/* Login Form Panel */}
        <div className="p-6 sm:p-10 flex flex-col justify-center bg-white">
          {/* Mobile Logo */}
          <div className="md:hidden mb-6">
            <AnimatedLogo size="md" showText={true} subtitle="telemetry & nutrition" />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2.5 py-0.5 rounded-full uppercase font-bold">
                [ SIGN IN ]
              </span>
              <span className="font-serif italic text-sm text-[#78716C]">
                gentle check-in · welcome back
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-[#292524] tracking-tight">
              Access your <em className="italic font-normal text-[#FF8577]">account</em>
            </h1>
            <p className="text-sm text-[#78716C] mt-1 font-sans">Enter credentials to synchronize your daily telemetry.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">USERNAME</label>
              <div className="relative">
                <input
                  className="input pl-10"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  required
                />
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-[#78716C]" />
              </div>
            </div>

            <div>
              <label className="label">PASSWORD</label>
              <div className="relative">
                <input
                  className="input pl-10"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#78716C]" />
              </div>
            </div>

            <button className="btn-primary w-full py-3 mt-3 group" disabled={loading}>
              {loading ? (
                'authenticating…'
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="mt-6 p-4 bg-[#F7F6F2] rounded-[20px] border border-[#EDE8E3] text-xs text-[#78716C]">
            <p className="font-mono text-[11px] text-[#292524] uppercase tracking-wider mb-2 flex items-center justify-between font-bold">
              <span>Demo accounts (click to fill):</span>
              <span className="font-serif italic text-xs text-[#FF8577] lowercase font-normal">quick test</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillDemo('demo', 'demo123')}
                className="px-3 py-1.5 bg-white hover:bg-[#FFB7B2] hover:text-[#292524] border border-[#EDE8E3] rounded-full text-xs font-mono text-[#292524] transition-all hover:scale-105 shadow-sm font-semibold">
                demo / demo123
              </button>
              <button
                type="button"
                onClick={() => fillDemo('priya', 'priya123')}
                className="px-3 py-1.5 bg-white hover:bg-[#FFB7B2] hover:text-[#292524] border border-[#EDE8E3] rounded-full text-xs font-mono text-[#292524] transition-all hover:scale-105 shadow-sm font-semibold">
                priya / priya123
              </button>
              <button
                type="button"
                onClick={() => fillDemo('poshan_monitor', 'poshan123')}
                className="px-3 py-1.5 bg-white hover:bg-[#FFB7B2] hover:text-[#292524] border border-[#EDE8E3] rounded-full text-xs font-mono text-[#292524] transition-all hover:scale-105 shadow-sm font-semibold">
                poshan_monitor
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-[#78716C] mt-6 font-sans">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#292524] font-bold underline decoration-[#FFB7B2] decoration-2 underline-offset-4 hover:text-[#FF8577] transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
