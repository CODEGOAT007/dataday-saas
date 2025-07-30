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
import type { EmergencySupportTeamMember, User } from '@/types'

interface ConsentFormProps {
  memberId: string
}

interface MemberData extends EmergencySupportTeamMember {
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
      const response = await fetch(`/api/consent/${memberId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch member data')
      }
      const data = await response.json()
      setMember(data.member)
    } catch (error) {
      setError('Failed to load information. Please try again.')
      console.error('Error fetching member data:', error)
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
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    )
  }

  if (error && !member) {
    return (
      <Card className="max-w-2xl mx-auto border-red-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-red-600">Something went wrong</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (response === 'consented') {
    return (
      <Card className="max-w-2xl mx-auto border-green-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Thank you! 🎉</CardTitle>
          <CardDescription>
            You're now part of {member?.users?.full_name || 'your friend'}'s Emergency Support Team
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3">What happens next:</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>You'll only be contacted if they miss goals for 2+ days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>We'll celebrate their milestones with you (7, 30, 60 day streaks)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>You can opt out anytime by replying to any message</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
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
      <Card className="max-w-2xl mx-auto border-red-200">
        <CardHeader className="text-center">
          <CardTitle className="text-red-600">Invalid Link</CardTitle>
          <CardDescription>
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Join an Emergency Support Team</CardTitle>
        <CardDescription className="text-lg">
          {member.users?.full_name || 'Someone you know'} wants you to be part of their success journey
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Member Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <ProfileAvatar size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500" />
            <div>
              <h3 className="font-semibold text-blue-900">
                {member.users?.full_name || 'Your friend'}
              </h3>
              <p className="text-sm text-blue-700">
                Added you as their {member.relationship}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-blue-700">
            {getContactMethodIcon(member.preferred_contact_method)}
            <span>We'll contact you via {member.preferred_contact_method.replace('_', ' ')}</span>
          </div>
        </div>

        {/* What is MyDataday */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5" />
            What is MyDataday?
          </h3>
          <p className="text-gray-600">
            MyDataday is a personal goal achievement app that helps people succeed through social accountability.
            Your friend has chosen you to be part of their Emergency Support Team because they trust and value your support.
          </p>
        </div>

        {/* How it works */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            How it works
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <p className="text-sm text-gray-600">
                <strong>Day 1 missed:</strong> Our team reaches out to them with encouragement
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <p className="text-sm text-gray-600">
                <strong>Day 2 missed:</strong> You get a notification asking you to check in with them
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <p className="text-sm text-gray-600">
                <strong>Milestones:</strong> We celebrate their 7, 30, and 60-day streaks with you!
              </p>
            </div>
          </div>
        </div>

        {/* Privacy & Commitment */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Privacy & Commitment
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={() => handleResponse(true)}
            disabled={submitting}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Heart className="h-4 w-4 mr-2" />
            )}
            Yes, I'll be their Emergency Support Team
          </Button>
          
          <Button
            onClick={() => handleResponse(false)}
            disabled={submitting}
            variant="outline"
            className="flex-1"
          >
            No thanks
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          By clicking "Yes", you consent to receive occasional notifications to help support {member.users?.full_name || 'your friend'}'s goals.
        </p>
      </CardContent>
    </Card>
  )
}
