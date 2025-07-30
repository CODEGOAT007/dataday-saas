'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showIcon?: boolean
  children?: React.ReactNode
  className?: string
}

export function LogoutButton({
  variant = 'ghost',
  size = 'default',
  showIcon = true,
  children,
  className
}: LogoutButtonProps) {
  const { signOut, isSigningOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isSigningOut}
      className={`flex items-center gap-2 ${className || ''}`}
    >
      {showIcon && <LogOut className="h-4 w-4" />}
      {children || (isSigningOut ? 'Signing out...' : 'Sign Out')}
    </Button>
  )
}
