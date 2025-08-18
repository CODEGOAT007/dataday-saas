'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

const supabase = createClient()

export type IntroSession = {
  id: string
  user_id: string
  admin_id: string | null
  current_step: 'goal-details' | 'voice-message' | 'send-notifications'
  goal_title: string | null
  frequency: string | null
  duration: string | null
  voice_note_url: string | null
  is_recording: boolean
  last_seen_user: string | null
  last_seen_admin: string | null
  updated_by: 'user' | 'admin' | null
  updated_at: string
}

export function useIntroSession(sessionId?: string | null) {
  const [session, setSession] = useState<IntroSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    if (!sessionId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/intro-sessions?id=${encodeURIComponent(sessionId)}`)
      .then(r => r.json())
      .then(json => {
        if (cancelled) return
        if (json?.session) setSession(json.session)
        else setError(json?.error || 'Session not found')
      })
      .catch(e => setError(e?.message || 'Failed to load session'))
      .finally(() => !cancelled && setLoading(false))

    // Realtime subscription
    const ch = supabase
      .channel(`intro_sessions:${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'intro_sessions', filter: `id=eq.${sessionId}` }, payload => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          const next = payload.new as IntroSession
          setSession(next)
        }
      })
      .subscribe()

    channelRef.current = ch
    return () => {
      cancelled = true
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [sessionId])

  const patch = async (updates: Partial<IntroSession>) => {
    if (!sessionId) return null
    const res = await fetch('/api/intro-sessions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: sessionId, ...updates }) })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error || 'Failed to update session')
    return json.session as IntroSession
  }

  const markPresence = async (role: 'user' | 'admin') => {
    const field = role === 'user' ? 'last_seen_user' : 'last_seen_admin'
    return patch({ [field]: new Date().toISOString() } as any)
  }

  return { session, loading, error, patch, markPresence }
}

