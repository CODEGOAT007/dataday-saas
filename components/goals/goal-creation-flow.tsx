'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { VoiceRecorder } from '@/components/goals/voice-recorder'
import { CheckCircle, Target, Mic, Send } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useIntroSession } from '@/hooks/use-intro-session'

type Step = 'goal-details' | 'voice-message' | 'send-notifications'

interface GoalData {
  title: string
  description: string
  frequency: string
  duration: string
  voiceNoteUrl?: string
}


export function GoalCreationFlow() {
  const [currentStep, setCurrentStep] = useState<Step>('goal-details')
  const [goalData, setGoalData] = useState<GoalData>({
    title: '',
    description: '',
    frequency: '',
    duration: ''
  })

  const params = useSearchParams()
  const sessionId = params.get('session')
  const { session, patch } = useIntroSession(sessionId)

  // Keep currentStep in sync with Intro Session when present
  useEffect(() => {
    if (!sessionId) return
    const s = (session?.current_step as Step | undefined) || 'goal-details'
    setCurrentStep(s)
  }, [session?.current_step, sessionId])
  const [existingGoals, setExistingGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Check for existing goals on component mount
  useEffect(() => {
    fetchExistingGoals()
  }, [])

  const fetchExistingGoals = async () => {
    try {
      const response = await fetch('/api/goals')
      if (response.ok) {
        const data = await response.json()
        setExistingGoals(data.goals || [])
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 'goal-details', title: 'Goal Details', icon: Target },
    { id: 'voice-message', title: 'Voice Message', icon: Mic },
    { id: 'send-notifications', title: 'Send Notifications', icon: Send }
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  const handleNext = async () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      const next = steps[nextIndex].id as Step
      setCurrentStep(next)
      if (sessionId) {
        try { await patch({ current_step: next }) } catch {}
      }
    }
  }

  const handleBack = async () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      const prev = steps[prevIndex].id as Step
      setCurrentStep(prev)
      if (sessionId) {
        try { await patch({ current_step: prev }) } catch {}
      }
    }
  }

  const handleVoiceRecorded = (audioUrl: string) => {
    setGoalData(prev => ({ ...prev, voiceNoteUrl: audioUrl }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading your goals...</div>
      </div>
    )
  }

  // Show existing goals if any
  if (existingGoals.length > 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-blue-900/20 border-blue-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">User's Current Goals</h3>
            <div className="space-y-4">
              {existingGoals.map((goal) => (
                <div key={goal.id} className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-white">{goal.title}</h4>
                  {goal.description && (
                    <p className="text-gray-300 mt-1">{goal.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <span>Status: {goal.status}</span>
                    <span>Created: {new Date(goal.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <p className="text-yellow-200 text-sm">
                <strong>Coach Note:</strong> This user already has active goals. To set new goals with voice notes,
                reset their goals in Settings first, or modify existing goals through the dashboard.
              </p>
            </div>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => window.location.href = '/settings'}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                Go to Settings
              </Button>
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStepIndex
            const isCompleted = index < currentStepIndex

            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                  ${isActive ? 'border-blue-500 bg-blue-500 text-white' :
                    isCompleted ? 'border-green-500 bg-green-500 text-white' :
                    'border-gray-600 text-gray-400'}
                `}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-600'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {React.createElement(steps[currentStepIndex].icon, { className: "w-5 h-5" })}
            {steps[currentStepIndex].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 'goal-details' && (
            <GoalDetailsStep
              goalData={goalData}
              setGoalData={setGoalData}
              onNext={handleNext}
            />
          )}

          {currentStep === 'voice-message' && (
            <VoiceMessageStep
              goalData={goalData}
              onVoiceRecorded={handleVoiceRecorded}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 'send-notifications' && (
            <SendNotificationsStep
              goalData={goalData}
              onBack={handleBack}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Step Components
function GoalDetailsStep({
  goalData,
  setGoalData,
  onNext
}: {
  goalData: GoalData
  setGoalData: (data: GoalData) => void
  onNext: () => void
}) {
  const isValid = goalData.title && goalData.frequency && goalData.duration

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-white">What's your goal?</Label>
          <Input
            id="title"
            placeholder="e.g., Practice guitar, Exercise, Read books..."
            value={goalData.title}
            onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-white">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Add more details about your goal..."
            value={goalData.description}
            onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="frequency" className="text-white">How often?</Label>
            <Select value={goalData.frequency} onValueChange={(value) => setGoalData({ ...goalData, frequency: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="3x-week">3x per week</SelectItem>
                <SelectItem value="5x-week">5x per week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration" className="text-white">For how long?</Label>
            <Select value={goalData.duration} onValueChange={(value) => setGoalData({ ...goalData, duration: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">15 minutes</SelectItem>
                <SelectItem value="30min">30 minutes</SelectItem>
                <SelectItem value="45min">45 minutes</SelectItem>
                <SelectItem value="1hour">1 hour</SelectItem>
                <SelectItem value="2hours">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next: Record Voice Message
        </Button>
      </div>
    </div>
  )
}

function VoiceMessageStep({
  goalData,
  onVoiceRecorded,
  onNext,
  onBack
}: {
  goalData: GoalData
  onVoiceRecorded: (url: string) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-white">Help User Record Personal Message</h3>
        <p className="text-gray-300">
          Guide the user to record a heartfelt voice note asking their support circle to help with: "{goalData.title}"
        </p>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-300 italic">
            <strong>Coach:</strong> Help them say something like: "Hi! I've decided to {goalData.title.toLowerCase()} {goalData.frequency} for {goalData.duration}.
            This is really important to me, and I'd love your support to help me stay on track. Thank you!"
          </p>
        </div>
        <div className="bg-blue-900/20 border border-blue-700 p-3 rounded-lg">
          <p className="text-blue-200 text-sm">
            👨‍💼 <strong>Coach Tip:</strong> Encourage them to be personal and authentic. The more heartfelt, the better the response.
          </p>
        </div>
      </div>

      <VoiceRecorder onRecordingComplete={onVoiceRecorded} />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="border-gray-600 text-gray-300">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!goalData.voiceNoteUrl}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next: Send Notifications
        </Button>
      </div>
    </div>
  )
}



function SendNotificationsStep({ goalData, onBack }: { goalData: GoalData, onBack: () => void }) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendNotifications = async () => {
    setSending(true)
    setError(null)

    try {
      // First, create the goal
      const goalResponse = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: goalData.title,
          description: goalData.description,
          frequency: goalData.frequency,
          duration: goalData.duration,
          voice_note_url: goalData.voiceNoteUrl
        })
      })

      if (!goalResponse.ok) {
        throw new Error('Failed to create goal')
      }

      const { goal } = await goalResponse.json()
      try { sessionStorage.setItem('mdd_primary_goal_id', goal.id) } catch {}

      // Then send notifications to support circle
      const notificationResponse = await fetch('/api/support-circle/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId: goal.id,
          goalTitle: goalData.title,
          goalDescription: goalData.description,
          frequency: goalData.frequency,
          duration: goalData.duration,
          voiceNoteUrl: goalData.voiceNoteUrl
        })
      })

      if (!notificationResponse.ok) {
        throw new Error('Failed to send notifications')
      }

      const notificationResult = await notificationResponse.json()
      console.log('Notifications sent:', notificationResult)

      setSent(true)
    } catch (error) {
      console.error('Error sending notifications:', error)
      setError(error instanceof Error ? error.message : 'Failed to send notifications')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Notifications Sent! 🎉</h3>
          <p className="text-gray-300">
            Your support circle has been notified about your goal: "{goalData.title}"
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-white">Ready to Activate Support Circle?</h3>
        <p className="text-gray-300">
          The user's support circle will receive a personalized email with their voice message about: "{goalData.title}"
        </p>
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-white">What happens when you activate:</h4>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Support circle receives personalized email with user's voice message
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            System tracks user's daily progress automatically
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            If user misses 2+ days, support circle gets notified to check in
          </li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="border-gray-600 text-gray-300">
          Back
        </Button>
        <Button
          onClick={handleSendNotifications}
          disabled={sending}
          className="bg-green-600 hover:bg-green-700"
        >
          {sending ? 'Activating...' : 'Activate Support Circle'}
        </Button>
      </div>
    </div>
  )
}
