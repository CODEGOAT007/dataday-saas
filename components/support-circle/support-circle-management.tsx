'use client'

import { useState } from 'react'
import { useSupportCircle } from '@/hooks/use-support-circle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Settings, CheckCircle, AlertTriangle, Phone, Mail, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { RelationshipType, ContactMethod } from '@/types'

export function SupportCircleManagement() {
  const { activeMembers, consentedMembers, isLoading, addMember, deactivateMember, isDeactivatingMember } = useSupportCircle()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    relationship: '' as RelationshipType | '',
    phone: '',
    email: '',
    preferred_contact_method: '' as ContactMethod | ''
  })

  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      preferred_contact_method: ''
    })
  }

  // Remove member handler
  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from your Support Circle?`)) {
      try {
        await deactivateMember({ id: memberId, reason: 'Removed by user' })
      } catch (error) {
        console.error('Error removing member:', error)
        toast.error('❌ Failed to remove member', {
          description: 'Something went wrong while removing the member. Please try again.',
          duration: 4000,
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.relationship || !formData.preferred_contact_method) {
      toast.error('❌ Missing required fields', {
        description: 'Please fill in all required fields (Name, Relationship, and Contact Method).',
        duration: 4000,
      })
      return
    }

    if (!formData.phone && !formData.email) {
      toast.error('❌ Contact information required', {
        description: 'Please provide either a phone number or email address.',
        duration: 4000,
      })
      return
    }

    setIsSubmitting(true)

    try {
      const memberData = {
        name: formData.name,
        relationship: formData.relationship as RelationshipType,
        phone: formData.phone || null,
        email: formData.email || null,
        preferred_contact_method: formData.preferred_contact_method as ContactMethod,
        consent_given: false,
        milestone_notifications_enabled: true,
        escalation_notifications_enabled: true,
        is_active: true
      }

      console.log('Adding member with data:', memberData)
      await addMember(memberData)

      // Send consent request to the newly added member
      if (formData.email || formData.phone) {
        try {
          console.log('Sending consent request to newly added member:', {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          })

          const response = await fetch('/api/consent/send-all', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error('Failed to send consent request:', response.status, errorData)
          } else {
            const result = await response.json()
            console.log('Consent request sent successfully:', result)
            toast.success(`🎉 ${formData.name} added to your Support Circle!`, {
              description: `Consent request sent successfully. They'll receive an email to join.`,
              duration: 5000,
            })
          }
        } catch (error) {
          console.error('Error sending consent request:', error)
          // Don't fail the whole operation if consent email fails
          toast.warning(`⚠️ ${formData.name} added, but consent email failed`, {
            description: 'Member was added to your Support Circle, but we couldn\'t send the consent request. You can try again later.',
            duration: 6000,
          })
        }
      }

      resetForm()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding member:', error)
      console.error('Full error object:', JSON.stringify(error, null, 2))

      // Extract more specific error information
      let errorMessage = 'Something went wrong while adding the member. Please try again.'
      if (error instanceof Error) {
        console.log('Error message:', error.message)
        if (error.message.includes('duplicate') || error.message.includes('unique')) {
          errorMessage = `This email is already in your Support Circle. You can have the same person with different relationships, but they need different email addresses.`
        } else if (error.message.includes('support_circle_relationship_check')) {
          errorMessage = 'Invalid relationship type selected. Please choose from: Parent, Spouse, Sibling, Friend, or Coworker.'
        } else if (error.message.includes('constraint')) {
          errorMessage = 'Database constraint violation. Please check your input and try again.'
        } else {
          errorMessage = error.message
        }
      }

      toast.error('❌ Failed to add member', {
        description: errorMessage,
        duration: 6000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="space-y-6"><div className="animate-pulse"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Support Circle</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{activeMembers.length} active members ready to support your goals</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeMembers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Ready to Help</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{consentedMembers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Support Circle Members */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{member.name}</CardTitle>
                {member.consent_given ? (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground capitalize">
                  {member.relationship}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  {member.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>{member.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Preferred contact: {member.preferred_contact_method?.replace('_', ' ')}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id, member.name)}
                    disabled={isDeactivatingMember}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    title={`Remove ${member.name} from Support Circle`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your Support Circle settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Member
            </Button>
            <Button variant="outline" disabled>
              <Settings className="h-4 w-4 mr-2" />
              Notification Settings
              <Badge variant="secondary" className="ml-2">Soon</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Member Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Support Circle Member</DialogTitle>
            <DialogDescription>
              Add someone who can help keep you accountable to your goals.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter their name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship *</Label>
              <Select value={formData.relationship} onValueChange={(value) => handleInputChange('relationship', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="coworker">Coworker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="their@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-method">Preferred Contact Method *</Label>
              <Select value={formData.preferred_contact_method} onValueChange={(value) => handleInputChange('preferred_contact_method', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="How should we contact them?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="text">Text Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
