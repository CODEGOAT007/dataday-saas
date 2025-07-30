import React from 'react'
import { cn } from '@/lib/utils'

interface ProfileAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProfileAvatar({ size = 'md', className }: ProfileAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn(
      'bg-gray-100 rounded-full flex items-center justify-center overflow-hidden',
      sizeClasses[size],
      className
    )}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn(
          'text-gray-600',
          size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-7 h-7'
        )}
      >
        {/* Head */}
        <circle
          cx="12"
          cy="8"
          r="3"
          fill="currentColor"
        />
        {/* Shoulders/Body */}
        <path
          d="M12 14c-4 0-7 2-7 4.5V20h14v-1.5c0-2.5-3-4.5-7-4.5z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}
