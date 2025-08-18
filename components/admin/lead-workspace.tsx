'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LeadLinearActions } from '@/components/admin/lead-linear-actions'
import { LeadWorkflowFullscreen } from '@/components/admin/lead-workflow-fullscreen'
import { toast } from 'sonner'

export interface LeadWorkspaceLead {
  id: string
  phone: string
  email: string | null
  full_name: string | null
  lead_status: string
  lead_notes: string | null
  converted_user_id: string | null
}

interface Props {
  lead: LeadWorkspaceLead
  vmTemplate: string
  onClose: () => void
  onRefresh: () => void
  onAttachUser: () => void
  onOpenPayment: (url: string) => void
  useFullscreen?: boolean
}

function needsAttach(lead: LeadWorkspaceLead) {
  return !lead.converted_user_id && (lead.lead_status === 'signup_sent' || lead.lead_status === 'account_created')
}

function canGeneratePayment(lead: LeadWorkspaceLead) {
  return !!lead.converted_user_id && !['payment_pending', 'card_on_file', 'onboarded', 'converted'].includes(lead.lead_status)
}

export function LeadWorkspace({ lead, vmTemplate, onClose, onRefresh, onAttachUser, onOpenPayment, useFullscreen = false }: Props) {
  const [loading, setLoading] = useState(false)

  // Reason: Provide a concise live-call opener so dialing can happen first
  const liveCallScript = "Hey, it's Chris from Dataday. You just dropped your number on the site — do you have 2 minutes now so I can get you set up and explain how the Support Circle works?"

  // Reason: Use full-screen workflow for new leads that need calling
  if (useFullscreen && ['new', 'not_contacted', 'open'].includes(lead.lead_status || '')) {
    return (
      <LeadWorkflowFullscreen
        lead={lead}
        vmTemplate={vmTemplate}
        onClose={onClose}
        onRefresh={onRefresh}
        onAttachUser={onAttachUser}
        onOpenPayment={onOpenPayment}
      />
    )
  }

  async function generatePayment() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: lead.converted_user_id, tierId: 'pro', beta: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout session')
      onOpenPayment(data.url)
      await fetch('/api/admin/phone-leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, status: 'payment_pending', notes: 'Payment link generated from workspace' })
      })
      onRefresh()
    } catch (e: any) {
      toast.error(e?.message || 'Could not generate payment link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 z-[1000] w-full sm:max-w-md bg-gray-900 border-l border-gray-800 shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div>
          <div className="text-sm text-gray-400">Lead Workspace</div>
          <div className="text-white font-semibold">{lead.full_name || lead.phone}</div>
        </div>
        <Button variant="ghost" onClick={onClose} className="text-gray-300 hover:text-white">Close</Button>
      </div>
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Linear control */}
        <LeadLinearActions
          lead={lead}
          vmTemplate={vmTemplate}
          onRefresh={onRefresh}
          onAttachUser={onAttachUser}
          onOpenPayment={onOpenPayment}
          isOpen={true}
          onToggleWorkspace={onClose}
        />

        {/* Contextual content */}
        {['new', 'not_contacted', 'open'].includes(lead.lead_status || '') && (
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-400">Live Call Opener</div>
              <pre className="whitespace-pre-wrap text-sm bg-gray-800 border border-gray-700 rounded p-3 text-gray-200">{liveCallScript}</pre>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => window.open(`tel:${lead.phone}`, '_self')}>Dial</Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-700 text-gray-200"
                  onClick={async () => {
                    try { await navigator.clipboard.writeText(liveCallScript); toast.success('Live script copied') } catch { toast.error('Copy failed') }
                  }}
                >Copy Live Script</Button>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">If No Answer → Text + Voicemail Script</div>
              <pre className="whitespace-pre-wrap text-sm bg-gray-800 border border-gray-700 rounded p-3 text-gray-200">{vmTemplate}</pre>
              <Button
                size="sm"
                onClick={async () => {
                  try { await navigator.clipboard.writeText(vmTemplate); toast.success('Text/VM script copied') } catch { toast.error('Copy failed') }
                }}
              >Copy Text+VM Script</Button>
            </div>
          </div>
        )}

        {lead.lead_status === 'contacted' && (
          <div className="space-y-2">
            <div className="text-sm text-gray-400">Live Call Opener</div>
            <pre className="whitespace-pre-wrap text-sm bg-gray-800 border border-gray-700 rounded p-3 text-gray-200">{liveCallScript}</pre>
            <Button size="sm" onClick={() => window.open(`tel:${lead.phone}`, '_self')}>Dial</Button>
          </div>
        )}

        {needsAttach(lead) && (
          <div className="space-y-2">
            <div className="text-sm text-gray-400">Attach this lead to a user</div>
            <Button size="sm" variant="outline" className="border-gray-700 text-gray-200" onClick={onAttachUser}>Open Attach Dialog</Button>
            <div className="text-xs text-gray-500">Once attached, use Next step to generate payment.</div>
          </div>
        )}

        {canGeneratePayment(lead) && (
          <div className="space-y-2">
            <div className="text-sm text-gray-400">Payment</div>
            <Button size="sm" className="bg-green-700 hover:bg-green-800" onClick={generatePayment} disabled={loading}>
              Generate Payment Link (Pro Beta)
            </Button>
            <div className="text-xs text-gray-500">This sets status to Payment Pending and opens the link.</div>
          </div>
        )}
      </div>
    </div>
  )
}

