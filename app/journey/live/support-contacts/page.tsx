'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ContactRow } from './components/ContactRow'

export default function LiveSupportContactsPage() {
  const [contacts, setContacts] = useState<{ name: string; phone: string }[]>([
    { name: '', phone: '' }
  ])

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
            <Link href="/journey/live/test-day-view">
              <Button className="bg-blue-600 hover:bg-blue-700" disabled={!canContinue}>Next: Test Day View</Button>
            </Link>
          </div>
        </div>
      </Card>
    </main>
  )
}

