import { Metadata } from 'next'
import { AdminAuthGuard } from '@/components/admin/admin-auth-guard'
import { LeadCallFlowPage } from '@/components/admin/lead-call-flow-page'

export const metadata: Metadata = {
  title: 'Lead Call Flow - MyDataday',
}

export default function CallFlowPage({ params, searchParams }: { params: { leadId: string }, searchParams: Record<string, string> }) {
  const vmTemplate = (typeof searchParams.vm === 'string' && searchParams.vm) || "Hey, it's Chris from DataDay. I saw you entered your number on the site. I'm giving you a quick call now and will try again shortly. You can also text me back here and we’ll get you set up. Talk soon."

  return (
    <AdminAuthGuard>
      <LeadCallFlowPage leadId={params.leadId} vmTemplate={vmTemplate} />
    </AdminAuthGuard>
  )
}

