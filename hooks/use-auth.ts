'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import type { User } from '@supabase/supabase-js'

const supabase = createClient()

// Reason: Custom hook for authentication state management with TanStack Query
export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Reason: Query for current user session (with demo mode fallback)
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async (): Promise<User | null> => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
      } catch (err) {
        // Reason: If auth fails, return null to enable demo mode
        console.log('Auth failed, enabling demo mode:', err)
        return null
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })

  // Reason: Mutation for user signup
  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, fullName, redirectTo }: {
      email: string
      password: string
      fullName: string
      redirectTo?: string
    }) => {
      // Reason: Always use canonical app URL for email links to satisfy Supabase redirect allow list
      // Prefer NEXT_PUBLIC_APP_URL if defined; fallback to current origin only in dev
      const origin = (process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://mydataday.app'))
      const callbackUrl = redirectTo ? `${origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}` : `${origin}/auth/callback`

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      const needsConfirmation = !data.user || !data.user.email_confirmed_at
      return { data, needsConfirmation }
    },
    onSuccess: (result) => {
      // Reason: Invalidate auth queries to refresh state
      queryClient.invalidateQueries({ queryKey: ['auth'] })

      if (result.needsConfirmation) {
        // Reason: Let the UI show a "check your email" message; do not navigate
        return
      }

      const user = result.data?.user
      if (user) {
        // User is automatically logged in (depends on project settings)
        router.push('/onboarding')
        router.refresh()
      }
    },
  })

  // Reason: Mutation for user login
  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      // Reason: Update auth state and redirect
      queryClient.setQueryData(['auth', 'user'], data.user)
      
      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirectTo') || '/today'
      router.push(redirectTo)
      router.refresh()
    },
  })

  // Reason: Mutation for user logout
  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      // Reason: Clear auth state and redirect to home
      queryClient.setQueryData(['auth', 'user'], null)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      router.push('/')
      router.refresh()
    },
    onError: (error) => {
      // Reason: Log logout errors but still clear local state
      console.error('Logout error:', error)
      // Clear local state even if server logout fails
      queryClient.setQueryData(['auth', 'user'], null)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      router.push('/')
      router.refresh()
    },
  })

  return {
    // State
    user,
    isLoading,
    isAuthenticated: !!user,
    error,

    // Actions
    signUp: signUpMutation.mutateAsync,
    signIn: signInMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,

    // Loading states
    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,

    // Errors
    signUpError: signUpMutation.error,
    signInError: signInMutation.error,
    signOutError: signOutMutation.error,
  }
}
