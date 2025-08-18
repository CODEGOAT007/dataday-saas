"use client"

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from './button'
import { toast } from 'sonner'

// Reason: Global floating button for users to email the developer with a quick message
export function SupportButton() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const onSend = async () => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
        })
      })
      if (!res.ok) throw new Error('Failed to send')
      toast.success('Thanks for the feedback!')
      setMessage('')
      setOpen(false)
    } catch (e) {
      toast.error('Could not send feedback. Please try again later.')
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-[2000] inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-2 shadow-lg shadow-blue-600/30 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Feedback"
      >
        <Mail className="h-4 w-4" />
        <span className="text-sm font-medium">Feedback</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[2100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-950 p-4">
            <h3 className="text-white font-semibold mb-2">Send quick feedback</h3>
            <textarea
              className="w-full h-28 rounded-md bg-gray-900 text-white p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder=" describe suggested improvements or issue you're having..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="mt-3 flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onSend}>Send</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

