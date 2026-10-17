import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, UtensilsCrossed, Apple, Sparkles, Camera,
  School, History, TrendingUp, User, LogOut, Cpu, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import AnimatedLogo from '../common/AnimatedLogo'
import RecommendationChat from './RecommendationChat'

const nav = [
  { to: '/dashboard',       icon: LayoutDashboard, label: 'Dashboard',         code: '01' },
  { to: '/log-meal',        icon: UtensilsCrossed, label: 'Log Meal',          code: '02' },
  { to: '/foods',           icon: Apple,           label: 'Food Database',     code: '03' },
  { to: '/recommendations', icon: Sparkles,        label: 'Recommendations',  code: '04' },
  { to: '/scan',            icon: Camera,          label: 'Scan Food',         code: '05' },
  { to: '/poshan',          icon: School,          label: 'PM POSHAN',         code: '06' },
  { to: '/history',         icon: History,         label: 'History',           code: '07' },
  { to: '/progress',        icon: TrendingUp,      label: 'Progress',          code: '08' },
  { to: '/profile',         icon: User,            label: 'Profile',           code: '09' },
  { to: '/patterns',        icon: Cpu,             label: 'Design Patterns',   code: '10' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white relative z-20 text-[#292524] select-none">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-[#EDE8E3] flex items-center justify-between">
        <AnimatedLogo size="md" showText={true} subtitle="mindful nutrition" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between px-3 mb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#78716C] font-semibold">
            [SYS // INDEX]
          </span>
          <span className="font-serif italic text-xs text-[#78716C]">
            wellness
          </span>
        </div>
        {nav.map(({ to, icon: Icon, label, code }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `group flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-[#FFB7B2] text-[#292524] font-bold shadow-sm scale-[1.02]'
                  : 'text-[#78716C] hover:bg-[#F7F6F2] hover:text-[#292524]'
              }`
            }>
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-[#292524]' : 'text-[#78716C] group-hover:scale-110 group-hover:text-[#292524]'}`} />
                  <span className="tracking-tight">{label}</span>
                </div>
                <span className={`font-mono text-[10px] tracking-wider ${isActive ? 'text-[#292524]/70 font-semibold' : 'text-[#A8A29E] group-hover:text-[#78716C]'}`}>
                  {code}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-[#EDE8E3] bg-[#FDFCF8]">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-[#EDE8E3] shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#FFEBEA] border border-[#FFD7D4] text-[#292524] font-mono font-bold flex items-center justify-center text-xs flex-shrink-0">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#292524] truncate">{user?.username}</p>
              <p className="font-mono text-[10px] text-[#78716C] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Disconnect session"
            className="p-1.5 text-[#78716C] hover:text-[#292524] hover:bg-[#F7F6F2] rounded-full transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2.5 px-2 flex items-center justify-between text-[10px] font-mono text-[#78716C]">
          <span>FIG. 00 // SESSION</span>
          <span className="text-[#292524] flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8577] animate-pulse" /> ONLINE
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-[#FDFCF8] text-[#292524] relative selection:bg-[#FFB7B2] selection:text-[#292524]">
      {/* Fixed opacity fractal noise overlay */}
      <div className="noise-overlay" />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-[#EDE8E3] flex-shrink-0 relative z-20">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-white shadow-2xl flex flex-col relative z-20 border-r border-[#EDE8E3]">
            <div className="absolute top-4 right-4 z-30">
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-full text-[#292524] bg-[#F7F6F2] hover:bg-[#EDE8E3]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* Main content container */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent relative z-10">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-5 py-3.5 bg-white border-b border-[#EDE8E3] relative z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="p-1.5 rounded-full text-[#292524] bg-[#F7F6F2] hover:bg-[#EDE8E3] transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <AnimatedLogo size="sm" showText={true} />
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-[#78716C] hover:text-[#292524] rounded-full">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 animate-reveal">
          <Outlet />
        </main>
      </div>
      <RecommendationChat />
    </div>
  )
}
