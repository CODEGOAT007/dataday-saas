'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function formatPhone(value: string): string {
  // Keep digits only
  const digits = value.replace(/[^0-9]/g, '').slice(0, 10)
  const len = digits.length
  if (len <= 3) return digits
  if (len <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`
}

export function ContactRow({ index, value, onChange, onRemove }: {
  index: number
  value: { name: string; phone: string }
  onChange: (next: { name: string; phone: string }) => void
  onRemove: () => void
}) {
  const [name, setName] = useState(value.name)
  const [phone, setPhone] = useState(value.phone)

  useEffect(() => { onChange({ name, phone }) }, [name, phone])

  return (
    <div className="flex gap-2 items-center">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={`Contact ${index + 1} Name`}
        className="bg-gray-800 border-gray-700 text-gray-100"
      />
      <Input
        value={phone}
        onChange={(e) => setPhone(formatPhone(e.target.value))}
        placeholder="(###) ###-####"
        className="bg-gray-800 border-gray-700 text-gray-100 w-40"
      />
      <Button variant="outline" className="border-gray-600 text-gray-200" onClick={onRemove}>Remove</Button>
    </div>
  )
}

