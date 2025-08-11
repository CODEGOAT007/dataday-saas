'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AdminSession {
  email: string
  role: string
  full_name: string
  loginTime: string
}

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/verify', {
        credentials: 'include'
      })

      if (response.ok) {
        const { session } = await response.json()
        setAdminSession(session)
        setIsAuthenticated(true)
      } else {
        // Redirect to admin login
        router.push('/admin/login')
        return
      }
    } catch (error) {
      console.error('Admin auth check failed:', error)
      toast.error('Authentication failed')
      router.push('/admin/login')
      return
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div>
      {/* Admin Header */}
      <div className="bg-blue-900 border-b border-blue-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-blue-100 font-medium">
              Admin Mode: {adminSession?.full_name}
            </span>
            <span className="text-blue-300 text-sm">
              ({adminSession?.role})
            </span>
          </div>
          <button
            onClick={() => {
              fetch('/api/admin/auth/logout', { method: 'POST' })
              router.push('/admin/login')
            }}
            className="text-blue-300 hover:text-white text-sm"
          >
            Logout
          </button>
        </div>
      </div>
      
      {children}
    </div>
  )
}
