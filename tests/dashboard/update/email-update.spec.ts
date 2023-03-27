import { test, expect } from '@playwright/test';

test('test that email gets updated', async ({ page }) => {

await page.goto('http://app.localhost:3000/login');

  await page.getByPlaceholder('Email address').click();

  await page.getByPlaceholder('Email address').fill('wookiehunter999@gmail.com');

  await page.getByPlaceholder('Password').click();

  await page.getByPlaceholder('Password').fill('Punky12345');

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page).toHaveURL('http://app.localhost:3000/');

  await page.getByText('Connect an email').click();
  await expect(page).toHaveURL('http://app.localhost:3000/settings/email');

  await page.getByPlaceholder('Enter your email address').click();

  await page.getByPlaceholder('Enter your email address').press('Home');

  await page.getByPlaceholder('Enter your email address').press('Shift+ArrowDown');

  await page.getByPlaceholder('Enter your email address').fill('bobbins@waverly.io');

  await page.getByPlaceholder('Enter your email password').click();

  await page.getByPlaceholder('Enter your email password').fill('testing');

  await page.getByRole('button', { name: 'Save Changes' }).click();

});