import { expect, test, describe } from 'vitest'

// Minimal integration-style tests for /api/intro-sessions

describe('Intro Sessions API', () => {
  test('rejects GET without id', async () => {
    const res = await fetch('http://localhost:3000/api/intro-sessions')
    expect(res.status).toBe(400)
  })

  test('rejects PATCH without id', async () => {
    const res = await fetch('http://localhost:3000/api/intro-sessions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    expect([400, 401]).toContain(res.status)
  })
})

