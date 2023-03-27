// This test covers user login, navigation to the Setup Your Site page, changing the name and description and then checking the subdomain is correct.

import { test, expect } from '@playwright/test';

test('dashboard - site name replacement', async ({ page }) => {

  await page.goto('http://app.localhost:3000/login');

  await page.getByPlaceholder('Email address').click();

  await page.getByPlaceholder('Email address').fill('wookiehunter999@gmail.com');

  await page.getByPlaceholder('Password').click();

  await page.getByPlaceholder('Password').fill('Punky12345');

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page).toHaveURL('http://app.localhost:3000/');

  await page.getByText('Setup your site').click();
  await expect(page).toHaveURL('http://app.localhost:3000/settings');

  await page.getByPlaceholder('Enter the name for your website').click();

  await page.getByPlaceholder('Enter the name for your website').fill('Hipster Publications');

  await page.getByPlaceholder('Enter the name for your website').press('Tab');

  await page.getByPlaceholder('Enter a description for your website').press('Shift+ArrowDown');

  await page.getByPlaceholder('Enter a description for your website').fill('Hipster - publications for everyone');

  await page.getByRole('button', { name: 'Save Changes' }).click();

  await page.goto('http://app.localhost:3000/settings');

  await page.goto('http://hipster.localhost:3000/');

  await page.getByRole('heading', { name: 'Hipster Publications' }).click();

  await page.getByText('© 2022 Hipster Publications. All rights reserved.').click();

});