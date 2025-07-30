'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreateGoalDialog } from './create-goal-dialog'
import { Plus } from 'lucide-react'

export function CreateGoalButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Create Goal
      </Button>

      <CreateGoalDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  )
}
