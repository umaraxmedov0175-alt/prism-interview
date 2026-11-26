import { test, expect } from '@playwright/test';

test.describe('Phase 0 — Marketing & Dashboard', () => {
  test('landing page renders in light and dark mode with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Practice the exact interview'
    );

    const toggle = page.getByRole('button', { name: /switch to dark mode|toggle theme/i });
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    expect(errors).toEqual([]);
  });

  test('/app dashboard and /auth/login render cleanly', async ({ page }) => {
    await page.goto('/app');
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: /sign in to prism: interview/i })).toBeVisible();
  });
});
