import { test, expect } from '@playwright/test'

test('home loads and lists products', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('button', { name: /nike airforce 1/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /basic majica/i })).toBeVisible()
})

test('filters: category and search', async ({ page }) => {
  await page.goto('/')

  const categorySelect = page.getByRole('combobox').nth(1)
  await categorySelect.selectOption('Cevlji')
  await expect(page.getByRole('button', { name: /nike airforce 1/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /basic majica/i })).toBeHidden()

  await categorySelect.selectOption('Majice')
  await expect(page.getByRole('button', { name: /basic majica/i })).toBeVisible()

  await categorySelect.selectOption('Vse kategorije')
  await page.getByRole('textbox').fill('AirForce')
  await expect(page.getByRole('button', { name: /nike airforce 1/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /basic majica/i })).toBeHidden()
})

test('cart empty state', async ({ page }) => {
  await page.goto('/cart')
  await expect(page.getByText(/prazna/i)).toBeVisible()
})

test('shoe sizes show EU numbers', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /airfor(se|ce) 1/i }).click()

  const modal = page.getByRole('heading', { name: /nike airforce 1/i }).locator('..')
  const sizeSelect = modal.locator('select').nth(0)
  await expect(sizeSelect).toBeVisible()

  const optionTexts = await sizeSelect.locator('option').allTextContents()
  expect(optionTexts).toContain('36')
  expect(optionTexts).toContain('46')
  expect(optionTexts).not.toContain('S')
})

test('add to cart, update quantity, remove item', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /airfor(se|ce) 1/i }).click()

  const modal = page.getByRole('heading', { name: /nike airforce 1/i }).locator('..')
  await modal.locator('select').nth(0).selectOption('42')
  await modal.locator('select').nth(1).selectOption('Bela')
  await modal.getByRole('button', { name: /dodaj/i }).click()
  await modal.getByRole('button', { name: /zapri/i }).click()

  await page.goto('/cart')
  await expect(page.getByText('Nike AirForce 1')).toBeVisible()

  await page.getByRole('button', { name: /pove.*aj/i }).click()
  const qtySpan = page.getByRole('button', { name: /pove.*aj/i }).locator('..').locator('span')
  await expect(qtySpan).toHaveText('2')

  await page.getByRole('button', { name: /odstrani/i }).click()
  await expect(page.getByText(/prazna/i)).toBeVisible()
})

test('checkout creates order', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /airfor(se|ce) 1/i }).click()
  const modal = page.locator('div.fixed.inset-0').first()
  await modal.locator('select').nth(0).selectOption('42')
  await modal.locator('select').nth(1).selectOption('Bela')
  await modal.getByRole('spinbutton').fill('2')
  await modal.getByRole('button', { name: /dodaj/i }).click()
  await expect(modal.getByRole('button', { name: /dodano/i })).toBeVisible()
  await modal.getByRole('button', { name: /zapri/i }).click()
  await expect(modal).toBeHidden()

  await page.goto('/cart')
  await expect(page.getByText('Nike AirForce 1')).toBeVisible()
  await page.getByRole('link', { name: /pla.*aj/i }).click()
  await expect(page.getByRole('heading', { name: /pla.*ilo uspe.*no/i })).toBeVisible()

  await page.goto('/orders')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByText(/Nike AirForce 1/i).first()).toBeVisible()
})
