'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { MoreHorizontal, Phone, Copy as CopyIcon, ExternalLink } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

// Reason: Minimal shared shape for the actions component; mirrors AdminDashboard's PhoneLead
export interface Lead {
  id: string
  phone: string
  lead_status: string
  lead_notes: string | null
  converted_user_id: string | null
}

interface Props {
  lead: Lead
  vmTemplate: string
  onRefresh: () => void
  onAttachUser: () => void
  onOpenPayment: (url: string) => void
  isOpen?: boolean
  onToggleWorkspace: () => void
}

// Reason: Map the journey into ordered linear steps with machine statuses and human labels
const STEPS: { key: string; label: string }[] = [
  { key: 'new', label: 'New Lead – Untouched' },
  { key: 'contacted', label: 'Reached Out – Dialed' },
  { key: 'connected_now', label: 'Connected – Live Now' },
  { key: 'signup_sent', label: 'Signup Link Sent' },
  { key: 'account_created', label: 'Account Created' },
  { key: 'attached', label: 'Attach to User' },
  { key: 'payment_pending', label: 'Payment Pending' },
  { key: 'card_on_file', label: 'Card on File' },
  { key: 'onboarded', label: 'Onboarded' },
]

function getCurrentStepIndex(lead: Lead) {
  // Reason: Derive the current index based on lead_status and converted_user_id
  const status = lead.lead_status
  if (!status || status === 'new' || status === 'not_contacted' || status === 'open') return 0
  if (status === 'contacted') return 1
  if (status === 'connected_now') return 2
  if (status === 'signup_sent') return 3
  if (status === 'account_created') return lead.converted_user_id ? 5 : 4
  if (!lead.converted_user_id && (status === 'converted' || status === 'qualified')) return 4
  if (lead.converted_user_id && (status === 'converted' || status === 'qualified')) return 5
  if (status === 'payment_pending') return 6
  if (status === 'card_on_file') return 7
  if (status === 'onboarded') return 8
  return 0
}

export function LeadLinearActions({ lead, vmTemplate, onRefresh, onAttachUser, onOpenPayment, isOpen = false, onToggleWorkspace }: Props) {
  const [loading, setLoading] = useState(false)

  const stepIndex = getCurrentStepIndex(lead)
  const total = STEPS.length
  const stepLabel = `Step ${Math.min(stepIndex + 1, total)}/${total}: ${STEPS[stepIndex].label}`

  async function patchStatus(status: string, notes?: string) {
    const res = await fetch('/api/admin/phone-leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id, status, notes }),
    })
    if (!res.ok) throw new Error('Failed to update lead')
  }

  async function doNext() {
    try {
      setLoading(true)
      const status = lead.lead_status

      // Reason: Handle the linear progression based on current state
      if (!status || status === 'new' || status === 'not_contacted' || status === 'open') {
        // Step 1 -> 2: Send Text + VM (copy script + mark contacted)
        try {
          await navigator.clipboard.writeText(vmTemplate)
          toast.success('VM/Text script copied')
        } catch {
          // non-blocking
        }
        await toast.promise(
          patchStatus('contacted', 'Text + VM action used'),
          { loading: 'Marking reached out...', success: 'Marked: Reached Out', error: 'Failed to update lead' }
        )
        onRefresh()
        return
      }

      if (status === 'contacted') {
        await toast.promise(
          patchStatus('connected_now'),
          { loading: 'Marking live now...', success: 'Marked: Live Now', error: 'Failed to update lead' }
        )
        onRefresh()
        return
      }

      if (status === 'connected_now') {
        await toast.promise(
          patchStatus('signup_sent', 'Signup link sent during call'),
          { loading: 'Logging signup link...', success: 'Marked: Signup Link Sent', error: 'Failed to update lead' }
        )
        onRefresh()
        return
      }

      if (status === 'signup_sent' || status === 'qualified' || status === 'account_created') {
        if (!lead.converted_user_id) {
          // Open attach dialog
          onAttachUser()
          return
        }
        // Already attached, move to payment generation
        await generatePayment()
        return
      }

      if (!lead.converted_user_id) {
        onAttachUser()
        return
      }

      if (status === 'payment_pending') {
        toast.info('Waiting for payment... Webhook will update to Card on File')
        return
      }

      if (status === 'card_on_file') {
        await toast.promise(
          patchStatus('onboarded', 'Onboarding completed during call'),
          { loading: 'Marking onboarded...', success: 'Marked: Onboarded', error: 'Failed to update lead' }
        )
        onRefresh()
        return
      }

      // Default: try generating payment if attached
      if (lead.converted_user_id) {
        await generatePayment()
        return
      }

      // Fallback: mark contacted
      await toast.promise(
        patchStatus('contacted'),
        { loading: 'Marking reached out...', success: 'Marked: Reached Out', error: 'Failed to update lead' }
      )
      onRefresh()
    } catch (e: any) {
      console.error(e)
      toast.error(e?.message || 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  async function generatePayment() {
    // Reason: Generate checkout and open dialog, then mark payment_pending
    const res = await fetch('/api/admin/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: lead.converted_user_id, tierId: 'pro', beta: true }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to create checkout session')
    onOpenPayment(data.url)
    await patchStatus('payment_pending', 'Payment link generated')
    onRefresh()
  }

  // Reason: Secondary quick actions, tucked in a 3-dot menu to keep UI clean
  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(lead.phone)
      toast.success('Phone copied')
    } catch {
      toast.error('Could not copy phone')
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
      {/* Step indicator */}
      <div className="flex-1">
        <div className="text-xs text-gray-400 mb-1">{stepLabel}</div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${((stepIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Primary Next button */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onToggleWorkspace}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
        >
          {isOpen ? 'Hide workflow' : 'Show workflow'}
        </Button>

        {/* More menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="z-50 min-w-[10rem] rounded-md border border-gray-700 bg-gray-900 text-gray-200 shadow-md p-1">
            <DropdownMenu.Item asChild>
              <button
                className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-gray-800 flex items-center gap-2"
                onClick={() => window.open(`tel:${lead.phone}`, '_self')}
              >
                <Phone className="w-4 h-4" /> Call
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <button
                className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-gray-800 flex items-center gap-2"
                onClick={copyPhone}
              >
                <CopyIcon className="w-4 h-4" /> Copy phone
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <button
                className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-gray-800 flex items-center gap-2"
                onClick={() => window.open('https://www.fastbackgroundcheck.com/phone', '_blank')}
              >
                <ExternalLink className="w-4 h-4" /> Lookup
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  )
}

