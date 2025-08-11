'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Heart, 
  CheckCircle, 
  XCircle, 
  Users, 
  Clock,
  MessageCircle,
  Phone,
  Mail,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProfileAvatar } from '@/components/ui/profile-avatar'
import type { SupportCircleMember, User } from '@/types'

interface ConsentFormProps {
  memberId: string
}

interface MemberData extends SupportCircleMember {
  users: User
}

export function ConsentForm({ memberId }: ConsentFormProps) {
  const [member, setMember] = useState<MemberData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [response, setResponse] = useState<'consented' | 'declined' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMemberData()
  }, [memberId])

  const fetchMemberData = async () => {
    try {
      console.log('🔍 Fetching member data for ID:', memberId)
      console.log('🔍 User agent:', navigator.userAgent)
      console.log('🔍 Is mobile:', /Mobile|Android|iPhone|iPad/.test(navigator.userAgent))

      const response = await fetch(`/api/consent/${memberId}`)
      console.log('🔍 API response status:', response.status)
      console.log('🔍 API response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`Failed to fetch member data: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      console.log('Member data received:', data)
      setMember(data.member)
    } catch (error) {
      console.error('Error fetching member data:', error)
      setError(`Failed to load information: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = async (consented: boolean) => {
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/consent/${memberId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consented }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit response')
      }

      setResponse(consented ? 'consented' : 'declined')
    } catch (error) {
      setError('Failed to submit response. Please try again.')
      console.error('Error submitting consent:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto bg-gray-900 border-gray-800">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    )
  }

  if (error && !member) {
    return (
      <Card className="max-w-2xl mx-auto border-gray-800 bg-gray-900">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-gray-400" />
          </div>
          <CardTitle className="text-white">Something went wrong</CardTitle>
          <CardDescription className="text-gray-400">{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (response === 'consented') {
    return (
      <Card className="max-w-2xl mx-auto border-green-800 bg-gray-900">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-green-400">Thank you! 🎉</CardTitle>
          <CardDescription className="text-gray-300">
            You're now part of {member?.users?.full_name || 'your friend'}'s Support Circle
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-green-950 border border-green-800 rounded-lg p-6">
            <h3 className="font-semibold text-green-300 mb-3">What happens next:</h3>
            <div className="space-y-2 text-sm text-green-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>You'll only be contacted if they miss goals for 2+ days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>We'll celebrate their milestones with you (7, 30, 60 day streaks)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>You can opt out anytime by replying to any message</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-300 mb-4">
              Your support will help them achieve a 90%+ success rate! 💪
            </p>
            <p className="text-sm text-gray-500">
              You can close this page now.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (response === 'declined') {
    return (
      <Card className="max-w-2xl mx-auto border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-gray-600" />
          </div>
          <CardTitle className="text-gray-600">No problem!</CardTitle>
          <CardDescription>
            We understand and won't contact you about this again.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Thanks for taking the time to respond.
          </p>
          <p className="text-sm text-gray-500">
            You can close this page now.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!member) {
    return (
      <Card className="max-w-2xl mx-auto border-gray-800 bg-gray-900">
        <CardHeader className="text-center">
          <CardTitle className="text-white">Invalid Link</CardTitle>
          <CardDescription className="text-gray-400">
            This consent link is not valid or has expired.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case 'text_voicemail':
        return <Phone className="h-4 w-4" />
      case 'text_only':
        return <MessageCircle className="h-4 w-4" />
      case 'email':
        return <Mail className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  return (
    <Card className="max-w-2xl mx-auto bg-gray-900 border-gray-800">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl text-white">Join a Support Circle</CardTitle>
        <CardDescription className="text-lg text-gray-300">
          {member.users?.full_name || 'Someone you know'} wants you to be part of their success journey
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Member Info */}
        <div className="bg-blue-950 border border-blue-800 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <ProfileAvatar size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-100">
                {member.users?.full_name || 'Your friend'}
              </h3>
              <p className="text-sm text-blue-200">
                Added you as their {member.relationship}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-blue-200">
            {getContactMethodIcon(member.preferred_contact_method)}
            <span>We'll contact you via {member.preferred_contact_method.replace('_', ' ')}</span>
          </div>
        </div>

        {/* What is MyDataday */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            What is MyDataday?
          </h3>
          <p className="text-gray-300">
            MyDataday is a personal goal achievement app that helps people succeed through social accountability.
            Your friend has chosen you to be part of their Emergency Support Team because they trust and value your support.
          </p>
        </div>

        {/* How it works */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Clock className="h-5 w-5" />
            How it works
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Day 1 missed:</strong> Our team reaches out to them with encouragement
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Day 2 missed:</strong> You get a notification asking you to check in with them
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Milestones:</strong> We celebrate their 7, 30, and 60-day streaks with you!
              </p>
            </div>
          </div>
        </div>

        {/* Privacy & Commitment */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Privacy & Commitment
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>We only contact you 1-2 times per month maximum</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>We only share their goal progress, never personal details</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>You can opt out anytime by replying to any message</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Your support helps them achieve 90%+ success rates</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-300">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          {/* No thanks button - positioned above the main button */}
          <Button
            onClick={() => handleResponse(false)}
            disabled={submitting}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            No thanks
          </Button>

          {/* Main consent button */}
          <Button
            onClick={() => handleResponse(true)}
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Heart className="h-4 w-4 mr-2" />
            )}
            Yes, I'll join their Support Circle
          </Button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          By clicking "Yes", you consent to receive occasional notifications to help support {member.users?.full_name || 'your friend'}'s goals.
        </p>
      </CardContent>
    </Card>
  )
}
