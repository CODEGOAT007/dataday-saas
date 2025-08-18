// MyDataDay Circular Logo Collection - 30 Professional Options
import React from 'react'

interface LogoProps {
  className?: string
  variant?: 'default' | 'white' | 'dark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Base circular container for all logos
const CircularBase = ({ children, className = '', variant = 'default', size = 'md' }: {
  children: React.ReactNode
} & LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const bgClasses = {
    default: 'bg-blue-600',
    white: 'bg-white',
    dark: 'bg-gray-900'
  }

  return (
    <div className={`${sizeClasses[size]} ${bgClasses[variant]} rounded-full flex items-center justify-center ${className}`}>
      {children}
    </div>
  )
}

// === DATA & ANALYTICS CATEGORY (1-10) ===

// 1. Rising Bar Chart
export function Logo01_RisingBars({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <rect x="2" y="14" width="2" height="4" />
        <rect x="6" y="10" width="2" height="8" />
        <rect x="10" y="6" width="2" height="12" />
        <rect x="14" y="2" width="2" height="16" />
      </svg>
    </CircularBase>
  )
}

// 2. Pie Chart
export function Logo02_PieChart({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="10" cy="10" r="7" />
        <path d="M10 3 L10 10 L17 10" />
      </svg>
    </CircularBase>
  )
}

// 3. Line Graph
export function Logo03_LineGraph({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 15 L7 9 L11 12 L17 4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="3" cy="15" r="1" fill="currentColor" />
        <circle cx="7" cy="9" r="1" fill="currentColor" />
        <circle cx="11" cy="12" r="1" fill="currentColor" />
        <circle cx="17" cy="4" r="1" fill="currentColor" />
      </svg>
    </CircularBase>
  )
}

// 4. Data Points
export function Logo04_DataPoints({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <circle cx="4" cy="4" r="1.5" />
        <circle cx="10" cy="6" r="1.5" />
        <circle cx="16" cy="4" r="1.5" />
        <circle cx="4" cy="10" r="1.5" />
        <circle cx="10" cy="10" r="2" />
        <circle cx="16" cy="10" r="1.5" />
        <circle cx="4" cy="16" r="1.5" />
        <circle cx="10" cy="14" r="1.5" />
        <circle cx="16" cy="16" r="1.5" />
      </svg>
    </CircularBase>
  )
}

// 5. Dashboard Grid
export function Logo05_Dashboard({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <rect x="2" y="2" width="6" height="6" rx="1" />
        <rect x="12" y="2" width="6" height="3" rx="1" />
        <rect x="12" y="8" width="6" height="3" rx="1" />
        <rect x="2" y="12" width="6" height="6" rx="1" />
        <rect x="12" y="14" width="6" height="4" rx="1" />
      </svg>
    </CircularBase>
  )
}

// 6. Trending Up Arrow
export function Logo06_TrendingUp({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 17 L9 11 L13 15 L21 7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 7 L21 7 L21 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </CircularBase>
  )
}

// 7. Gauge/Speedometer
export function Logo07_Gauge({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12 A7 7 0 0 1 17 12" />
        <path d="M10 12 L13 9" strokeLinecap="round" />
        <circle cx="10" cy="12" r="1" fill="currentColor" />
      </svg>
    </CircularBase>
  )
}

// 8. Analytics Dots
export function Logo08_AnalyticsDots({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <circle cx="5" cy="15" r="1" />
        <circle cx="10" cy="10" r="1.5" />
        <circle cx="15" cy="5" r="1" />
        <path d="M5 15 L10 10 L15 5" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </CircularBase>
  )
}

// 9. Progress Ring
export function Logo09_ProgressRing({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="24 12" strokeLinecap="round" transform="rotate(-90 10 10)" />
        <circle cx="10" cy="10" r="2" fill="currentColor" />
      </svg>
    </CircularBase>
  )
}

// 10. Data Layers
export function Logo10_DataLayers({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <ellipse cx="10" cy="6" rx="6" ry="2" />
        <ellipse cx="10" cy="10" rx="6" ry="2" />
        <ellipse cx="10" cy="14" rx="6" ry="2" />
      </svg>
    </CircularBase>
  )
}

// === TIME & CALENDAR CATEGORY (11-20) ===

// 11. Calendar with Check (NO BACKGROUND CIRCLE - Just the white icon)
export function Logo11_CalendarCheck({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }

  const svgSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20'
  }

  // Always use white for the icon to ensure visibility on colored backgrounds
  const iconColor = 'text-white'

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg className={`${svgSizeClasses[size]} ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {/* Calendar body */}
        <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
        {/* Calendar rings/hangers */}
        <path d="M16 2v4M8 2v4" strokeLinecap="round" />
        {/* Calendar header line */}
        <path d="M3 9h18" />
        {/* Smaller checkmark with more breathing room */}
        <path d="M9 14l2 2L15 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
      </svg>
    </div>
  )
}

// 12. Clock Face
export function Logo12_Clock({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="7" />
        <path d="M10 6 L10 10 L14 14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </CircularBase>
  )
}

// 13. Daily Streak
export function Logo13_DailyStreak({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <rect x="2" y="12" width="2" height="6" rx="1" />
        <rect x="6" y="8" width="2" height="10" rx="1" />
        <rect x="10" y="4" width="2" height="14" rx="1" />
        <rect x="14" y="6" width="2" height="12" rx="1" />
        <circle cx="3" cy="10" r="1" />
        <circle cx="7" cy="6" r="1" />
        <circle cx="11" cy="2" r="1" />
        <circle cx="15" cy="4" r="1" />
      </svg>
    </CircularBase>
  )
}

// 14. Timer
export function Logo14_Timer({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="11" r="6" />
        <path d="M10 8 L10 11 L12 13" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 3 L13 3" strokeLinecap="round" />
        <path d="M15 5 L16 4" strokeLinecap="round" />
      </svg>
    </CircularBase>
  )
}

// 15. Schedule Grid
export function Logo15_Schedule({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <rect x="2" y="4" width="16" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M2 8 L18 8" stroke="currentColor" strokeWidth="1" />
        <path d="M6 4 L6 16" stroke="currentColor" strokeWidth="1" />
        <path d="M10 4 L10 16" stroke="currentColor" strokeWidth="1" />
        <path d="M14 4 L14 16" stroke="currentColor" strokeWidth="1" />
        <circle cx="4" cy="6" r="0.5" />
        <circle cx="8" cy="10" r="0.5" />
        <circle cx="12" cy="14" r="0.5" />
      </svg>
    </CircularBase>
  )
}

// 16. Habit Chain
export function Logo16_HabitChain({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="6" r="2" />
        <circle cx="14" cy="6" r="2" />
        <circle cx="6" cy="14" r="2" />
        <circle cx="14" cy="14" r="2" />
        <path d="M8 6 L12 6" />
        <path d="M6 8 L6 12" />
        <path d="M14 8 L14 12" />
        <path d="M8 14 L12 14" />
      </svg>
    </CircularBase>
  )
}

// 17. Day Counter
export function Logo17_DayCounter({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <text x="10" y="14" textAnchor="middle" fontSize="8" fontWeight="bold">30</text>
        <path d="M10 2 L10 6" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M10 14 L10 18" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M2 10 L6 10" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M14 10 L18 10" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </CircularBase>
  )
}

// 18. Weekly View
export function Logo18_WeeklyView({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <rect x="2" y="6" width="2" height="8" rx="1" />
        <rect x="4.5" y="8" width="2" height="6" rx="1" />
        <rect x="7" y="4" width="2" height="10" rx="1" />
        <rect x="9.5" y="7" width="2" height="7" rx="1" />
        <rect x="12" y="5" width="2" height="9" rx="1" />
        <rect x="14.5" y="9" width="2" height="5" rx="1" />
        <rect x="17" y="6" width="2" height="8" rx="1" />
      </svg>
    </CircularBase>
  )
}

// 19. Time Blocks
export function Logo19_TimeBlocks({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <rect x="2" y="2" width="7" height="3" rx="1" />
        <rect x="11" y="2" width="7" height="3" rx="1" />
        <rect x="2" y="7" width="7" height="3" rx="1" />
        <rect x="11" y="7" width="7" height="3" rx="1" />
        <rect x="2" y="12" width="16" height="3" rx="1" />
        <rect x="2" y="17" width="7" height="1" rx="0.5" />
      </svg>
    </CircularBase>
  )
}

// 20. Milestone Flag
export function Logo20_Milestone({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <rect x="3" y="2" width="1.5" height="16" />
        <path d="M4.5 2 L16 2 L14 6 L16 10 L4.5 10 Z" />
        <circle cx="3.75" cy="18" r="1" />
      </svg>
    </CircularBase>
  )
}

// === GOALS & TARGETS CATEGORY (21-30) ===

// 21. Bullseye Target
export function Logo21_Bullseye({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="7" />
        <circle cx="10" cy="10" r="4" />
        <circle cx="10" cy="10" r="1.5" fill="currentColor" />
      </svg>
    </CircularBase>
  )
}

// 22. Arrow to Target
export function Logo22_ArrowTarget({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="14" cy="6" r="3" />
        <circle cx="14" cy="6" r="1.5" />
        <path d="M3 17 L11 9" strokeLinecap="round" />
        <path d="M7 17 L11 17 L11 13" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </CircularBase>
  )
}

// 23. Achievement Star
export function Logo23_Star({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2 L12.5 7 L18 7 L14 11 L15.5 16 L10 13 L4.5 16 L6 11 L2 7 L7.5 7 Z" />
      </svg>
    </CircularBase>
  )
}

// 24. Trophy Cup
export function Logo24_Trophy({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 9 L6 2 L14 2 L14 9 Q14 12 10 12 Q6 12 6 9 Z" />
        <path d="M10 12 L10 15" />
        <path d="M7 15 L13 15" />
        <path d="M6 2 L4 2 Q2 2 2 4 Q2 6 4 6 L6 6" />
        <path d="M14 2 L16 2 Q18 2 18 4 Q18 6 16 6 L14 6" />
      </svg>
    </CircularBase>
  )
}

// 25. Mountain Peak
export function Logo25_Mountain({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 16 L7 6 L10 10 L13 4 L18 16 Z" />
        <circle cx="13" cy="4" r="1" fill={variant === 'default' ? 'rgb(59, 130, 246)' : 'white'} />
      </svg>
    </CircularBase>
  )
}

// 26. Rocket Launch
export function Logo26_Rocket({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2 L12 8 L10 10 L8 8 Z" />
        <path d="M6 10 L8 8 L8 12 L6 14 Z" />
        <path d="M14 10 L12 8 L12 12 L14 14 Z" />
        <circle cx="10" cy="6" r="1" fill={variant === 'default' ? 'rgb(59, 130, 246)' : 'white'} />
        <path d="M8 14 L10 18 L12 14" />
      </svg>
    </CircularBase>
  )
}

// 27. Finish Line Flag
export function Logo27_FinishFlag({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <rect x="2" y="2" width="1.5" height="16" />
        <path d="M3.5 2 L16 2 L16 8 L3.5 8 Z" />
        <rect x="5" y="3" width="2" height="2" fill={variant === 'default' ? 'rgb(59, 130, 246)' : 'white'} />
        <rect x="9" y="3" width="2" height="2" fill={variant === 'default' ? 'rgb(59, 130, 246)' : 'white'} />
        <rect x="13" y="3" width="2" height="2" fill={variant === 'default' ? 'rgb(59, 130, 246)' : 'white'} />
        <rect x="7" y="6" width="2" height="2" fill={variant === 'default' ? 'rgb(59, 130, 246)' : 'white'} />
        <rect x="11" y="6" width="2" height="2" fill={variant === 'default' ? 'rgb(59, 130, 246)' : 'white'} />
      </svg>
    </CircularBase>
  )
}

// 28. Level Up
export function Logo28_LevelUp({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12 L10 5 L17 12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 16 L10 9 L17 16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </CircularBase>
  )
}

// 29. Diamond Achievement
export function Logo29_Diamond({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2 L15 7 L10 18 L5 7 Z" />
        <path d="M5 7 L15 7" stroke={variant === 'default' ? 'rgb(59, 130, 246)' : 'white'} strokeWidth="1" />
        <path d="M7.5 2 L12.5 2" stroke={variant === 'default' ? 'rgb(59, 130, 246)' : 'white'} strokeWidth="1" />
      </svg>
    </CircularBase>
  )
}

// 30. Crown
export function Logo30_Crown({ className = '', variant = 'default', size = 'md' }: LogoProps) {
  const iconColor = variant === 'default' ? 'text-white' : variant === 'white' ? 'text-blue-600' : 'text-white'
  return (
    <CircularBase className={className} variant={variant} size={size}>
      <svg className={`w-5 h-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 14 L4 6 L7 10 L10 4 L13 10 L16 6 L18 14 Z" />
        <rect x="2" y="14" width="16" height="2" />
        <circle cx="4" cy="6" r="1" />
        <circle cx="10" cy="4" r="1" />
        <circle cx="16" cy="6" r="1" />
      </svg>
    </CircularBase>
  )
}

// === MAIN LOGO COMPONENT ===

// All available logos
export const ALL_LOGOS = {
  // Data & Analytics (1-10)
  logo01: Logo01_RisingBars,
  logo02: Logo02_PieChart,
  logo03: Logo03_LineGraph,
  logo04: Logo04_DataPoints,
  logo05: Logo05_Dashboard,
  logo06: Logo06_TrendingUp,
  logo07: Logo07_Gauge,
  logo08: Logo08_AnalyticsDots,
  logo09: Logo09_ProgressRing,
  logo10: Logo10_DataLayers,

  // Time & Calendar (11-20)
  logo11: Logo11_CalendarCheck,
  logo12: Logo12_Clock,
  logo13: Logo13_DailyStreak,
  logo14: Logo14_Timer,
  logo15: Logo15_Schedule,
  logo16: Logo16_HabitChain,
  logo17: Logo17_DayCounter,
  logo18: Logo18_WeeklyView,
  logo19: Logo19_TimeBlocks,
  logo20: Logo20_Milestone,

  // Goals & Targets (21-30)
  logo21: Logo21_Bullseye,
  logo22: Logo22_ArrowTarget,
  logo23: Logo23_Star,
  logo24: Logo24_Trophy,
  logo25: Logo25_Mountain,
  logo26: Logo26_Rocket,
  logo27: Logo27_FinishFlag,
  logo28: Logo28_LevelUp,
  logo29: Logo29_Diamond,
  logo30: Logo30_Crown,
}

// Main Logo Component with text
interface MainLogoProps extends LogoProps {
  showText?: boolean
  logoType?: keyof typeof ALL_LOGOS
}

export function MyDataDayLogo({
  className = '',
  variant = 'default',
  size = 'md',
  showText = true,
  logoType = 'logo01'
}: MainLogoProps) {
  const LogoComponent = ALL_LOGOS[logoType]

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  }

  const textColorClasses = {
    default: 'text-gray-900',
    white: 'text-white',
    dark: 'text-gray-900'
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <LogoComponent variant={variant} size={size} />
      {showText && (
        <span className={`font-semibold ${textSizeClasses[size]} ${textColorClasses[variant]}`}>
          MyDataDay
        </span>
      )}
    </div>
  )
}

// Legacy exports for backward compatibility
export const DataChartLogo = Logo01_RisingBars
export const CalendarDayLogo = Logo11_CalendarCheck
export const TargetGoalLogo = Logo21_Bullseye
export const MinimalistDLogo = Logo29_Diamond
