import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your Dataday account',
}

import { KeyboardAwareCenter } from '@/components/ui/keyboard-aware-center'

export default function LoginPage() {
  return (
    <KeyboardAwareCenter className="bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-brand-950 dark:via-brand-900 dark:to-brand-800">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </KeyboardAwareCenter>
  )
}
