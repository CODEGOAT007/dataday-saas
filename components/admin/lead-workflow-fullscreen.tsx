'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { X, Phone, MessageSquare, Clock, AlertTriangle, ChevronLeft, ChevronRight, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { LeadWorkspaceLead } from './lead-workspace'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'


interface Props {
  lead: LeadWorkspaceLead
  vmTemplate: string
  onClose: () => void
  onRefresh: () => void
  onAttachUser: () => void
  onOpenPayment: (url: string) => void
  renderInPortal?: boolean // Reason: Allow using this as a page (no portal) or as an overlay
}

type WorkflowStep = 'main' | 'no-response' | 'bad-number' | 'talk-later' | 'talk-now' | 'install-pwa'

export function LeadWorkflowFullscreen({ lead, vmTemplate, onClose: onCloseAction, onRefresh: onRefreshAction, onAttachUser: onAttachUserAction, onOpenPayment: onOpenPaymentAction, renderInPortal = true }: Props) {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('main')
  const [loading, setLoading] = useState(false)
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)
  const [showLiveDetails, setShowLiveDetails] = useState(false) // Reason: Keep prompt anchored; reveal details alongside
  const [showNoResponsePanel, setShowNoResponsePanel] = useState(false) // Reason: Mirror Connected behavior for No Response without full-screen switch
  const [editingLivePrompt, setEditingLivePrompt] = useState(false) // Reason: Toggle inline edit of the connected prompt
  const [livePrompt, setLivePrompt] = useState<string>(`Hey, it's Chris from the livestream. I got your request for a 1-on-1 call, who am I speaking with?

I'm glad you see the potential value of seomthing like this.. I'm super super excited what we're doing. let me start by just getting at least a quick overview/ or understanding of where you're at.`)


	  // Reason: Live notes only (no live transcription at this stage)
	  const [liveNotes, setLiveNotes] = useState<string>("")
	  // Reason: Daily goal design fields derived from conversation
		  const [finalGoal, setFinalGoal] = useState<string>("")
	  const [guidanceText, setGuidanceText] = useState<string>(
	    `Use life story to set actionable daily goal with them.

1) Ask: What are the most important things to you right now?
2) Ask: What are the top ten improvements, changes, or growth you want to see? (List them)
3) Choose ONE: Explain the behavioral science behind choosing one thing and allocating daily time.
4) Convert into a daily, verifiable action (e.g., 10 minutes of X with proof).

=-===================== Explain choosing ONE thing for daily focus (behavioral science) and make it verifiable.`
	  )

  // Reason: Persist the edited live prompt per lead locally for stability across reloads
  // Reason: Reschedule dialog state
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [rescheduleAt, setRescheduleAt] = useState<string>("")
  const [rescheduleNote, setRescheduleNote] = useState<string>("")
  const [sendingInstallText, setSendingInstallText] = useState<boolean>(false) // Reason: Disable and show progress while sending SMS
  const [devForceSend, setDevForceSend] = useState<boolean>(false) // Reason: Dev-only toggle to actually send SMS via Twilio
  const [adminName, setAdminName] = useState<string>('Chris') // Reason: Personalize SMS: "Hey it's {admin}!"

  useEffect(() => {
    // Load global template from server instead of per-lead localStorage
    (async () => {
      try {
        const res = await fetch('/api/admin/call-template')
        if (res.ok) {
          const json = await res.json()
          if (json?.live_pickup) setLivePrompt(json.live_pickup)
        }
      } catch {}
    })()
  }, [lead.id])

  // Reason: Load admin session to personalize SMS with coach/admin name
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/auth/verify')
        if (!res.ok) return
        const data = await res.json()
        const full = data?.session?.full_name as string | undefined
        const email = data?.session?.email as string | undefined

        // Prefer stored display_name from admin preferences
        if (email) {
          try {
            const prefs = await fetch(`/api/admin/preferences?email=${encodeURIComponent(email)}`)
            if (prefs.ok) {
              const pj = await prefs.json()
              const dn = pj?.display_name as string | undefined
              if (dn && dn.trim()) {
                const first = dn.trim().split(' ')[0]
                if (first) { setAdminName(first); return }
              }
            }
          } catch {}
        }

        // Fallbacks: full_name then email local-part
        if (full && full.trim()) {
          const first = full.trim().split(' ')[0]
          if (first) { setAdminName(first); return }
        }
        if (email) {
          const base = email.split('@')[0] || 'Chris'
          const name = base.charAt(0).toUpperCase() + base.slice(1)
          setAdminName(name)
        }
      } catch {}
    })()
  }, [])

  // Reason: Breadcrumb scroller for long journeys
  type CrumbStep = WorkflowStep | 'live-details' | 'no-response-panel'
  interface Crumb { label: string; step: CrumbStep }
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ label: 'Initial Call', step: 'main' }])
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  // Reason: Auto-size the live prompt textarea so all text stays visible during edit
  const livePromptRef = useRef<HTMLTextAreaElement | null>(null)
  const autosizeLivePrompt = () => {
    const el = livePromptRef.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = el.scrollHeight + 'px'
  }

  useEffect(() => {
    if (editingLivePrompt) {
      // Defer to next frame so DOM has applied textarea value
      requestAnimationFrame(autosizeLivePrompt)
    }
  }, [editingLivePrompt])

  useEffect(() => {
    if (editingLivePrompt) autosizeLivePrompt()
  }, [livePrompt, editingLivePrompt])

  useEffect(() => {
    // Load saved crumbs per-lead so history survives refresh
    try {
      const raw = sessionStorage.getItem(`lead:${lead.id}:crumbs`)
      if (raw) {
        const parsed = JSON.parse(raw) as Crumb[]
        if (Array.isArray(parsed) && parsed.length) setCrumbs(parsed)
      }
    } catch {}
  }, [lead.id])


	  // Reason: Load/persist live notes per lead
	  useEffect(() => {
	    try {
	      const saved = localStorage.getItem(`lead:${lead.id}:liveNotes`)
	      if (saved && typeof saved === 'string') setLiveNotes(saved)
	      const savedGoal = localStorage.getItem(`lead:${lead.id}:finalGoal`)
	      if (savedGoal && typeof savedGoal === 'string') setFinalGoal(savedGoal)
	      const savedGuide = localStorage.getItem(`lead:${lead.id}:guidanceText`)
	      if (savedGuide && typeof savedGuide === 'string') setGuidanceText(savedGuide)
	    } catch {}
	  }, [lead.id])
	  useEffect(() => {
	    try {
	      localStorage.setItem(`lead:${lead.id}:liveNotes`, liveNotes)
		      localStorage.setItem(`lead:${lead.id}:finalGoal`, finalGoal)
		    } catch {}
	  }, [lead.id, liveNotes, finalGoal, guidanceText])


  useEffect(() => {
    // Persist crumbs per-lead
    try {
      sessionStorage.setItem(`lead:${lead.id}:crumbs`, JSON.stringify(crumbs))
    } catch {}
  }, [lead.id, crumbs])

  const scrollLeft = () => scrollerRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  const scrollRight = () => scrollerRef.current?.scrollBy({ left: 300, behavior: 'smooth' })

  const addCrumb = (label: string, step: CrumbStep) => {
    setCrumbs((prev) => {
      const last = prev[prev.length - 1]
      if (last && last.step === step && last.label === label) return prev
      return [...prev, { label, step }]
    })
  }

  const goToCrumb = (index: number) => {
    setCrumbs((prev) => prev.slice(0, index + 1))
    const target = crumbs[index]
    if (!target) return
    if (target.step === 'live-details') {
      setCurrentStep('main')
      setShowNoResponsePanel(false)
      setShowLiveDetails(true)
    } else if (target.step === 'no-response-panel') {
      setCurrentStep('main')
      setShowLiveDetails(false)
      setShowNoResponsePanel(true)
    } else {
      setShowLiveDetails(false)
      setShowNoResponsePanel(false)
      setCurrentStep(target.step)
    }
  }


  useEffect(() => {
    if (!renderInPortal) return
    // Reason: Render in a portal attached to body to escape any parent stacking context or padding
    const el = document.createElement('div')
    el.setAttribute('data-lead-workflow-portal', 'true')
    document.body.appendChild(el)
    setPortalEl(el)
    // Prevent body scroll and ignore safe-area padding for true fullscreen overlay
    const prevOverflow = document.body.style.overflow
    const prevPaddingTop = document.body.style.paddingTop
    document.body.style.overflow = 'hidden'
    document.body.style.paddingTop = '0px'
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingTop = prevPaddingTop
      document.body.removeChild(el)
    }
  }, [renderInPortal])

  // Reason: Prompt helper + power-user shortcuts
  const getPromptFor = (step: WorkflowStep): string => {
    switch (step) {
      case 'no-response':
        return "No answer? Hang up immediately. Then send the text + voicemail."
      case 'talk-later':
        return "Totally get it — what's a good time later today or tomorrow? It'll take 2 minutes to get you set up."
      case 'talk-now':
        return "Hey, it's Chris from Dataday. You just dropped your number — do you have 2 minutes now so I can get you set up?"
      case 'bad-number':
        return ''
      case 'install-pwa':
        return 'Install the Dataday app (PWA) to make this easy daily.'
      default:
        return "Hey, it's Chris from Dataday. You just dropped your number — do you have 2 minutes now so I can get you set up?"
    }
  }

  const prompter = getPromptFor(currentStep)

  // Reason: Format phone number as (###) ###-#### for clear calling header
  const formatPhone = (raw?: string) => {
    if (!raw) return ''
    const d = raw.replace(/\D/g, '')
    const digits = d.length === 11 && d.startsWith('1') ? d.slice(1) : d
    if (digits.length !== 10) return raw
    const area = digits.slice(0, 3)
    const mid = digits.slice(3, 6)
    const last = digits.slice(6)
    return `(${area}) ${mid}-${last}`
  }
  const formattedPhone = formatPhone(lead?.phone)


  async function copyCurrentPrompt() {
    try {
      await navigator.clipboard.writeText(prompter)
      toast.success('Prompt copied')
    } catch {
      // no-op
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore shortcuts while typing in inputs/textareas/contenteditable
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return
      }
      if (e.key === '1') setCurrentStep('no-response')
      if (e.key === '2') setCurrentStep('bad-number')
      // Keys for live paths are disabled to avoid jarring view changes while reading
      // if (e.key === '3') setCurrentStep('talk-later')
      // if (e.key === '4') setCurrentStep('talk-now')
      if (e.key.toLowerCase() === 'c') copyCurrentPrompt()
      if (e.key.toLowerCase() === 'd') window.open(`tel:${lead.phone}`, '_self')
      if (e.key === 'Escape') onCloseAction()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentStep])

  const liveCallScript = `Hey, it's Chris from the livestream. I got your request for a 1-on-1 call, who am I speaking with?

I'm glad you see the potential value of seomthing like this.. I'm super super excited what we're doing. let me start by just getting at least a quick overview/ or understanding of where you're at.`

  async function patchStatus(status: string, notes?: string) {
    const res = await fetch('/api/admin/phone-leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id, status, notes }),
    })
    if (!res.ok) throw new Error('Failed to update lead')
  }

  async function handleNoResponse() {
    try {
      setLoading(true)
      await navigator.clipboard.writeText(vmTemplate)
      toast.success('Text+VM script copied')
      await toast.promise(
        patchStatus('contacted', 'No response - Text + VM sent'),
        { loading: 'Marking contacted...', success: 'Marked: Reached Out', error: 'Failed to update lead' }
      )
      onRefreshAction()
      onCloseAction()
    } catch (e: any) {
      toast.error(e?.message || 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleBadNumber() {
    try {
      setLoading(true)
      await toast.promise(
        patchStatus('lost', 'Bad number or wrong person'),
        { loading: 'Marking as lost...', success: 'Marked: Lost (Bad Number)', error: 'Failed to update lead' }
      )
      onRefreshAction()
      onCloseAction()
    } catch (e: any) {
      toast.error(e?.message || 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleTalkLater() {
    try {
      setLoading(true)
      await toast.promise(
        patchStatus('rescheduled', 'Can talk later - follow up scheduled'),
        { loading: 'Marking rescheduled...', success: 'Marked: Rescheduled', error: 'Failed to update lead' }
      )
      onRefreshAction()
      onCloseAction()
    } catch (e: any) {
      toast.error(e?.message || 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleTalkNow() {
    try {
      setLoading(true)
      await toast.promise(
        patchStatus('connected_now', 'Live conversation in progress'),
        { loading: 'Marking connected...', success: 'Marked: Connected', error: 'Failed to update lead' }
      )
      onRefreshAction()
      onCloseAction()
    } catch (e: any) {
      toast.error(e?.message || 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  // Reschedule Dialog - Available globally
  const rescheduleDialog = showRescheduleDialog && (
    <Dialog open={showRescheduleDialog} onOpenChange={(o: boolean) => setShowRescheduleDialog(o)}>
      <DialogContent className="bg-gray-900 text-gray-100 border-gray-700">
        <DialogHeader>
          <DialogTitle>Reschedule / Interrupted</DialogTitle>
          <DialogDescription>Pick a time and add an optional note. This will mark the lead as Rescheduled.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <label className="text-sm">Follow-up time</label>
          <input
            type="datetime-local"
            value={rescheduleAt}
            onChange={(e) => setRescheduleAt(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm"
          />
          <label className="text-sm">Note (optional)</label>
          <textarea
            value={rescheduleNote}
            onChange={(e) => setRescheduleNote(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm min-h-[80px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowRescheduleDialog(false)} className="border-gray-700 text-gray-200">Cancel</Button>
          <Button
            onClick={async () => {
              try {
                const body: any = { id: lead.id, status: 'rescheduled', notes: rescheduleNote }
                if (rescheduleAt) body.next_follow_up = new Date(rescheduleAt).toISOString()
                await fetch('/api/admin/phone-leads', {
                  method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
                })
                toast.success('Rescheduled')
                setShowRescheduleDialog(false)
              } catch {
                toast.error('Failed to reschedule')
              }
            }}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Save Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  if (currentStep === 'main' || currentStep === 'install-pwa') {
    const content = (
      <div className="min-h-screen bg-[#0B1220] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="relative">
            {/* Breadcrumb Scroller - Top Left */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 min-w-0 max-w-[30vw]">
              <button onClick={scrollLeft} className="text-gray-400 hover:text-white shrink-0" aria-label="Scroll left">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div ref={scrollerRef} className="flex gap-1 overflow-x-auto no-scrollbar pr-1" style={{ scrollBehavior: 'smooth' }}>
                {crumbs.map((c, idx) => (
                  <button
                    key={`${c.label}-${idx}`}
                    onClick={() => goToCrumb(idx)}
                    className={`px-2 py-1 rounded text-xs whitespace-nowrap border ${idx === crumbs.length - 1 ? 'bg-gray-800 border-gray-700 text-white' : 'bg-transparent border-gray-700 text-gray-300 hover:text-white'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <button onClick={scrollRight} className="text-gray-400 hover:text-white shrink-0" aria-label="Scroll right">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Centered Call Header */}
            <div className="text-center">
              <h2 className="text-xl md:text-2xl text-white font-semibold tracking-wide" data-testid="call-header">
                <span className="text-gray-400 mr-2">Call:</span>
                <span className="text-blue-400">{formattedPhone}</span>
              </h2>
            </div>

            {/* Top Right Controls */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowRescheduleDialog(true)} className="border-gray-700 text-gray-200">
                Reschedule/Interrupted
              </Button>
              <button onClick={onCloseAction} className="text-gray-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        {/* Dim overlay to de-emphasize the non-active side */}
        {showLiveDetails && !showNoResponsePanel && (
          // If we're on Install PWA, the right (Gather) side should be dimmed; otherwise dim the left
          currentStep === 'install-pwa' ? (
            <div className="hidden sm:block pointer-events-none" style={{ position: 'absolute', top: '72px', bottom: 0, left: '50%', width: '50%', background: 'rgba(0,0,0,0.58)', zIndex: 40 }} />
          ) : (
            <div className="hidden sm:block pointer-events-none" style={{ position: 'absolute', top: '72px', bottom: 0, left: 0, width: '50%', background: 'rgba(0,0,0,0.58)', zIndex: 40 }} />
          )
        )}
        {showNoResponsePanel && (
          <div className="hidden sm:block pointer-events-none" style={{ position: 'absolute', top: '72px', bottom: 0, left: 0, width: '50%', background: 'rgba(0,0,0,0.58)', zIndex: 40 }} />
        )}
        {/* Full-height vertical divider for the whole page below the header */}
        <div className="hidden sm:block pointer-events-none" style={{ position: 'absolute', top: '72px', bottom: 0, left: '50%', width: '1px', transform: 'translateX(-50%)', backgroundColor: 'rgb(31 41 55)' }} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-stretch justify-start p-4">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row relative">
              {/* They Picked Up - Left Side (Green) */}
              {/* Vertical divider between columns */}
              <div className="hidden sm:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gray-800 pointer-events-none" />

              {!showNoResponsePanel && currentStep !== 'install-pwa' && (
                <div className="w-full sm:w-1/2 flex sm:justify-center justify-center px-4 sm:px-8 py-6">
                  <Card
                    className={`w-full max-w-md bg-gray-900 border-2 border-green-600 text-gray-100 hover:border-green-500 hover:bg-gray-800 transition cursor-pointer` }
                    onClick={() => { setShowNoResponsePanel(false); setShowLiveDetails(true); addCrumb('Connected', 'live-details') }}
                  >
                    <div className={`flex flex-col items-center justify-start p-4 text-center gap-2 relative`}>
                    <button
                      aria-label="Edit prompt"
                      onClick={(e) => { e.stopPropagation(); setEditingLivePrompt((v) => !v) }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <Phone className="w-6 h-6 text-green-400" />
                    <CardTitle className="text-base">They Picked Up!</CardTitle>
                    {editingLivePrompt ? (
                      <div className="w-full">
                        <textarea
                          value={livePrompt}
                          onChange={(e) => setLivePrompt(e.target.value)}
                          onKeyDown={(e) => {
                            // Reason: Ensure native text navigation (Ctrl+Arrow on Windows) is not intercepted
                            // Stop propagation so global shortcuts don't run while editing
                            e.stopPropagation()
                          }}
                          rows={1}
                          ref={livePromptRef}
                          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-gray-200 overflow-hidden resize-none"
                          onClick={(e) => e.stopPropagation()}
                          spellCheck={false}
                        />
                        <div className="mt-2 flex gap-2 justify-center">
                          <Button size="sm" onClick={async (e) => { e.stopPropagation(); try { await fetch('/api/admin/call-template', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ live_pickup: livePrompt }) }); toast.success('Updated global template'); } catch {}; setEditingLivePrompt(false) }} className="bg-green-600 hover:bg-green-700">Save</Button>
                          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setEditingLivePrompt(false) }} className="border-gray-700 text-gray-200">Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className={`text-xs sm:text-sm leading-snug whitespace-pre-wrap ${showLiveDetails ? 'text-white opacity-100 filter-none' : 'text-gray-300'}`}>
                        {livePrompt}
                      </div>
                    )}
                  </div>
                </Card>
                </div>
              )}

              {/* Install PWA - Left Side (Blue) */}
              {currentStep === 'install-pwa' && (
                <div className="w-full sm:w-1/2 flex sm:justify-center justify-center px-4 sm:px-8 py-6">
                  <Card
                    className="w-full max-w-md bg-gray-900 border-2 border-blue-600 text-gray-100 hover:border-blue-500 hover:bg-gray-800 transition cursor-pointer"
                    onClick={() => { addCrumb('Continue to Setup', 'talk-now'); setCurrentStep('talk-now') }}
                  >
                    <div className="flex flex-col items-center justify-start p-4 text-center gap-2">
                      <div className="w-6 h-6 text-blue-400 flex items-center justify-center">📱</div>
                      <CardTitle className="text-base">Setup the App (PWA)</CardTitle>

                      <div className="bg-gray-800 border border-gray-700 rounded p-3 mt-2 text-left text-xs text-gray-200 w-full">
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Ask them to open: mydataday.app</li>
                          <li>iPhone Safari: Share icon → Add to Home Screen</li>
                          <li>Android Chrome: Menu ⋮ → Add to Home screen</li>
                          <li>Desktop Chrome: Install icon in the address bar</li>
                        </ul>
                      </div>

                      <div className="mt-3 flex gap-2 w-full justify-center">
                        <Button
                          onClick={async (e) => {
                            e.stopPropagation()
                            if (sendingInstallText) return
                            const raw = lead?.phone || ''
                            if (!raw) { toast.error('No phone number on lead'); return }
                            // Reason: Normalize to E.164 for US numbers by default
                            const digits = (raw.match(/[0-9]/g) || []).join('')
                            const to = digits.length === 10 ? `+1${digits}` : (digits.length === 11 && digits.startsWith('1') ? `+${digits}` : (raw.startsWith('+') ? raw : ''))
                            if (!to) { toast.error('Invalid phone number'); return }
                            const installUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://mydataday.app'}/setup`
                            const message = `Hey it's ${adminName}! Here's the setup link for MyDataDay: ${installUrl}`
                            setSendingInstallText(true)
                            try {
                              const res = await fetch('/api/admin/sms', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ to, message, forceSend: process.env.NODE_ENV === 'development' ? devForceSend : undefined })
                              })
                              if (!res.ok) {
                                const txt = await res.text().catch(() => '')
                                throw new Error(txt || 'Failed to send')
                              }
                              toast.success('Text sent with install link')
                            } catch (err:any) {
                              toast.error(err?.message || 'Failed to send text')
                            } finally {
                              setSendingInstallText(false)
                            }
                          }}
                          disabled={sendingInstallText}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {sendingInstallText ? 'Sending…' : 'Text Setup Link'}
                        </Button>

                        {/* Dev-only toggle to allow real SMS in development */}
                        {process.env.NODE_ENV === 'development' && (
                          <label className="ml-2 inline-flex items-center gap-2 text-xs text-gray-400" onClick={(e)=> e.stopPropagation()}>
                            <input type="checkbox" checked={devForceSend} onChange={(e)=> setDevForceSend((e.target as HTMLInputElement).checked)} className="accent-blue-600" />
                            <span>Dev: Force real SMS (requires ALLOW_DEV_SMS=true)</span>
                          </label>
                        )}

                        <a href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://mydataday.app'}/journey/live/pwa-install`} target="_blank" rel="noreferrer" onClick={(e)=> e.stopPropagation()}>
                          <Button variant="outline" className="border-gray-700 text-gray-200">Open Install Page</Button>
                        </a>
                      </div>
                    </div>
                  </Card>
                </div>
              )}


              {/* Right Column: No Response card or actions; Gather User Story panel; keeps left card fixed */}
              {showLiveDetails ? (
                <div className="w-full sm:w-1/2 flex sm:justify-center justify-center px-4 sm:px-8 py-6">
                  <div
                    className="w-full max-w-3xl p-4 bg-green-900/20 border border-green-700 rounded cursor-pointer hover:bg-green-900/30 transition"
                    onClick={() => {
                      if (!finalGoal.trim()) { toast.error('Enter a daily goal before continuing'); return }
                      setShowNoResponsePanel(false)
                      setShowLiveDetails(true)
                      addCrumb('Install PWA', 'install-pwa')
                      setCurrentStep('install-pwa')
                    }}
                  >
                    <h3 className="text-green-400 font-semibold mb-3">Gather User Story, and Goals</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Right: Inputs */}
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-300">Live Notes (auto-saved)</label>
                          <textarea
                            value={liveNotes}
                            onChange={(e) => setLiveNotes(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Capture key info here..."
                            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-gray-100 min-h-[110px]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm text-gray-300">Chosen ONE Daily Goal</label>
                          <input
                            value={finalGoal}
                            onChange={(e) => setFinalGoal(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="e.g., 10 minutes writing; voice log proof"
                            className="w-full bg-gray-900 border border-green-700/60 rounded p-2 text-sm text-gray-100"
                          />
                            </div>
                        <div className="pt-2 text-xs text-gray-400">Click anywhere on this card to continue to Install PWA after you enter a goal.</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : showNoResponsePanel ? (
                <div className="w-full sm:w-1/2 flex sm:justify-center justify-center px-4 sm:px-8 py-6">
                  <div className="w-full max-w-md p-4 bg-red-900/20 border border-red-700 rounded">
                    <h3 className="text-red-400 font-semibold mb-3">No Response Actions</h3>
                    <div className="text-sm text-gray-200 mb-3">No Response? — Hang up!</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button onClick={handleNoResponse} disabled={loading} className="bg-blue-600 hover:bg-blue-700">Copy Text + VM & Mark Contacted</Button>
                      <Button onClick={() => { setCurrentStep('bad-number'); setShowNoResponsePanel(false) }} className="bg-red-600 hover:bg-red-700">Bad/Wrong Number</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full sm:w-1/2 flex sm:justify-center justify-center px-4 sm:px-8 py-6">
                  <Card
                    className="w-full max-w-md bg-gray-900 border-2 border-red-600 text-gray-100 hover:border-red-500 hover:bg-gray-800 transition cursor-pointer"
                    onClick={() => { setShowLiveDetails(false); setShowNoResponsePanel(true); addCrumb('No Response', 'no-response-panel') }}
                  >
                    <div className="flex flex-col items-center justify-center min-h-[110px] p-4 text-center gap-2">
                      <MessageSquare className="w-6 h-6 text-red-400" />
                      <div>
                        <CardTitle className="text-base text-gray-100">They didn't pick up?</CardTitle>
                        <div className="italic text-gray-400 text-sm mt-1">(Hang up Now!)</div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}


            </div>


          </div>
        </div>
      </div>
    )
    return renderInPortal ? (portalEl ? createPortal(content, portalEl) : null) : content
  }

  // No Response Screen
  if (currentStep === 'no-response') {
    const content = (
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[1000] bg-[#0B1220] flex flex-col" style={{ width: '100vw', height: '100vh' }}>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-b border-gray-800">
          <Button size="sm" variant="outline" onClick={() => setShowRescheduleDialog(true)} className="border-gray-700 text-gray-200">
            Reschedule/Interrupted
          </Button>
          <Button variant="ghost" onClick={() => setCurrentStep('main')} className="text-gray-300 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Card className="w-full max-w-2xl bg-gray-900 border-gray-800 text-gray-100">
            <div className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-2xl mb-4">Send Text + Voicemail</CardTitle>
              <p className="text-gray-300 mb-6">Copy the script below and send as text + voicemail</p>

              <div className="bg-gray-800 border border-gray-700 rounded p-4 mb-6 text-left">
                <pre className="whitespace-pre-wrap text-sm text-gray-200">{vmTemplate}</pre>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => setCurrentStep('main')} className="border-gray-700 text-gray-200">
                  Back
                </Button>
                <Button onClick={handleNoResponse} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  Copy Script & Mark Contacted
                </Button>
                <Button variant="ghost" onClick={() => { setCurrentStep('bad-number'); addCrumb('Bad/Wrong', 'bad-number') }} className="text-red-400 hover:text-red-300">
                  Bad/Wrong Number
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
    return renderInPortal ? (portalEl ? createPortal(content, portalEl) : null) : content
  }

  // Bad Number Screen
  if (currentStep === 'bad-number') {
    const content = (
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[1000] bg-[#0B1220] flex flex-col" style={{ width: '100vw', height: '100vh' }}>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-b border-gray-800">
          <Button size="sm" variant="outline" onClick={() => setShowRescheduleDialog(true)} className="border-gray-700 text-gray-200">
            Reschedule/Interrupted
          </Button>
          <Button variant="ghost" onClick={() => setCurrentStep('main')} className="text-gray-300 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Card className="w-full max-w-2xl bg-red-900/20 border-red-800 text-gray-100">
            <div className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <CardTitle className="text-2xl mb-4 text-red-400">Close Lead</CardTitle>
              <p className="text-gray-300 mb-6">This number is disconnected, wrong, or belongs to someone else. Mark this lead as lost.</p>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => setCurrentStep('main')} className="border-gray-700 text-gray-200">
                  Back
                </Button>
                <Button onClick={handleBadNumber} disabled={loading} className="bg-red-600 hover:bg-red-700">
                  Mark as Lost
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
    return renderInPortal ? (portalEl ? createPortal(content, portalEl) : null) : content
  }

  // Talk Later Screen
  if (currentStep === 'talk-later') {
    const content = (
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[1000] bg-[#0B1220] flex flex-col" style={{ width: '100vw', height: '100vh' }}>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-b border-gray-800">
          <Button size="sm" variant="outline" onClick={() => setShowRescheduleDialog(true)} className="border-gray-700 text-gray-200">
            Reschedule/Interrupted
          </Button>
          <Button variant="ghost" onClick={() => setCurrentStep('main')} className="text-gray-300 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Card className="w-full max-w-2xl bg-yellow-900/20 border-yellow-800 text-gray-100">
            <div className="p-8 text-center">
              <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-2xl mb-4 text-yellow-400">Schedule Follow-Up</CardTitle>
              <p className="text-gray-300 mb-6">They answered but can't talk right now. Schedule a follow-up call and mark as rescheduled.</p>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => setCurrentStep('main')} className="border-gray-700 text-gray-200">
                  Back
                </Button>
                <Button onClick={handleTalkLater} disabled={loading} className="bg-yellow-600 hover:bg-yellow-700">
                  Mark as Rescheduled
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
    return renderInPortal ? (portalEl ? createPortal(content, portalEl) : null) : content
  }

  // Talk Now Screen
  if (currentStep === 'talk-now') {
    const content = (
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[1000] bg-[#0B1220] flex flex-col" style={{ width: '100vw', height: '100vh' }}>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-b border-gray-800">
          <Button size="sm" variant="outline" onClick={() => setShowRescheduleDialog(true)} className="border-gray-700 text-gray-200">
            Reschedule/Interrupted
          </Button>
          <Button variant="ghost" onClick={() => setCurrentStep('main')} className="text-gray-300 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Card className="w-full max-w-2xl bg-green-900/20 border-green-800 text-gray-100">
            <div className="p-8 text-center">
              <Phone className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <CardTitle className="text-2xl mb-4 text-green-400">Start Conversation</CardTitle>
              <p className="text-gray-300 mb-6">They're ready to talk! Use the script below to start the conversation.</p>

              <div className="bg-gray-800 border border-gray-700 rounded p-4 mb-6 text-left">
                <pre className="whitespace-pre-wrap text-sm text-gray-200">{livePrompt || liveCallScript}</pre>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => setCurrentStep('main')} className="border-gray-700 text-gray-200">
                  Back
                </Button>
                <Button onClick={handleTalkNow} disabled={loading} className="bg-green-600 hover:bg-green-700">
                  Mark as Connected
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
    return (
      <>
        {rescheduleDialog}
        {renderInPortal ? (portalEl ? createPortal(content, portalEl) : null) : content}
      </>
    )
  }


  // This should never be reached since we handle all cases above
  return (
    <>
      {rescheduleDialog}
      {null}
    </>
  )
}
