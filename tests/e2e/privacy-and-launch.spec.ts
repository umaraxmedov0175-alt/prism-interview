import { test, expect } from '@playwright/test';

test.describe('Phase 5 — Privacy & Launch Polish', () => {
  test('cookie banner offers Reject and hides on click', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('region', { name: /cookie consent/i });
    await expect(banner).toBeVisible();
    await banner.getByRole('button', { name: /reject/i }).click();
    await expect(banner).toBeHidden();
  });

  test('settings page offers data export and delete all data', async ({ page }) => {
    await page.goto('/app/settings');
    await expect(page.getByRole('button', { name: /export my data/i })).toBeVisible();
    await page.getByRole('button', { name: /delete all sessions & data/i }).click();
    await expect(page.getByRole('status')).toContainText('deleted');
  });
});
