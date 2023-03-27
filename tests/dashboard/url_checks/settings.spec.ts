import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

test.describe("dashboard", () => {
    test.beforeEach(async ({ page }) =>{
        await page.goto(process.env.TEST_APP_BASE_URL, '/login');
        // The new page should contain an h2 with "Welcome back"
        await page.locator('#email').fill(process.env.TEST_USERNAME);
        await page.locator('#password').fill(process.env.TEST_PASSWORD);
        await page.locator('button', {  hasText: 'Submit' }).click();
    });

    test('dashboard page content', async ({ page }) => {
        await expect(page.locator('#welcome')).toContainText('Welcome Wookie Enterprises!');
    })

    test('navigate to settings page works', async ({ page }) => {
        const settings = page.getByText('Setup your site');
        await settings.click();
        await expect(page).toHaveURL(process.env.TEST_APP_BASE_URL, '/settings');
    })
})
