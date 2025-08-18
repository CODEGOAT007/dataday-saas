import { test, expect } from '@playwright/test'

// Reason: E2E test to validate duplicate email error handling in signup form
test.describe('Signup Form - Duplicate Email', () => {
  test('shows error when email is already registered', async ({ page }) => {
    // Navigate to signup page
    await page.goto('/auth/signup')
    
    // Wait for form to be visible
    await expect(page.locator('h1')).toContainText('Create Your Account')
    
    // Fill form with a known existing email (use a test email that should exist)
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com') // This should already exist in your test DB
    await page.fill('input[name="password"]', 'testpassword123')
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Wait for and check error message appears
    await expect(page.locator('.text-red-400')).toBeVisible()
    await expect(page.locator('.text-red-400')).toContainText(/already in use|already registered/i)
    
    // Check that success message is not shown
    await expect(page.locator('.text-green-400')).not.toBeVisible()
  })

  test('shows network error in console when duplicate email submitted', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Navigate and fill form
    await page.goto('/auth/signup')
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'testpassword123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for error to appear in UI
    await expect(page.locator('.text-red-400')).toBeVisible()
    
    // Check that error was logged to console
    await page.waitForTimeout(1000) // Give console time to log
    expect(consoleErrors.some(error => 
      error.includes('Signup error') || 
      error.includes('already') ||
      error.includes('registered')
    )).toBeTruthy()
  })

  test('form fields remain filled after error', async ({ page }) => {
    await page.goto('/auth/signup')
    
    const testName = 'Test User'
    const testEmail = 'test@example.com'
    const testPassword = 'testpassword123'
    
    // Fill form
    await page.fill('input[name="name"]', testName)
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Wait for error
    await expect(page.locator('.text-red-400')).toBeVisible()
    
    // Check fields are still filled (good UX)
    await expect(page.locator('input[name="name"]')).toHaveValue(testName)
    await expect(page.locator('input[name="email"]')).toHaveValue(testEmail)
    await expect(page.locator('input[name="password"]')).toHaveValue(testPassword)
  })

  test('can recover from duplicate email error by changing email', async ({ page }) => {
    await page.goto('/auth/signup')
    
    // First attempt with duplicate email
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'testpassword123')
    await page.click('button[type="submit"]')
    
    // Wait for error
    await expect(page.locator('.text-red-400')).toBeVisible()
    
    // Clear error by changing to unique email
    const uniqueEmail = `test-${Date.now()}@example.com`
    await page.fill('input[name="email"]', uniqueEmail)
    await page.click('button[type="submit"]')
    
    // Should either show success message or redirect (depending on email confirmation setup)
    // We'll check that the error is gone
    await page.waitForTimeout(2000)
    const errorVisible = await page.locator('.text-red-400').isVisible()
    
    if (errorVisible) {
      // If error is still visible, it should be a different error (not duplicate email)
      const errorText = await page.locator('.text-red-400').textContent()
      expect(errorText).not.toMatch(/already in use|already registered/i)
    }
  })
})
