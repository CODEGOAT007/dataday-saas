'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Phone, CheckCircle, Clock, Users } from 'lucide-react'

// Formats a US phone number as (XXX) XXX-XXXX while the user types
// Reason: Improves trust and reduces input errors for TikTok traffic (mobile-first)
function formatUSPhone(input: string) {
  const digits = input.replace(/\D/g, '').slice(0, 10) // keep max 10 digits
  const part1 = digits.slice(0, 3)
  const part2 = digits.slice(3, 6)
  const part3 = digits.slice(6, 10)

  if (digits.length <= 3) return part1 ? `(${part1}` : ''
  if (digits.length <= 6) return `(${part1}) ${part2}`
  return `(${part1}) ${part2}-${part3}`
}

export default function LearnMorePage() {
  const [phone, setPhone] = useState('')
  const [rawPhone, setRawPhone] = useState('') // digits-only for submission
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Basic phone validation (US 10 digits)
    const cleanPhone = (rawPhone || phone.replace(/\D/g, ''))

    if (cleanPhone.length < 10) {
      setError('Please enter a valid phone number')
      setIsSubmitting(false)
      return
    }

    try {
      // Submit phone number via API
      const response = await fetch('/api/phone-leads/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: cleanPhone,
          source: 'tiktok_learn_more'
        })
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Something went wrong. Please try again.')
        setIsSubmitting(false)
        return
      }

      setIsSubmitted(true)
    } catch (err) {
      console.error('Submission error:', err)
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              Thanks!
            </h1>
            <p className="text-gray-300 text-lg">
              You'll receive a call shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              Secure Your 1-on-1 Planning Session.
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="tel"
                placeholder="Best phone number"
                value={phone}
                onChange={(e) => {
                  const formatted = formatUSPhone(e.target.value)
                  setPhone(formatted)
                  setRawPhone(formatted.replace(/\D/g, ''))
                }}
                className="h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                required
              />
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !phone.trim()}
              className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </Button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="text-sm">Personal 1-on-1 planning session.</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Clock className="h-5 w-5 text-blue-400" />
              <span className="text-sm">Get clarity on your next steps.</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle className="h-5 w-5 text-blue-400" />
              <span className="text-sm">100% free during Early Access promotion.</span>
            </div>
          </div>


        </CardContent>
      </Card>
    </div>
  )
}
