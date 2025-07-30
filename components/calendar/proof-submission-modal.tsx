'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Camera, Mic, Upload, FileText, X, Star } from 'lucide-react'
import { useDailyLogs } from '@/hooks/use-daily-logs'
import type { Database } from '@/types/supabase'

type Goal = Database['public']['Tables']['goals']['Row']
type DailyLog = Database['public']['Tables']['daily_logs']['Row']

interface ProofSubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal
  targetDate: string
  existingLog?: DailyLog | null
}

export function ProofSubmissionModal({
  isOpen,
  onClose,
  goal,
  targetDate,
  existingLog
}: ProofSubmissionModalProps) {
  const [notes, setNotes] = useState(existingLog?.notes || '')
  const [progressRating, setProgressRating] = useState(existingLog?.mood_rating || 0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { logProgress } = useDailyLogs(targetDate)

  // Reason: Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notes.trim()) {
      alert('Please provide detailed notes about your progress as proof.')
      return
    }
    if (progressRating === 0) {
      alert('Please rate how you feel about your progress (1-10 stars).')
      return
    }

    setIsSubmitting(true)
    try {
      await logProgress({
        goalId: goal.id,
        completed: true,
        progressValue: goal.target_frequency, // Always full completion when submitting proof
        notes: notes.trim(),
        moodRating: progressRating
      })
      onClose()
    } catch (error) {
      console.error('Error submitting proof:', error)
      console.error('Submission data:', {
        goalId: goal.id,
        completed: true,
        progressValue: goal.target_frequency,
        notes: notes.trim(),
        moodRating: progressRating,
        targetDate
      })
      alert(`Failed to submit proof: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reason: Reset form when modal closes
  const handleClose = () => {
    if (!isSubmitting) {
      setNotes(existingLog?.notes || '')
      setProgressRating(existingLog?.mood_rating || 0)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {existingLog ? 'View/Edit Entry' : 'Submit Proof'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-medium text-gray-900 text-sm">{goal.title}</h3>
            <p className="text-xs text-gray-600 mt-1">
              Target: {goal.target_frequency}x {goal.frequency_type}
            </p>
          </div>



          {/* Detailed Notes - Required Proof */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-gray-900">
              Detailed Progress Notes *
            </Label>
            <p className="text-xs text-gray-600 mb-2">
              Describe what you accomplished, how it went, any challenges, insights, or observations. This serves as your proof of completion.
            </p>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full resize-none"
              placeholder="Example: Practiced guitar for 45 minutes. Worked on chord transitions between G, C, and D. Still struggling with the transition from C to D but getting smoother. Played through 'Wonderwall' 3 times..."
              required
            />
          </div>

          {/* Progress Rating */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-3 block">
              How do you feel about your progress in this session? *
            </Label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 10 }, (_, i) => {
                const starNumber = i + 1
                const isSelected = starNumber <= progressRating

                return (
                  <button
                    key={starNumber}
                    type="button"
                    onClick={() => setProgressRating(starNumber)}
                    className="p-1 hover:scale-110 transition-transform duration-150"
                    title={`${starNumber} star${starNumber > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`h-6 w-6 transition-colors duration-150 ${
                        isSelected
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                )
              })}
              <span className="ml-3 text-sm text-gray-600">
                {progressRating > 0 ? `${progressRating}/10` : 'Rate your progress'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              1 = I showed up, 10 = Exceeded expectations
            </p>
          </div>

          {/* Future: Photo/Video/Voice Upload Placeholders */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
            <div className="text-center text-gray-500">
              <div className="flex justify-center gap-4 mb-2">
                <Camera className="h-6 w-6" />
                <Mic className="h-6 w-6" />
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm">Photo, video, and voice proof coming soon!</p>
              <p className="text-xs">For now, detailed notes serve as your proof.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !notes.trim() || progressRating === 0}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : existingLog ? 'Update Entry' : 'Submit Proof'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
