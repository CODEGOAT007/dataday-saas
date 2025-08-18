"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { SignupForm } from '@/components/auth/signup-form'

// Reason: Client wrapper to control header/footer visibility based on form mode
export function SignupCardClient() {
  const mode: 'form' | 'confirm' = 'form'

  return (
    <Card className="bg-gray-950 border border-gray-800">
      {mode === 'form' && (
        <CardHeader className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">Beta Access</span>
          </div>
          <CardTitle className="text-2xl font-extrabold">
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">Create Your Account</span>
          </CardTitle>
          <div className="mt-1 flex justify-center">
            <span className="relative inline-block">
              <span className="block h-1 w-24 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 rounded-full"></span>
              <span className="absolute -top-1 left-0 right-0 h-2 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 blur-md rounded-full"></span>
            </span>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-6 flex justify-center">
        <div className="w-full">
          <SignupForm />
          {mode === 'form' ? (
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

