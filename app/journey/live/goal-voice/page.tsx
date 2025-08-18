'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useIntroSession } from '@/hooks/use-intro-session'

export default function LiveGoalVoicePage() {
  const router = useRouter()
  const params = useSearchParams()
  const sessionId = params.get('session')
  const { patch, markPresence } = useIntroSession(sessionId)

  // UI state
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [duration, setDuration] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null) // local preview
  const [signedPreviewUrl, setSignedPreviewUrl] = useState<string | null>(null) // signed preview URL
  const [storagePath, setStoragePath] = useState<string | null>(null) // storage object path

  // Recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const lastBlobRef = useRef<Blob | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const maxTimerRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Waveform refs
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const animationRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Reason: Draw simple live waveform during recording for user feedback
  const drawWave = () => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    const dataArray = dataArrayRef.current
    if (!canvas || !analyser || !dataArray) return
    const ctx = canvas.getContext('2d')!
    const WIDTH = canvas.width
    const HEIGHT = canvas.height

    const render = () => {
      analyser.getByteTimeDomainData(dataArray)
      ctx.fillStyle = '#0b1220'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
      ctx.lineWidth = 2
      ctx.strokeStyle = '#3b82f6'
      ctx.beginPath()
      const sliceWidth = WIDTH / dataArray.length
      let x = 0
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * HEIGHT) / 2
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
        x += sliceWidth
      }
      ctx.lineTo(WIDTH, HEIGHT / 2)
      ctx.stroke()
      animationRef.current = requestAnimationFrame(render)
    }
    animationRef.current = requestAnimationFrame(render)
  }

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

  // Presence heartbeat as user
  useEffect(() => {
    if (!sessionId) return
    markPresence('user').catch(() => {})
    const t = setInterval(() => { markPresence('user').catch(() => {}) }, 15000)
    return () => clearInterval(t)
  }, [sessionId])

  // Reason: Clean up resources
  const cleanup = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    if (maxTimerRef.current) clearTimeout(maxTimerRef.current)
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    if (audioContextRef.current) {
      try { audioContextRef.current.close() } catch {}
    }
    animationRef.current = null
    maxTimerRef.current = null
    streamRef.current = null
    audioContextRef.current = null
    analyserRef.current = null
    dataArrayRef.current = null
  }

  const internalStart = async () => {
    setError(null)
    setUploadError(null)
    setRecorded(false)
    setServerUrl(null)
    setAudioUrl(null)
    setDuration(0)

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    streamRef.current = stream

    // Setup audio graph for waveform
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioContextRef.current = ctx
    const source = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 1024
    analyserRef.current = analyser
    const bufferLength = analyser.frequencyBinCount
    dataArrayRef.current = new Uint8Array(bufferLength)
    source.connect(analyser)

    drawWave()

    const recorder = new MediaRecorder(stream)
    chunksRef.current = []
    recorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data)
    recorder.onstop = () => {
      const type = recorder.mimeType || 'audio/webm'
      const blob = new Blob(chunksRef.current, { type })
      lastBlobRef.current = blob
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      const obj = URL.createObjectURL(blob)
      setAudioUrl(obj)
      if (blob.size > 0) setRecorded(true)
      setRecording(false)
      cleanup()
    }
    mediaRecorderRef.current = recorder
    recorder.start()
    setRecording(true)

    // Auto-stop at 20s to keep it concise
    maxTimerRef.current = window.setTimeout(() => stopRecording(), 20000) as unknown as number
  }

  const startRecording = async () => {
    try {
      // 3-2-1 countdown for a cleaner start
      setCountdown(3)
      for (let i = 2; i >= 0; i--) {
        await new Promise(r => setTimeout(r, 1000))
        setCountdown(i)
      }
      setCountdown(null)
      await internalStart()
      if (sessionId) patch({ is_recording: true }).catch(() => {})
    } catch (e: any) {
      setCountdown(null)
      setError(e?.message || 'Microphone access denied')
    }
  }

  const stopRecording = () => {
    const rec = mediaRecorderRef.current
    if (rec && rec.state !== 'inactive') {
      rec.stop()
    }
    if (sessionId) patch({ is_recording: false }).catch(() => {})
  }

  const upload = async () => {
    if (!lastBlobRef.current) return
    setIsUploading(true)
    setUploadError(null)
    try {
      const blob = lastBlobRef.current
      const file = new File([blob], `goal-note.${blob.type.includes('mp4') ? 'm4a' : 'webm'}`, { type: blob.type })
      const fd = new FormData()
      fd.append('audio', file)
      const res = await fetch('/api/upload/voice-note', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Upload failed')
      const signedUrl = json.signedUrl as string
      const path = json.path as string
      setSignedPreviewUrl(signedUrl)
      setStoragePath(path)
      try { sessionStorage.setItem('mdd_voice_note_url', signedUrl); sessionStorage.setItem('mdd_voice_note_path', path) } catch {}
      return path
    } catch (e: any) {
      setUploadError(e?.message || 'Upload failed')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const onNext = async () => {
    let finalPath = storagePath
    if (!finalPath) {
      const path = await upload()
      if (!path) return
      finalPath = path
    }
    if (sessionId && finalPath) {
      // Store storage object path in session for on-demand signed playback
      await patch({ voice_note_url: finalPath }).catch(() => {})
      await patch({ current_step: 'send-notifications' }).catch(() => {})
    }
    router.push('/journey/live/support-contacts')
  }

  const onRetake = () => {
    setRecorded(false)
    setServerUrl(null)
    setUploadError(null)
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
  }

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-white">Record Goal Sentence (Voice)</h1>
          <p className="text-gray-300">Have them speak the single daily goal in their own words. Aim for 5–20 seconds.</p>
        </div>

        <Card className="bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
          <div className="flex flex-col items-center justify-center min-h-[360px] p-6 text-center gap-4">
            {error && <div className="text-red-400 text-sm">{error}</div>}
            {uploadError && <div className="text-red-400 text-sm">{uploadError}</div>}

            {countdown !== null ? (
              <div className="text-6xl font-bold text-white">{countdown || 'Go'}</div>
            ) : (
              <>
                <canvas ref={canvasRef as any} width={520} height={120} className="w-full max-w-xl rounded bg-black/40 border border-gray-800" />

                <div className="flex items-center gap-3">
                  {!recording ? (
                    <Button onClick={startRecording} className="bg-blue-600 hover:bg-blue-700">Start</Button>
                  ) : (
                    <Button onClick={stopRecording} className="bg-red-600 hover:bg-red-700">Stop</Button>
                  )}
                  <span className="text-gray-400 text-sm">{recording ? `Recording… ${duration}s` : recorded ? 'Recorded!' : 'Not recorded'}</span>
                </div>

                {audioUrl && (
                  <audio controls src={audioUrl} className="w-full max-w-xl" />
                )}

                <div className="flex gap-3">
                  <Button variant="outline" className="border-gray-700" onClick={onRetake} disabled={!recorded || isUploading}>Retake</Button>
                  <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700" disabled={!recorded || isUploading}>
                    {isUploading ? 'Uploading…' : 'Next: Support Contacts'}
                  </Button>
                </div>

                <p className="text-xs text-gray-400">Tip: Hold the phone close and speak clearly. We’ll save this to share with their support circle.</p>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
