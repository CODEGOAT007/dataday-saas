import { Metadata } from 'next'
import { AdminLoginForm } from '@/components/admin/admin-login-form'

export const metadata: Metadata = {
  title: 'Admin Login - MyDataday',
  description: 'Admin access for MyDataday coaches and founders',
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400">
            Coach and founder login for MyDataday
          </p>
        </div>

        {/* Login Form */}
        <AdminLoginForm />

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Admin access only. Regular users should use the main login.</p>
          <a 
            href="/auth/login" 
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Regular User Login →
          </a>
        </div>
      </div>
    </div>
  )
}
