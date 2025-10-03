import { test, expect } from '@playwright/test';

test('homepage loads and shows title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Job Applications');
});

test('can navigate to capture page', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Add Application');
  await expect(page).toHaveURL(/.*capture/);
  await expect(page.locator('h1')).toContainText('Add Job Application');
});

test('can navigate to bookmarklet page', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Bookmarklet');
  await expect(page).toHaveURL(/.*bookmarklet/);
  await expect(page.locator('h1')).toContainText('Job Tracker Bookmarklet');
});

