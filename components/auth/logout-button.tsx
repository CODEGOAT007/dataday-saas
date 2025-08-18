'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { LogOut, Loader2 } from 'lucide-react'

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
      // Reason: Short, modern toast that doesn’t linger
      toast.success('Signed out', { id: 'logout', duration: 1200 })
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed. Please try again.', { id: 'logout-error' })
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
      {showIcon && (
        isSigningOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )
      )}
      {children || (isSigningOut ? 'Signing out...' : 'Sign Out')}
    </Button>
  )
}
