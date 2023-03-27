import { test, expect } from '@playwright/test';

test('test that domain info gets updated', async ({ page }) => {

  await page.goto('http://app.localhost:3000/login');

  await page.getByPlaceholder('Email address').click();

  await page.getByPlaceholder('Email address').fill('wookiehunter999@gmail.com');

  await page.getByPlaceholder('Password').click();

  await page.getByPlaceholder('Password').fill('Punky12345');

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page).toHaveURL('http://app.localhost:3000/');

  await page.getByText('Connect your domain').click();
  await expect(page).toHaveURL('http://app.localhost:3000/settings/domain');

  await page.getByPlaceholder('Enter project name').click();

  await page.getByPlaceholder('Enter project name').press('Home');

  await page.getByPlaceholder('Enter project name').press('Shift+ArrowDown');

  await page.getByPlaceholder('Enter project name').fill('hipster');

  await page.getByPlaceholder('Enter your domain').click();

  await page.getByPlaceholder('Enter your domain').press('Home');

  await page.getByPlaceholder('Enter your domain').press('Shift+ArrowDown');

  await page.getByPlaceholder('Enter your domain').fill('hipster.io');

  await page.getByRole('button', { name: 'Save Changes' }).click();

});