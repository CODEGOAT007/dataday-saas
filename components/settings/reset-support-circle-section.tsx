'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Users, Trash2, AlertTriangle } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useSupportCircle } from '@/hooks/use-support-circle'

export function ResetSupportCircleSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const { activeMembers, consentedMembers } = useSupportCircle()
  const supabase = createClientComponentClient()

  const handleReset = async () => {
    setIsResetting(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('No authenticated user')
      }

      // Delete all support circle members for this user
      const { error } = await supabase
        .from('support_circle')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      toast.success('🗑️ Support Circle Reset Successfully!', {
        description: 'All support circle members have been removed. You can now set up a new support circle.',
        duration: 5000,
      })

      setIsDialogOpen(false)
      
      // Refresh the page to update all components
      window.location.reload()

    } catch (error) {
      console.error('Error resetting support circle:', error)
      toast.error('❌ Failed to reset support circle', {
        description: 'Please try again or contact support if the problem persists.',
        duration: 5000,
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <>
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Users className="h-5 w-5" />
            Reset Support Circle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                  Danger Zone
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  This will permanently delete all members from your support circle. This action cannot be undone.
                </p>
                <div className="text-sm text-red-600 dark:text-red-400">
                  <strong>Current Support Circle:</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    <li>{activeMembers.length} active members</li>
                    <li>{consentedMembers.length} members ready to help</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsDialogOpen(true)}
            variant="destructive"
            className="w-full"
            disabled={activeMembers.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {activeMembers.length === 0 ? 'No Support Circle to Reset' : 'Reset Support Circle'}
          </Button>

          {activeMembers.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              You don't have any support circle members to reset.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Reset Support Circle?
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                This will permanently delete <strong>all {activeMembers.length} members</strong> from your support circle.
              </p>
              <p className="text-red-600 font-medium">
                This action cannot be undone.
              </p>
              <p>
                You'll need to re-add all members and they'll need to give consent again.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isResetting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
              disabled={isResetting}
              className="w-full sm:w-auto"
            >
              {isResetting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Resetting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Yes, Reset Support Circle
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
