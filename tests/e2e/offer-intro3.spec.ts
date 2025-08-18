import { test, expect } from '@playwright/test'

// Assumes PLAYWRIGHT_BASE_URL points to deployed app in CI, else runs locally

test.describe('Offer intro3 flow', () => {
  test('pricing page shows offer copy when ?offer=intro3', async ({ page }) => {
    await page.goto('/pricing?offer=intro3')
    await expect(page.locator('text=$3 intro')).toBeVisible()
  })

  test('payment page uses intro copy and hits start-checkout endpoint', async ({ page }) => {
    await page.goto('/journey/live/payment?offer=intro3')
    await expect(page.getByText('Start today for $3')).toBeVisible()
    // Intercept the POST and assert endpoint
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('/api/subscriptions/start-checkout') && req.method() === 'POST'),
      page.getByRole('button', { name: /add card on file/i }).click(),
    ])
    const postData = request.postDataJSON() as any
    expect(postData.offer).toBe('intro3')
  })
})

