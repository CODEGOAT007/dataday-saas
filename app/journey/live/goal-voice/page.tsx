'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function LiveGoalVoicePage() {
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (recording) {
      const started = Date.now()
      timerRef.current = window.setInterval(() => setDuration(Math.floor((Date.now() - started) / 1000)), 250) as unknown as number
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [recording])

  const startRecording = async () => {
    try {
      setError(null)
      setRecorded(false)
      setDuration(0)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        // Reason: We keep it local for now; later we can upload to Supabase storage
        if (blob.size > 0) setRecorded(true)
      }
      mediaRecorderRef.current = recorder
      recorder.start()
      setRecording(true)
    } catch (e: any) {
      setError(e?.message || 'Microphone access denied')
    }
  }

  const stopRecording = () => {
    const rec = mediaRecorderRef.current
    if (rec && rec.state !== 'inactive') {
      rec.stop()
      setRecording(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 gap-6">
      <Card className="w-full max-w-xl bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center min-h-[320px] p-6 text-center">
          <CardTitle className="text-2xl mb-4">Record Goal Sentence (Voice)</CardTitle>
          <p className="text-gray-300 mb-6">They speak the exact goal sentence you crafted together.</p>

          {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

          <div className="flex items-center gap-3 mb-4">
            {!recording ? (
              <Button onClick={startRecording} className="bg-blue-600 hover:bg-blue-700">Start Recording</Button>
            ) : (
              <Button onClick={stopRecording} className="bg-red-600 hover:bg-red-700">Stop Recording</Button>
            )}
            <span className="text-gray-400 text-sm">{recording ? `Recording… ${duration}s` : recorded ? 'Recorded!' : 'Not recorded'}</span>
          </div>

          <Link href="/journey/live/support-contacts">
            <Button className="bg-blue-600 hover:bg-blue-700" disabled={!recorded}>Next: Support Contacts</Button>
          </Link>
        </div>
      </Card>
    </main>
  )
}

