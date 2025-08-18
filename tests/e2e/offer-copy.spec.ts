import { test, expect } from '@playwright/test'

// Copy-only checks that don't hit Stripe

test('pricing page shows intro copy when ?offer=intro3', async ({ page }) => {
  await page.goto('/pricing?offer=intro3')
  await expect(page.locator('text=Offer: $3 intro')).toBeVisible()
})

test('payment page shows intro copy when ?offer=intro3', async ({ page }) => {
  await page.goto('/journey/live/payment?offer=intro3')
  await expect(page.getByText('Start today for $3')).toBeVisible()
})

