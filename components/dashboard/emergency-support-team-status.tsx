'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Phone,
  MessageCircle,
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  Users,
  Zap,
  Plus,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProfileAvatar } from '@/components/ui/profile-avatar'
import { useEmergencySupportTeam, useEscalationLogs } from '@/hooks/use-emergency-support-team'
import Link from 'next/link'

export function EmergencySupportTeamStatus() {
  const { emergencySupportTeam, activeMembers, consentedMembers, hasEmergencySupportTeam, isLoading } = useEmergencySupportTeam()
  const { recentEscalations, emergencySupportTeamNotifications } = useEscalationLogs()

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            Emergency Support Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!hasEmergencySupportTeam) {
    return (
      <Card className="relative overflow-hidden border-2 border-dashed border-orange-200">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-orange-500/10 to-red-500/10" />

        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            Emergency Support Team
            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
              Not Set Up
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Activate Your Social Accountability Network</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add 1-5 people who care about your success. They'll help you achieve 90%+ success rates!
            </p>
            <Button asChild className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <Link href="/onboarding/emergency-support-team">
                <Plus className="h-4 w-4 mr-2" />
                Set Up Emergency Support Team
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'parent':
        return 'bg-blue-100 text-blue-800'
      case 'spouse':
        return 'bg-pink-100 text-pink-800'
      case 'sibling':
        return 'bg-green-100 text-green-800'
      case 'friend':
        return 'bg-purple-100 text-purple-800'
      case 'coworker':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case 'text_voicemail':
        return <Phone className="h-3 w-3" />
      case 'text_only':
        return <MessageCircle className="h-3 w-3" />
      case 'email':
        return <MessageCircle className="h-3 w-3" />
      default:
        return <MessageCircle className="h-3 w-3" />
    }
  }

  const recentActivity = recentEscalations.slice(0, 3)

  return (
    <Card className="relative overflow-hidden">
      {/* Header with emergency styling */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-red-500/10 to-orange-500/10" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500">
            <Shield className="h-5 w-5 text-white" />
          </div>
          Emergency Support Team
          <div className="ml-auto flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600 font-medium">Active</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
          <Button size="sm" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </Button>
          <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <Video className="h-4 w-4 mr-1" />
            Video
          </Button>
        </div>

        {/* Team Members */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Your Support Network ({activeMembers?.length || 0})
            </h4>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/onboarding/emergency-support-team">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {(activeMembers || []).map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              {/* Avatar with status */}
              <div className="relative">
                <ProfileAvatar size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10" />
                {member.consent_given && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="h-2 w-2 text-white" />
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-sm text-gray-900 truncate">
                    {member.name}
                  </h5>
                  <Badge variant="outline" className={cn("text-xs px-1.5 py-0.5", getRelationshipColor(member.relationship))}>
                    {member.relationship}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  {getContactMethodIcon(member.preferred_contact_method)}
                  <span>{member.preferred_contact_method.replace('_', ' ')}</span>
                </div>

                {member.contact_count > 0 && (
                  <div className="text-xs text-gray-500">
                    Contacted {member.contact_count} times
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                {member.consent_given ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activity
            </h4>

            <div className="space-y-2">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 text-sm text-blue-800">
                    {activity.type === 'emergency_support_team_notification' && 'Emergency Support Team notified'}
                    {activity.type === 'milestone_celebration' && 'Milestone celebration sent'}
                    {activity.type === 'progress_team_outreach' && 'Progress Support Team reached out'}
                  </div>
                  <div className="text-xs text-blue-600">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{consentedMembers.length}</div>
            <div className="text-xs text-gray-600">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{emergencySupportTeamNotifications.length}</div>
            <div className="text-xs text-gray-600">Notifications Sent</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">90%+</div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
