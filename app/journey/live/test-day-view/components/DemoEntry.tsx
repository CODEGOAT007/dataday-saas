'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function DemoEntry({ time, title }: { time: string; title: string }) {
  const [done, setDone] = useState(false)
  return (
    <div className="flex items-center justify-between bg-gray-800/60 border border-gray-700 rounded-md p-3">
      <div>
        <div className="text-gray-300 text-sm">{time}</div>
        <div className="text-gray-100 font-medium">{title}</div>
      </div>
      <Button className={done ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} onClick={() => setDone(true)}>
        {done ? 'Proof Uploaded ✓' : 'Upload Proof'}
      </Button>
    </div>
  )
}

