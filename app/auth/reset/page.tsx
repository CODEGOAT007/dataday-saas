import { Metadata } from 'next'
import { ResetPasswordRequest } from '@/components/auth/reset-password-request'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your MyDataDay password',
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md">
        <ResetPasswordRequest />
      </div>
    </div>
  )
}

