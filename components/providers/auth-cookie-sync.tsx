"use client"

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'

// Reason: Keep Next.js middleware cookies in sync with client-side Supabase auth state
export function AuthCookieSync() {
  useEffect(() => {
    const supabase = createClient()

    // Removed background sign-in with stored credentials for security hardening
    // We rely on server-confirmed signup + normal client sign-in and cookie sync
    // 2) Keep server cookies synced on auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event, session }),
          })
        }
        if (event === 'SIGNED_OUT') {
          await fetch('/api/auth', { method: 'DELETE' })
        }
      } catch (e) {
        console.warn('[auth-cookie-sync] Failed to sync cookies', e)
      }
    })

    return () => { listener.subscription.unsubscribe() }
  }, [])

  return null
}

