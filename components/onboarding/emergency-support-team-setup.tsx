'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Users, 
  Shield, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Heart,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSupportCircle } from '@/hooks/use-support-circle'
import { useAuth } from '@/hooks/use-auth'
import type { SupportCircleInsert, RelationshipType, ContactMethod } from '@/types'

interface SupportCircleMemberForm {
  id: string
  name: string
  relationship: RelationshipType | ''
  phone: string
  email: string
  preferred_contact_method: ContactMethod | ''
}

export function SupportCircleSetup() {
  const { user } = useAuth()
  const { addMultipleMembers, isAddingMultiple } = useSupportCircle()
  const [members, setMembers] = useState<SupportCircleMemberForm[]>([
    { id: '1', name: '', relationship: '', phone: '', email: '', preferred_contact_method: '' }
  ])
  const [currentStep, setCurrentStep] = useState<'intro' | 'setup' | 'consent' | 'complete'>('intro')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addMember = () => {
    if (members.length < 5) {
      setMembers([
        ...members,
        { 
          id: Date.now().toString(), 
          name: '', 
          relationship: '', 
          phone: '', 
          email: '', 
          preferred_contact_method: '' 
        }
      ])
    }
  }

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter(member => member.id !== id))
    }
  }

  const updateMember = (id: string, field: keyof SupportCircleMemberForm, value: string) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ))
  }

  const isValidMember = (member: SupportCircleMemberForm) => {
    return member.name.trim() && 
           member.relationship && 
           member.preferred_contact_method &&
           ((member.preferred_contact_method === 'email' && member.email.trim()) ||
            (member.preferred_contact_method !== 'email' && member.phone.trim()))
  }

  const validMembers = members.filter(isValidMember)
  const canProceed = validMembers.length >= 1

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Convert to the format expected by Supabase
      const membersToInsert: SupportCircleInsert[] = validMembers.map(member => ({
        name: member.name.trim(),
        relationship: member.relationship as RelationshipType,
        phone: member.phone.trim() || null,
        email: member.email.trim() || null,
        preferred_contact_method: member.preferred_contact_method as ContactMethod,
        consent_given: false, // Will be updated when we get consent
        milestone_notifications_enabled: true,
        escalation_notifications_enabled: true,
        is_active: true
      }))

      await addMultipleMembers(membersToInsert)

      // Send consent requests if user is authenticated
      if (user?.id) {
        try {
          await fetch('/api/consent/send-all', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}), // User ID comes from authentication
          })
        } catch (error) {
          console.error('Error sending consent requests:', error)
          // Don't fail the whole process if consent requests fail
        }
      }

      setCurrentStep('complete')
    } catch (error) {
      console.error('Error saving Emergency Support Team:', error)
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  if (currentStep === 'intro') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Your Emergency Support Team</CardTitle>
          <CardDescription className="text-lg">
            The secret to 90%+ success rate: Social Accountability
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              How It Works
            </h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <p><strong>Day 1 missed:</strong> Our Progress Support Team reaches out with encouragement</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <p><strong>Day 2 missed:</strong> Your Emergency Support Team gets notified to check in</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <p><strong>Milestones:</strong> Everyone celebrates your 7, 30, and 60-day streaks!</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">90%+</div>
              <div className="text-sm text-green-700">Success rate with Support Circle</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">20%</div>
              <div className="text-sm text-red-700">Industry average without support</div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => setCurrentStep('setup')}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            >
              Set Up My Support Circle
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === 'setup') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Add Your Support Circle
          </CardTitle>
          <CardDescription>
            Add 1-5 people who care about your success. We'll only contact them if you miss goals for 2+ days.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {members.map((member, index) => (
              <Card key={member.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Support Person #{index + 1}
                  </h4>
                  {members.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`name-${member.id}`}>Name *</Label>
                    <Input
                      id={`name-${member.id}`}
                      value={member.name}
                      onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                      placeholder="e.g., Mom, Sarah, John"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`relationship-${member.id}`}>Relationship *</Label>
                    <Select
                      value={member.relationship}
                      onValueChange={(value) => updateMember(member.id, 'relationship', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="spouse">Spouse/Partner</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="coworker">Coworker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`contact-method-${member.id}`}>Preferred Contact *</Label>
                    <Select
                      value={member.preferred_contact_method}
                      onValueChange={(value) => updateMember(member.id, 'preferred_contact_method', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How to contact them" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text_voicemail">Text + Voicemail</SelectItem>
                        <SelectItem value="text_only">Text Only</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    {member.preferred_contact_method === 'email' ? (
                      <>
                        <Label htmlFor={`email-${member.id}`}>Email *</Label>
                        <Input
                          id={`email-${member.id}`}
                          type="email"
                          value={member.email}
                          onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                          placeholder="their.email@example.com"
                        />
                      </>
                    ) : (
                      <>
                        <Label htmlFor={`phone-${member.id}`}>Phone Number *</Label>
                        <Input
                          id={`phone-${member.id}`}
                          type="tel"
                          value={member.phone}
                          onChange={(e) => updateMember(member.id, 'phone', e.target.value)}
                          placeholder="(555) 123-4567"
                        />
                      </>
                    )}
                  </div>
                </div>
                
                {isValidMember(member) && (
                  <div className="mt-3 flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Ready to go!</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
          
          {members.length < 5 && (
            <Button
              variant="outline"
              onClick={addMember}
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Person (Optional)
            </Button>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {validMembers.length} of {members.length} people ready
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('intro')}
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep('consent')}
                disabled={!canProceed}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                Continue to Consent
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === 'consent') {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Consent & Privacy
          </CardTitle>
          <CardDescription>
            We'll get consent from each person before adding them to your Emergency Support Team.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              How We Get Consent
            </h3>
            <div className="space-y-3 text-sm text-green-800">
              <p>
                <strong>We'll contact each person</strong> via their preferred method to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Explain they've been added to your Support Circle</li>
                <li>Get their explicit consent to receive notifications</li>
                <li>Let them opt out if they prefer not to participate</li>
                <li>Explain exactly when and how they'll be contacted</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Your Support Circle:</h4>
            {validMembers.map((member, index) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {member.relationship} • {member.preferred_contact_method.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  Consent Pending
                </Badge>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Privacy Promise</p>
                <p>
                  We only contact your Emergency Support Team when you miss goals for 2+ days or hit major milestones.
                  They can opt out anytime, and we never share your personal information beyond goal progress.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep('setup')}
            >
              Back to Edit
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {isSubmitting ? 'Setting Up...' : 'Complete Setup'}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === 'complete') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-green-600">Emergency Support Team Activated! 🎉</CardTitle>
          <CardDescription className="text-lg">
            You're now part of the 90%+ success rate club
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{validMembers.length}</div>
                <div className="text-sm text-green-700">Support People</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">90%+</div>
                <div className="text-sm text-blue-700">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-purple-700">Support Active</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 mb-3">What Happens Next:</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>We'll contact each person to get their consent (within 24 hours)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Your Emergency Support Team will be notified only if you miss goals for 2+ days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>They'll celebrate with you when you hit 7, 30, and 60-day streaks!</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={() => window.location.href = '/dashboard'}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <div>Step: {currentStep}</div>
}
