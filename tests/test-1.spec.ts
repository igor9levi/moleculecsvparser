import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import path from 'path';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testDataPath = path.join(__dirname, './data.csv');

test('test', async ({ page }) => {
  await page.goto(process.env.VITE_BASE_URL || 'http://localhost:5173/');
  await page
    .getByRole('button', { name: 'inbox Click or drag CSV file' })
    .click();
  await page
    .getByRole('button', { name: 'inbox Click or drag CSV file' })
    .setInputFiles(testDataPath);
  await expect(page.locator('#root')).toContainText('Showing 1092 compounds');
  await expect(
    page
      .locator('div')
      .filter({ hasText: /^Unique Compounds1,092$/ })
      .nth(2)
  ).toBeVisible();
  await expect(
    page
      .locator('div')
      .filter({ hasText: /^Average Molecular Weight258\.72$/ })
      .nth(2)
  ).toBeVisible();
  await expect(
    page
      .locator('div')
      .filter({ hasText: /^Average Atoms per Compound43\.42$/ })
      .nth(2)
  ).toBeVisible();
  await expect(page.getByRole('list')).toContainText('Total 1092 items');
  await page.getByPlaceholder('Search data...').click();
  await page.getByPlaceholder('Search data...').fill('xyz-0076');
  await expect(page.locator('#root')).toContainText(
    'Showing 10 compounds (filtered from 1092 total)'
  );
  await expect(page.getByRole('list')).toContainText('Total 10 items');
});
