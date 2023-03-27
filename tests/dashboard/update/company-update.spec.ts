import { test, expect } from '@playwright/test';

test('test that company details get updated', async ({ page }) => {

  await page.goto('http://app.localhost:3000/login');

  await page.getByPlaceholder('Email address').click();

  await page.getByPlaceholder('Email address').fill('wookiehunter999@gmail.com');

  await page.getByPlaceholder('Password').click();

  await page.getByPlaceholder('Password').fill('Punky12345');

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page).toHaveURL('http://app.localhost:3000/');

  await page.getByText('Setup your site').click();
  await expect(page).toHaveURL('http://app.localhost:3000/settings');

  await page.getByRole('link', { name: 'Company' }).click();
  await expect(page).toHaveURL('http://app.localhost:3000/settings/company');

  await page.getByPlaceholder('Company Name').click();

  await page.getByPlaceholder('Company Name').press('Home');

  await page.getByPlaceholder('Company Name').press('Shift+ArrowDown');

  await page.getByPlaceholder('Company Name').fill('Hipster Inc');

  await page.getByRole('textbox', { name: 'Company address' }).click();

  await page.getByRole('textbox', { name: 'Company address' }).press('Home');

  await page.getByRole('textbox', { name: 'Company address' }).press('Shift+ArrowDown');

  await page.getByRole('textbox', { name: 'Company address' }).fill('101 Tinpot Street');

  await page.getByPlaceholder('Company Address Line 2').click();

  await page.getByPlaceholder('Company Address Line 2').press('Home');

  await page.getByPlaceholder('Company Address Line 2').press('Shift+ArrowDown');

  await page.getByPlaceholder('Company Address Line 2').fill('Button Moon Grove');

  await page.getByPlaceholder('City').click();

  await page.getByPlaceholder('City').press('Home');

  await page.getByPlaceholder('City').press('Shift+ArrowDown');

  await page.getByPlaceholder('City').fill('Sydney');

  await page.getByPlaceholder('State').click();

  await page.getByPlaceholder('State').press('Home');

  await page.getByPlaceholder('State').press('Shift+ArrowDown');

  await page.getByPlaceholder('State').fill('Queensland');

  await page.getByPlaceholder('Zipcode').click();

  await page.getByPlaceholder('Zipcode').press('Home');

  await page.getByPlaceholder('Zipcode').press('Shift+ArrowDown');

  await page.getByPlaceholder('Zipcode').fill('123456');

  await page.getByRole('button', { name: 'Save Changes' }).click();

});