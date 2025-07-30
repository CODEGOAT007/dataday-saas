'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Camera, Mic, FileText, CheckCircle, Clock, Target } from 'lucide-react'
import { ProofSubmissionModal } from './proof-submission-modal'
import { useDailyLogs } from '@/hooks/use-daily-logs'
import type { Database } from '@/types/supabase'

type Goal = Database['public']['Tables']['goals']['Row']

interface GoalEntryCardProps {
  goal: Goal
  targetDate: string
  scheduledTime: string
}

export function GoalEntryCard({ goal, targetDate, scheduledTime }: GoalEntryCardProps) {
  const [showProofModal, setShowProofModal] = useState(false)
  const { dailyLogs } = useDailyLogs(targetDate)
  
  // Reason: Check if this goal has been completed today
  const todayLog = dailyLogs.find(log => log.goal_id === goal.id)
  const isCompleted = todayLog?.completed || false
  const hasProof = todayLog && (todayLog.photo_url || todayLog.video_url || todayLog.voice_url || todayLog.notes)

  // Reason: Get category color for visual distinction
  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-green-100 text-green-800',
      education: 'bg-blue-100 text-blue-800',
      career: 'bg-purple-100 text-purple-800',
      personal: 'bg-yellow-100 text-yellow-800',
      financial: 'bg-emerald-100 text-emerald-800',
      relationships: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  return (
    <>
      <Card className={`transition-all duration-200 ${
        isCompleted 
          ? 'bg-green-50 border-green-200 shadow-sm' 
          : 'bg-white border-gray-200 hover:shadow-md'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Goal Title and Status */}
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-1">
                  <h3 className={`font-medium text-sm ${
                    isCompleted ? 'line-through text-gray-600' : 'text-gray-900'
                  }`}>
                    {goal.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {goal.target_frequency}x {goal.frequency_type}
                    </span>
                  </div>
                </div>
                
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Scheduled Time */}
              <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Scheduled for {scheduledTime}
              </div>

              {/* Proof Status */}
              {isCompleted && hasProof && (
                <div className="text-xs text-green-600 mb-3 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Proof submitted
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!isCompleted ? (
                  <Button
                    size="sm"
                    onClick={() => setShowProofModal(true)}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Submit Proof
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProofModal(true)}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    View/Edit Entry
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proof Submission Modal */}
      <ProofSubmissionModal
        isOpen={showProofModal}
        onClose={() => setShowProofModal(false)}
        goal={goal}
        targetDate={targetDate}
        existingLog={todayLog}
      />
    </>
  )
}
