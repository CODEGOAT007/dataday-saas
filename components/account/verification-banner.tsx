'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

// Reason: Gentle reminder to verify email. No gating for the first 7 days.
export function VerificationBanner() {
  const { user } = useAuth()
  const supabase = createClient()
  const [sending, setSending] = useState(false)

  if (!user) return null
  if (user.email_confirmed_at) return null

  const createdAt = user.created_at ? new Date(user.created_at) : null
  const daysSinceSignup = useMemo(() => {
    if (!createdAt) return 0
    const ms = Date.now() - createdAt.getTime()
    return Math.floor(ms / (1000 * 60 * 60 * 24))
  }, [createdAt])

  const resend = async () => {
    if (!user.email) return
    try {
      setSending(true)
      await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/onboarding` }
      })
      toast.success('Verification email sent')
    } catch (e: any) {
      const msg = e?.message || 'Could not resend verification email'
      toast.error(msg)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="w-full bg-blue-900/40 border-b border-blue-800">
      <div className="mx-auto max-w-5xl px-4 py-2 flex items-start gap-3 text-sm">
        <AlertCircle className="h-4 w-4 mt-0.5 text-blue-300" />
        <div className="flex-1 text-blue-100">
          <div className="font-medium">Verify your email for full account security</div>
          <div className="text-blue-200/90">
            {daysSinceSignup < 7
              ? 'You can keep using the app — we recommend verifying soon.'
              : 'It’s been a bit. Please verify your email to avoid interruptions.'}
          </div>
        </div>
        <button
          onClick={resend}
          disabled={sending}
          className="inline-flex items-center gap-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 disabled:opacity-60"
        >
          <Mail className="h-4 w-4" /> {sending ? 'Sending…' : 'Resend'}
        </button>
      </div>
    </div>
  )
}

