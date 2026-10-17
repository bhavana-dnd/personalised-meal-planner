import { useState } from 'react'

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
  subtitle?: string
}

export default function AnimatedLogo({
  size = 'md',
  className = '',
  showText = false,
  subtitle = 'mindful nutrition & wellness',
}: AnimatedLogoProps) {
  const [hovered, setHovered] = useState(false)

  const sizeMap = {
    sm: { box: 'w-8 h-8', text: 'text-base', sub: 'text-xs' },
    md: { box: 'w-10 h-10', text: 'text-lg', sub: 'text-sm' },
    lg: { box: 'w-12 h-12', text: 'text-xl', sub: 'text-base' },
    xl: { box: 'w-14 h-14', text: 'text-2xl', sub: 'text-lg' },
  }

  const s = sizeMap[size]

  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {/* Emblem with Coral Pink Accent */}
      <div
        className={`relative ${s.box} rounded-[14px] bg-white border border-[#EDE8E3] flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          hovered ? 'border-[#FFB7B2] shadow-pink-glow scale-105' : 'shadow-sm'
        }`}>
        {/* Coral Pink Subtle Glow */}
        <div
          className={`absolute inset-0 rounded-[14px] bg-[#FFB7B2]/20 blur-[6px] transition-opacity duration-300 pointer-events-none ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Vector Botanical Glyph */}
        <svg
          viewBox="0 0 32 32"
          className="relative z-10 w-[68%] h-[68%]"
          style={{
            shapeRendering: 'geometricPrecision',
          }}>
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke="#EDE8E3"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Base Dish */}
          <path
            d="M 8 18 C 8 25, 24 25, 24 18 Z"
            fill="#E8EFE8"
            stroke="#D4E2D4"
            strokeWidth="1"
          />

          {/* Sprout Leaf in Coral Pink (#FFB7B2) */}
          <g
            className="transition-transform duration-500"
            style={{
              transformOrigin: '16px 18px',
              transform: hovered ? 'rotate(8deg) scale(1.05)' : 'none',
            }}>
            <path
              d="M 16 18 C 12 11, 19 6, 23 5 C 23 10, 21 15, 16 18 Z"
              fill="#FFB7B2"
            />
            {/* Center vein */}
            <path
              d="M 16 18 C 18 13, 20 10, 22 6"
              stroke="#292524"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </g>

          {/* Secondary Sage Sprout */}
          <path
            d="M 16 18 C 19 13, 13 9, 10 9 C 11 13, 12 16, 16 18 Z"
            fill="#A3C4A2"
            opacity="0.85"
          />

          {/* Focal Node */}
          <circle cx="16" cy="18" r="1.5" fill="#FFB7B2" />
        </svg>
      </div>

      {showText && (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`font-serif italic font-normal ${s.text} text-[#292524] tracking-tight leading-tight block`}>
              SmartMeal
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-[#FFEBEA] text-[#292524] border border-[#FFD7D4] uppercase tracking-widest font-bold">
              app
            </span>
          </div>
          {subtitle && (
            <span
              className={`font-serif italic text-xs text-[#78716C] block leading-none mt-0.5 font-light`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
