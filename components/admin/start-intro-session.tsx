'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export function StartIntroSession({ userId }: { userId: string }) {
  const [phone, setPhone] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [link, setLink] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const startSession = async () => {
    const res = await fetch('/api/intro-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, initial_step: 'voice-message' })
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.error || 'Failed to start session')
    const id = json.session.id as string
    setSessionId(id)
    const url = `${process.env.NEXT_PUBLIC_APP_URL || ''}/journey/live/goal-voice?session=${encodeURIComponent(id)}`
    setLink(url)
  }

  const smsNow = async () => {
    if (!phone || !link) return
    setSending(true)
    try {
      const message = `Setup MyDataDay: ${link}`
      const res = await fetch('/api/admin/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phone, message })
      })
      if (!res.ok) throw new Error('SMS failed')
      alert('Link sent!')
    } catch (e: any) {
      alert(e?.message || 'SMS failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-4 space-y-3">
        <div className="flex gap-2 items-center">
          <Button onClick={startSession} className="bg-blue-600 hover:bg-blue-700">Start Intro Session</Button>
          {link && (
            <Button
              variant="outline"
              className="border-gray-600"
              onClick={() => { if (link) navigator.clipboard.writeText(`Setup MyDataDay: ${link}`) }}
            >Copy Link</Button>
          )}
        </div>
        {link && (
          <div className="space-y-2">
            <Input
              placeholder="(###) ###-####"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
            />
            <div className="flex gap-2">
              <Button onClick={smsNow} disabled={sending} className="bg-blue-600 hover:bg-blue-700">
                {sending ? 'Sending…' : 'Text Now'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

