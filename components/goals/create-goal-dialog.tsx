'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGoals } from '@/hooks/use-goals'
import { X } from 'lucide-react'

interface CreateGoalDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateGoalDialog({ isOpen, onClose }: CreateGoalDialogProps) {
  const { createGoal, isCreating, createError } = useGoals()
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  // Reason: Handle form submission for goal creation
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const targetFrequency = parseInt(formData.get('target_frequency') as string) || 1
    const frequencyType = formData.get('frequency_type') as string
    const difficultyLevel = parseInt(formData.get('difficulty_level') as string) || 1

    try {
      await createGoal({
        title,
        description: description || null,
        category: category as any,
        target_frequency: targetFrequency,
        frequency_type: frequencyType as any,
        difficulty_level: difficultyLevel,
        start_date: new Date().toISOString().split('T')[0], // Today's date
        status: 'active',
      })

      setSuccess(true)
      // Close dialog after a brief success message
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 1500)
    } catch (error) {
      console.error('Goal creation error:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Create New Goal</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-8">
              <div className="text-green-600 text-lg font-medium mb-2">
                🎉 Goal Created Successfully!
              </div>
              <p className="text-muted-foreground">
                Your goal has been added and you can start tracking progress.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {createError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {createError.message}
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Goal Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Exercise 30 minutes daily"
                  required
                  disabled={isCreating}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional: Add more details about your goal..."
                  disabled={isCreating}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isCreating}
                >
                  <option value="">Select a category</option>
                  <option value="health">Health & Fitness</option>
                  <option value="career">Career & Work</option>
                  <option value="personal">Personal Development</option>
                  <option value="financial">Financial</option>
                  <option value="education">Education & Learning</option>
                  <option value="relationships">Relationships</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="target_frequency" className="block text-sm font-medium mb-2">
                    How Often?
                  </label>
                  <input
                    id="target_frequency"
                    name="target_frequency"
                    type="number"
                    min="1"
                    max="10"
                    defaultValue="1"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isCreating}
                  />
                </div>

                <div>
                  <label htmlFor="frequency_type" className="block text-sm font-medium mb-2">
                    Frequency
                  </label>
                  <select
                    id="frequency_type"
                    name="frequency_type"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isCreating}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="difficulty_level" className="block text-sm font-medium mb-2">
                  Difficulty Level (1-5)
                </label>
                <select
                  id="difficulty_level"
                  name="difficulty_level"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isCreating}
                >
                  <option value="1">1 - Very Easy</option>
                  <option value="2">2 - Easy</option>
                  <option value="3">3 - Moderate</option>
                  <option value="4">4 - Hard</option>
                  <option value="5">5 - Very Hard</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isCreating}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1"
                >
                  {isCreating ? 'Creating...' : 'Create Goal'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
