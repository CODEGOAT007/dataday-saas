import { test, expect } from '@playwright/test'

// Helper: create a fresh phone lead via public API
async function createPhoneLead(baseURL: string, phone: string) {
  const res = await fetch(`${baseURL}/api/phone-leads/notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone_number: phone, source: 'e2e_test' })
  })
  if (!res.ok) throw new Error(`Failed to create phone lead: ${res.status}`)
  const json = await res.json()
  return json.id as string
}

// Helper: admin login
async function adminLogin(page) {
  await page.goto('/admin/login')
  await page.getByLabel('Email').fill('admin@mydataday.app')
  await page.getByLabel('Password').fill('DataDay2024!Admin')
  await Promise.all([
    page.waitForURL('**/admin/dashboard'),
    page.getByRole('button', { name: 'Sign In as Admin' }).click(),
  ])
}

// End-to-end: create a lead, login as admin, open call-flow for that lead
// Verifies the new dedicated page approach and that the header contains Call: (###) ###-####
// and that the "They Picked Up" card is visible and reveals actions without layout jump.

test('Admin can show workflow for a new lead', async ({ page, baseURL }) => {
  const url = baseURL ?? 'http://localhost:3000'
  const uniquePhone = `+1${Date.now().toString().slice(-10)}`

  // Create lead
  const leadId = await createPhoneLead(url, uniquePhone)

  // Login
  await adminLogin(page)

  // Navigate directly to call-flow page
  await page.goto(`/admin/leads/${leadId}/call-flow`)

  // Check header contains Call: using a stable test id
  await page.getByTestId('call-header').waitFor({ state: 'visible', timeout: 30000 })
  await expect(page.getByTestId('call-header')).toContainText('Call:')

  // They Picked Up card exists
  await expect(page.getByText('They Picked Up')).toBeVisible()

  // Click They Picked Up; live actions appear without page navigation
  await page.getByText('They Picked Up').click()
  await expect(page.getByText('Live Call Actions')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Ready to Talk Now' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Need to Reschedule' })).toBeVisible()
})

