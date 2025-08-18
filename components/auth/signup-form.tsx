'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export function SignupForm() {
  const { signIn, isSigningUp, signUpError } = useAuth()
  const router = useRouter()

  // Local UI state for modern UX
  const [mode] = useState<'form' | 'confirm'>('form')
  const [submittedEmail, setSubmittedEmail] = useState('')


  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)

  // Reason: Handle form submission with minimal friction — sign in immediately after sign up
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError(null)

    try {
      setSubmittedEmail(email)

      // Create an auth user as confirmed via secure server route (service role)
      const resp = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName: name }),
      })
      const json = await resp.json()
      if (!resp.ok) {
        const msg = json?.error || 'Signup failed'
        throw new Error(msg)
      }

      // Ensure sign-in redirects to Goal Voice for signup path
      const url = new URL(window.location.href)
      url.searchParams.set('redirectTo', '/journey/live/goal-voice')
      window.history.replaceState(null, '', url.toString())

      // Try immediate sign-in with a small backoff to handle eventual consistency
      const trySignInWithBackoff = async () => {
        const delays = [400, 1000, 1800] // ms
        for (let i = 0; i < delays.length; i++) {
          try {
            await new Promise((r) => setTimeout(r, delays[i]))
            await signIn({ email, password })
            return true
          } catch (err: any) {
            const msg = err?.message || String(err)
            console.warn('[signup] signIn attempt failed:', msg)
          }
        }
        return false
      }

      const ok = await trySignInWithBackoff()

      // Navigate to the Goal Voice page (session cookies should be set if ok)
      router.push('/journey/live/goal-voice')

      if (!ok) {
        // Non-blocking: cookie sync may still complete; user is already moved to the next step
      }
    } catch (err: any) {
      // Surface duplicate-email and other issues to user explicitly
      const raw = err?.message || String(err)
      const msg = /already/i.test(raw) ? 'That email is already in use. Try signing in.' : raw || 'Signup failed. Please try again.'
      setLocalError(msg)
      toast.error(msg)
      console.error('Signup error:', err)
    }
  }

  // Render a confirmation pane after signup that replaces the form (no nested Card)
  if (mode === 'confirm') {
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center space-y-4">
        <div className="rounded-full bg-green-500/10 p-3 border border-green-500/30">
          <CheckCircle2 className="h-6 w-6 text-green-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">Check your email</h2>
        <p className="text-sm text-gray-300">
          We sent a confirmation link to <span className="font-medium text-white">{submittedEmail}</span>.
          Tap the link to activate your account.
        </p>

      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(signUpError || localError) && (
        <div className="p-3 text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-md">
          {localError || signUpError?.message}
        </div>
      )}

      {/* Full name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
          Full Name
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <User className="h-4 w-4" />
          </span>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-900 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSigningUp}
            autoComplete="name"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
          Email
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <Mail className="h-4 w-4" />
          </span>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-900 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSigningUp}
            autoComplete="email"
            inputMode="email"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">
          Password
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <Lock className="h-4 w-4" />
          </span>
          <input
            ref={passwordRef}
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-900 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isSigningUp}
            autoComplete="new-password"
          />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
            onClick={() => {
              setShowPassword((v) => !v)
              // Keep focus and caret so the keyboard stays open on mobile
              requestAnimationFrame(() => {
                if (passwordRef.current) {
                  passwordRef.current.focus({ preventScroll: true })
                  const pos = passwordRef.current.value.length
                  try { passwordRef.current.setSelectionRange(pos, pos) } catch {}
                }
              })
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400">Minimum 6 characters</p>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={isSigningUp}
      >
        {isSigningUp ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  )
}
