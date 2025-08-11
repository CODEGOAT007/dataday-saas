'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Mic, Square, Play, Pause, RotateCcw, Upload } from 'lucide-react'
import { toast } from 'sonner'

interface VoiceRecorderProps {
  onRecordingComplete: (audioUrl: string) => void
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      // High-quality audio constraints
      const audioConstraints = {
        audio: {
          sampleRate: 44100,        // CD quality sample rate
          channelCount: 1,          // Mono for voice (smaller file size)
          sampleSize: 16,           // 16-bit depth
          echoCancellation: true,   // Remove echo
          noiseSuppression: true,   // Reduce background noise
          autoGainControl: true,    // Normalize volume levels
          volume: 1.0               // Maximum input volume
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints)

      // High-quality MediaRecorder options
      const options = {
        mimeType: 'audio/webm;codecs=opus', // High-quality Opus codec
        audioBitsPerSecond: 128000          // 128kbps for excellent voice quality
      }

      // Fallback for browsers that don't support Opus
      let mediaRecorder
      if (MediaRecorder.isTypeSupported(options.mimeType)) {
        mediaRecorder = new MediaRecorder(stream, options)
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
          audioBitsPerSecond: 128000
        })
      } else {
        // Final fallback
        mediaRecorder = new MediaRecorder(stream)
      }

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        // Use the actual MIME type from the recorder
        const mimeType = mediaRecorder.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast.error('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl(null)
    setDuration(0)
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const uploadRecording = async () => {
    if (!audioUrl) return

    setIsUploading(true)
    try {
      // Convert blob URL to actual blob
      const response = await fetch(audioUrl)
      const blob = await response.blob()
      
      // Create FormData for upload
      const formData = new FormData()
      formData.append('audio', blob, `voice-note-${Date.now()}.webm`)

      // TODO: Replace with actual upload endpoint
      const uploadResponse = await fetch('/api/upload/voice-note', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }

      const { url } = await uploadResponse.json()
      onRecordingComplete(url)
      toast.success('Voice note uploaded successfully!')

    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload voice note. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Recording Status */}
          <div className="text-center">
            {isRecording && (
              <div className="flex items-center justify-center gap-2 text-red-500">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="font-medium">Recording... {formatTime(duration)}</span>
              </div>
            )}
            {audioUrl && !isRecording && (
              <div className="text-green-500 font-medium">
                Recording complete ({formatTime(duration)})
              </div>
            )}
            {!audioUrl && !isRecording && (
              <div className="text-gray-400">
                Ready to record your voice message
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center">
            {!isRecording && !audioUrl && (
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-red-600 hover:bg-red-700 rounded-full w-16 h-16"
              >
                <Mic className="w-6 h-6" />
              </Button>
            )}

            {isRecording && (
              <Button
                onClick={stopRecording}
                size="lg"
                className="bg-gray-600 hover:bg-gray-700 rounded-full w-16 h-16"
              >
                <Square className="w-6 h-6" />
              </Button>
            )}
          </div>

          {/* Playback Controls */}
          {audioUrl && (
            <div className="space-y-4">
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              />

              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={isPlaying ? pauseAudio : playAudio}
                  variant="outline"
                  size="sm"
                  className="border-gray-600"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <Button
                  onClick={resetRecording}
                  variant="outline"
                  size="sm"
                  className="border-gray-600"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>

                <Button
                  onClick={uploadRecording}
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Use This Recording
                    </>
                  )}
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatTime(Math.floor(currentTime))}</span>
                <span>{formatTime(Math.floor(duration))}</span>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-center text-sm text-gray-400 space-y-2">
            <p>💡 <strong>Tip:</strong> Keep it personal and heartfelt</p>
            <p>Aim for 30-60 seconds explaining why this goal matters to you</p>
            <div className="mt-3 p-2 bg-blue-900/20 border border-blue-700 rounded text-xs">
              <p className="text-blue-300">
                🎙️ <strong>High-Quality Recording:</strong> 44.1kHz, noise reduction enabled
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
