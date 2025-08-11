'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GoalCreationFlow } from '@/components/goals/goal-creation-flow'
import { ArrowLeft, User, Mail, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  full_name: string
  created_at: string
  subscription_status: string
  onboarding_completed_at: string | null
}

interface CoachingInterfaceProps {
  userId: string
}

export function CoachingInterface({ userId }: CoachingInterfaceProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        toast.error('Failed to load user data')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      toast.error('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const goBackToAdmin = () => {
    window.close() // Close the coaching tab
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="h-64 bg-gray-800 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6">
        <Card className="bg-red-900/20 border-red-700">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-300 mb-2">User Not Found</h2>
            <p className="text-red-400 mb-4">Could not load user data for coaching session.</p>
            <Button onClick={goBackToAdmin} variant="outline">
              Back to Admin Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Coaching Header */}
      <div className="bg-blue-900 border-b border-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={goBackToAdmin}
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-white">
                Coaching Session
              </h1>
              <p className="text-blue-300 text-sm">
                Helping user set up goals and support circle
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-blue-100 font-medium">
              {user.full_name || 'No name set'}
            </div>
            <div className="text-blue-300 text-sm">{user.email}</div>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="px-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{user.full_name || 'No name'}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Status</div>
                <div className="font-medium text-white">
                  {user.subscription_status || 'Free'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Creation Flow */}
      <div className="px-6">
        <GoalCreationFlow />
      </div>
    </div>
  )
}
