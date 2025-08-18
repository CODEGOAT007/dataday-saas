'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ContactRow } from './components/ContactRow'

export default function LiveSupportContactsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<{ name: string; phone: string }[]>([
    { name: '', phone: '' }
  ])
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null)
  const [persisting, setPersisting] = useState(false)
  const [persistError, setPersistError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const url = sessionStorage.getItem('mdd_voice_note_url')
      setVoiceUrl(url)
    } catch {}
  }, [])

  const updateContact = (idx: number, next: { name: string; phone: string }) => {
    setContacts(prev => prev.map((c, i) => i === idx ? next : c))
  }
  const removeContact = (idx: number) => {
    setContacts(prev => prev.filter((_, i) => i !== idx))
  }
  const addContact = () => setContacts(prev => [...prev, { name: '', phone: '' }])

  const canContinue = contacts.length > 0 && contacts.every(c => c.name.trim() && c.phone.replace(/[^0-9]/g, '').length === 10)

  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 gap-6">
      <Card className="w-full max-w-xl bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center min-h-[320px] p-6 text-center gap-4">
          <CardTitle className="text-2xl">Enter Support Contact Info</CardTitle>
          <p className="text-gray-300">Add names and phone numbers for their Support Circle.</p>
          {voiceUrl && (
            <div className="w-full text-left text-sm text-gray-400 border border-gray-800 bg-black/30 rounded p-3">
              <div className="mb-1 font-medium text-gray-300">Recorded welcome voice note</div>
              <audio controls src={voiceUrl} className="w-full" />
            </div>
          )}

          <div className="w-full space-y-3 mt-4">
            {contacts.map((c, idx) => (
              <ContactRow
                key={idx}
                index={idx}
                value={c}
                onChange={(next) => updateContact(idx, next)}
                onRemove={() => removeContact(idx)}
              />
            ))}
            <div className="flex justify-between">
              <Button variant="outline" className="border-gray-600 text-gray-200" onClick={addContact}>Add Another</Button>
              <span className="text-sm text-gray-400">Require at least 1 valid contact</span>
            </div>
          </div>

          <div className="mt-4">
            {persistError && (
              <div className="text-sm text-red-400 mb-2">{persistError}</div>
            )}
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!canContinue || persisting}
              onClick={async () => {
                setPersistError(null)
                setPersisting(true)
                try {
                  // Optional: persist the voice URL as a daily log for the primary goal if available
                  const primaryGoalId = sessionStorage.getItem('mdd_primary_goal_id')
                  if (voiceUrl && primaryGoalId) {
                    const today = new Date().toISOString().split('T')[0]
                    const res = await fetch('/api/logs', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        goal_id: primaryGoalId,
                        log_date: today,
                        completed: true,
                        voice_url: voiceUrl
                      })
                    })
                    if (!res.ok) {
                      const j = await res.json().catch(() => ({}))
                      throw new Error(j?.error || 'Failed to save voice note to today\'s log')
                    }
                  }
                  router.push('/journey/live/test-day-view')
                } catch (e: any) {
                  setPersistError(e?.message || 'Failed to save')
                } finally {
                  setPersisting(false)
                }
              }}
            >
              {persisting ? 'Saving…' : 'Next: Test Day View'}
            </Button>
          </div>
        </div>
      </Card>
    </main>
  )
}

