import { test, expect } from '@playwright/test'

test('base home page exists', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('http://localhost:3000')
    // The new page should contain an h1 with "About Page"
  await expect(page.locator('h1')).toContainText('Welcome')
//   await expect(page.locator('p')).toContainText('You have reached our backend!')
})
