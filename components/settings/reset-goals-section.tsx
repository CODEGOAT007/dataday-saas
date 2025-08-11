'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Trash2, AlertTriangle } from 'lucide-react'

export function ResetGoalsSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleResetGoals = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch('/api/goals/reset', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to reset goals')
      }

      const result = await response.json()
      
      toast.success(`Successfully deleted ${result.deletedCount} goals and ${result.deletedLogs} daily logs`)
      setIsOpen(false)
      
      // Refresh the page to update any goal displays
      window.location.reload()
      
    } catch (error) {
      console.error('Error resetting goals:', error)
      toast.error('Failed to reset goals. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <p className="font-medium text-gray-900 dark:text-white">Reset All Goals</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Delete all goals and daily logs for testing purposes
          </p>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Reset Goals
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Reset All Goals?
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <p>This will permanently delete:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>All your goals</li>
                <li>All daily logs and progress</li>
                <li>All voice notes</li>
                <li>All goal-related data</li>
              </ul>
              <p className="font-medium text-red-600 mt-3">
                This action cannot be undone and is only for testing purposes.
              </p>
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleResetGoals}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Yes, Reset All Goals'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
