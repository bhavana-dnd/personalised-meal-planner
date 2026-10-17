import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Lock, Mail, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react'
import FoodImage from '../components/common/FoodImage'
import AnimatedLogo from '../components/common/AnimatedLogo'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { data } = await authApi.register(form.username, form.email, form.password)
      login(data)
      toast.success('Account created!')
      navigate('/profile')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8] p-4 sm:p-6 lg:p-8 relative selection:bg-[#FFB7B2] selection:text-[#292524]">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Subtle organic ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFEBEA]/70 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E8EFE8]/70 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-4xl bg-white border border-[#EDE8E3] rounded-[24px] shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 animate-reveal">
        {/* Visual Brand Panel */}
        <div className="relative hidden md:flex flex-col justify-between p-8 bg-gradient-to-b from-[#FFEBEA]/50 via-[#FDFCF8] to-[#E8EFE8]/50 border-r border-[#EDE8E3] overflow-hidden">
          <div className="relative z-10">
            <div className="mb-6">
              <AnimatedLogo size="lg" showText={true} subtitle="telemetry & nutrition" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2.5 py-0.5 rounded-full uppercase font-bold">
                  [ 00 // REGISTRATION ]
                </span>
                <span className="font-serif italic text-sm text-[#78716C]">
                  begin with calibrated targets
                </span>
              </div>
              <h2 className="text-3xl font-light text-[#292524] tracking-tight leading-snug">
                Start your journey to <em className="italic font-normal text-[#FF8577]">balance</em>.
              </h2>
              <p className="text-sm text-[#78716C] leading-relaxed font-sans">
                Create an account to configure basal metabolic rates, automated macronutrient targets, and track nutrition telemetry.
              </p>
            </div>

            <div className="mt-6 space-y-2.5">
              {[
                'Automated Mifflin-St Jeor TDEE & macro formulas',
                'Visual food database and calibrated meal logging',
                'National PM POSHAN regional menu monitoring',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-[#292524] bg-white px-3.5 py-2 rounded-2xl border border-[#EDE8E3] shadow-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#FF8577] flex-shrink-0" />
                  <span className="font-sans">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 my-4 group">
            <div className="rounded-[20px] overflow-hidden border border-[#EDE8E3] shadow-sm group-hover:border-[#FFB7B2] transition-all duration-500">
              <FoodImage
                name="salad"
                category="VEGETABLE"
                className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Fresh wholesome salad"
              />
            </div>
          </div>

          <div className="relative z-10 pt-3 border-t border-[#EDE8E3] text-xs text-[#78716C] flex items-center justify-between font-mono">
            <span className="text-[11px]">[PRIVACY: LOCAL SESSION]</span>
            <span className="font-serif italic text-xs text-[#78716C]">pure awareness</span>
          </div>
        </div>

        {/* Register Form Panel */}
        <div className="p-6 sm:p-10 flex flex-col justify-center bg-white">
          {/* Mobile Logo */}
          <div className="md:hidden mb-6">
            <AnimatedLogo size="md" showText={true} subtitle="telemetry & nutrition" />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] tracking-widest text-[#292524] bg-[#FFEBEA] border border-[#FFD7D4] px-2.5 py-0.5 rounded-full uppercase font-bold">
                [ NEW USER ]
              </span>
              <span className="font-serif italic text-sm text-[#78716C]">
                nourish your body · join today
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-[#292524] tracking-tight">
              Create an <em className="italic font-normal text-[#FF8577]">account</em>
            </h1>
            <p className="text-sm text-[#78716C] mt-1 font-sans">Set up your profile to activate your personal nutrition telemetry.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">USERNAME</label>
              <div className="relative">
                <input
                  className="input pl-10"
                  placeholder="e.g. ananya"
                  value={form.username}
                  onChange={set('username')}
                  required
                />
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-[#78716C]" />
              </div>
            </div>

            <div>
              <label className="label">EMAIL ADDRESS</label>
              <div className="relative">
                <input
                  className="input pl-10"
                  type="email"
                  placeholder="ananya@example.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#78716C]" />
              </div>
            </div>

            <div>
              <label className="label">PASSWORD</label>
              <div className="relative">
                <input
                  className="input pl-10"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={set('password')}
                  required
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#78716C]" />
              </div>
            </div>

            <button className="btn-primary w-full py-3 mt-3 group" disabled={loading}>
              {loading ? (
                'creating account…'
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#78716C] mt-6 font-sans">
            Already have an account?{' '}
            <Link to="/login" className="text-[#292524] font-bold underline decoration-[#FFB7B2] decoration-2 underline-offset-4 hover:text-[#FF8577] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
