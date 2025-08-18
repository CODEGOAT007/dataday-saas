import { Metadata } from 'next'
import { SignupCardClient } from '@/components/auth/signup-card-client'
import { KeyboardAwareCenter } from '@/components/ui/keyboard-aware-center'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your Dataday account and start achieving your goals',
}

export default function SignupPage() {
  return (
    <KeyboardAwareCenter className="bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-brand-950 dark:via-brand-900 dark:to-brand-800">
      <div className="w-full max-w-md">
        <SignupCardClient />
      </div>
    </KeyboardAwareCenter>
  )
}
