import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path, { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testDataPath = path.join(__dirname, './data.csv');

test('should load CSV file and display correct compound statistics and support filtering', async ({
  page,
}) => {
  await page.goto(process.env.VITE_BASE_URL || 'http://localhost:5173/');
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page
    .getByRole('button', { name: 'inbox Click or drag CSV file' })
    .click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(testDataPath);
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
