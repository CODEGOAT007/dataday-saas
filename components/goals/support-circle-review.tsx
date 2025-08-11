'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// Using simple div instead of Avatar component
import { Plus, Mail, Phone, MessageSquare, Edit } from 'lucide-react'
import { toast } from 'sonner'

interface SupportMember {
  id: string
  name: string
  relationship: string
  preferred_contact_method: 'email' | 'phone' | 'sms'
  email?: string
  phone?: string
}

export function SupportCircleReview() {
  const [members, setMembers] = useState<SupportMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSupportCircle()
  }, [])

  const fetchSupportCircle = async () => {
    try {
      const response = await fetch('/api/support-circle')
      if (!response.ok) throw new Error('Failed to fetch support circle')
      
      const data = await response.json()
      setMembers(data.members || [])
    } catch (error) {
      console.error('Error fetching support circle:', error)
      toast.error('Failed to load support circle')
    } finally {
      setLoading(false)
    }
  }

  const getContactIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      case 'sms': return <MessageSquare className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
    }
  }

  const getContactMethodLabel = (method: string) => {
    switch (method) {
      case 'email': return 'Email'
      case 'phone': return 'Phone'
      case 'sms': return 'SMS'
      default: return 'Email'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">No Support Circle Yet</h3>
              <p className="text-gray-400 mb-4">
                Add people who care about your success and will help keep you accountable.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Add Support Members
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Your Support Circle ({members.length} {members.length === 1 ? 'member' : 'members'})
        </h3>
        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
          <Edit className="w-4 h-4 mr-2" />
          Edit Circle
        </Button>
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <Card key={member.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(member.name)}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{member.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {member.relationship}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        {getContactIcon(member.preferred_contact_method)}
                        <span>{getContactMethodLabel(member.preferred_contact_method)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-400">
                    {member.preferred_contact_method === 'email' && member.email && (
                      <div>{member.email}</div>
                    )}
                    {(member.preferred_contact_method === 'phone' || member.preferred_contact_method === 'sms') && member.phone && (
                      <div>{member.phone}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-900/20 border-blue-700">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="text-blue-200 font-medium mb-1">What happens when you send notifications:</p>
              <ul className="text-blue-300 space-y-1">
                <li>• Each person gets a personalized email with your voice message</li>
                <li>• They'll understand exactly what your goal is and how to support you</li>
                <li>• We only contact them if you miss your goal for 2+ consecutive days</li>
                <li>• Maximum 1-2 notifications per month per person</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" className="border-gray-600 text-gray-300">
          <Plus className="w-4 h-4 mr-2" />
          Add More People
        </Button>
      </div>
    </div>
  )
}
