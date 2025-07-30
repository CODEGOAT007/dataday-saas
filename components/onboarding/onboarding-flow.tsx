'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/hooks/use-auth'

export function OnboardingFlow() {
  const [isCompleting, setIsCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  // Reason: Complete onboarding and redirect to dashboard
  const completeOnboarding = async () => {
    if (!user) return
    
    setIsCompleting(true)
    setError(null)
    
    try {
      // First, check if user profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // User profile doesn't exist, create it
        console.log('Creating user profile...')
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
            onboarding_completed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('Error creating user profile:', insertError)
          throw insertError
        }
      } else if (profileError) {
        console.error('Error checking user profile:', profileError)
        throw profileError
      } else {
        // User profile exists, just update onboarding completion
        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            onboarding_completed_at: new Date().toISOString() 
          })
          .eq('id', user.id)

        if (updateError) {
          console.error('Error updating onboarding:', updateError)
          throw updateError
        }
      }

      console.log('Onboarding completed successfully')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error completing onboarding:', error)
      setError(error instanceof Error ? error.message : 'Failed to complete onboarding')
      setIsCompleting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-2xl">Welcome to Dataday!</CardTitle>
            <p className="text-muted-foreground">
              You're ready to start achieving your goals.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {isCompleting && (
              <div className="text-center text-sm text-muted-foreground">
                Setting up your account...
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={completeOnboarding}
                disabled={isCompleting}
                className="flex-1"
              >
                {isCompleting ? 'Setting up...' : 'Get Started'}
              </Button>
              
              {error && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setError(null)
                    setIsCompleting(false)
                  }}
                >
                  Try Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
