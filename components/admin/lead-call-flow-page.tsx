'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LeadWorkflowFullscreen } from '@/components/admin/lead-workflow-fullscreen'

interface Lead {
  id: string
  phone: string
  email: string | null
  full_name: string | null
  lead_status: string
  lead_notes: string | null
  converted_user_id: string | null
}

export function LeadCallFlowPage({ leadId, vmTemplate }: { leadId: string, vmTemplate: string }) {
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        // Use admin API which relies on admin_session cookie set at login
        const res = await fetch('/api/admin/phone-leads', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch leads')
        const json = await res.json()
        const found = (json.phoneLeads || []).find((l: Lead) => l.id === leadId)
        if (!cancelled) setLead(found || null)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load lead')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [leadId])

  if (loading) {
    return <div className="min-h-screen bg-gray-950 text-gray-300 flex items-center justify-center">Loading…</div>
  }
  if (error || !lead) {
    return <div className="min-h-screen bg-gray-950 text-gray-300 flex items-center justify-center">Lead not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <LeadWorkflowFullscreen
        lead={lead as any}
        vmTemplate={vmTemplate}
        onClose={() => { router.push('/admin/dashboard'); router.refresh() }}
        onRefresh={() => { router.refresh() }}
        onAttachUser={() => {}}
        onOpenPayment={() => {}}
        renderInPortal={false}
      />
    </div>
  )
}

