import { test, expect } from '@playwright/test'

const email = process.env.E2E_AUTH_EMAIL
const password = process.env.E2E_AUTH_PASSWORD

test.describe('auth', () => {
  test.skip(!email || !password, 'E2E_AUTH_EMAIL/E2E_AUTH_PASSWORD not set')

  test('login works', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /vstopi|prijav/i }).click()

    const dialog = page.getByRole('dialog')
    await dialog.getByRole('textbox', { name: /email address/i }).fill(email as string)
    await dialog.getByRole('textbox', { name: /^password$/i }).fill(password as string)
    await dialog.locator('button.cl-formButtonPrimary').click()

    const verificationHeading = page.getByRole('heading', { name: /check your email/i })
    const signedInGone = page.getByRole('button', { name: /vstopi|prijav/i })

    await expect
      .poll(async () => {
        if (await verificationHeading.isVisible()) return 'verification'
        if (await signedInGone.isHidden()) return 'signed-in'
        return 'pending'
      })
      .toMatch(/verification|signed-in/)
  })

  test('registration screen opens', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /vstopi|prijav/i }).click()

    const signUpTrigger = page.getByRole('button', { name: /sign up|create account|registr/i })
    if (await signUpTrigger.isVisible()) {
      await signUpTrigger.click()
    } else {
      await page.getByRole('link', { name: /sign up|create account|registr/i }).click()
    }

    await expect(page.getByRole('heading', { name: /create your account|sign up|registr/i })).toBeVisible()
  })
})
