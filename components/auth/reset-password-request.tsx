"use client"

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { toast } from 'sonner'

// Reason: Client component to request a password reset email via Supabase
export function ResetPasswordRequest() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  const startCooldown = (seconds: number) => {
    const until = Date.now() + seconds * 1000
    localStorage.setItem('pwd-reset-cooldown', String(until))
    setCooldown(seconds)
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((until - Date.now()) / 1000))
      setCooldown(remaining)
      if (remaining <= 0) clearInterval(timer)
    }, 1000)
  }

  const canSend = () => {
    const raw = localStorage.getItem('pwd-reset-cooldown')
    if (!raw) return true
    const until = Number(raw)
    return !until || Date.now() >= until
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.startsWith('http'))
        ? process.env.NEXT_PUBLIC_APP_URL
        : (typeof window !== 'undefined' ? window.location.origin : 'https://mydataday.app')
      const redirectTo = `${appUrl}/auth/update-password`
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) throw error
      setSent(true)
      toast.success('Reset link sent. Check your email.')
      startCooldown(30)
    } catch (err: any) {
      const msg = err?.message || 'Failed to send reset email. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-white text-center">Forgot password</h1>
      <p className="text-gray-400 text-center mt-2">Enter your email and we’ll send you a reset link.</p>

      {sent ? (
        <div className="mt-6 text-center text-green-400 space-y-4">
          <div>Check your email for a link to reset your password.</div>
          <button
            onClick={onSubmit as any}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md disabled:opacity-60"
            disabled={loading || cooldown > 0}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend link'}
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-md">{error}</div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-3 py-2 bg-gray-950 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md disabled:opacity-60"
            disabled={loading || cooldown > 0}
          >
            {loading ? 'Sending…' : (cooldown > 0 ? `Wait ${cooldown}s` : 'Send reset link')}
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-sm">
        <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 underline">Back to sign in</Link>
      </div>
    </div>
  )
}

