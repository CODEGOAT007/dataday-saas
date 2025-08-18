"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'

// Reason: Supabase password recovery flow lands here via the email link
export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Reason: When redirected from email, Supabase sets a temporary session
    // We don't need to handle code exchange manually in client SDK
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setSuccess(true)
    } catch (err: any) {
      setError(err?.message || 'Failed to update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-white text-center">Set a new password</h1>
          <p className="text-gray-400 text-center mt-2">Enter and confirm your new password.</p>

          {success ? (
            <div className="mt-6 text-center text-green-400">
              Your password has been updated.
              <div className="mt-4">
                <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 underline">Return to sign in</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-md">{error}</div>
              )}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">New password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-3 py-2 bg-gray-950 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-300 mb-2">Confirm password</label>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  className="w-full px-3 py-2 bg-gray-950 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-6 text-center text-sm">
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 underline">Back to sign in</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

