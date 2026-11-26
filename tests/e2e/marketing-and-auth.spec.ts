import { test, expect } from '@playwright/test';

test.describe('Phase 0 — Marketing & Auth Guard', () => {
  test('landing page renders in light and dark mode with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Practice the exact interview'
    );
    await page.screenshot({
      path: 'C:/Users/HP/.gemini/antigravity/brain/88ef9704-6e4f-495f-81e5-ae18984736f0/landing-light.png',
      fullPage: false,
    });

    // Toggle dark mode
    const toggle = page.getByRole('button', { name: /switch to dark mode|toggle theme/i });
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.screenshot({
      path: 'C:/Users/HP/.gemini/antigravity/brain/88ef9704-6e4f-495f-81e5-ae18984736f0/landing-dark.png',
      fullPage: false,
    });

    expect(errors).toEqual([]);
  });

  test('/app redirects unauthenticated users to /auth/login', async ({ page }) => {
    await page.goto('/app');
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole('heading', { name: /sign in to prism: interview/i })).toBeVisible();
    await page.screenshot({
      path: 'C:/Users/HP/.gemini/antigravity/brain/88ef9704-6e4f-495f-81e5-ae18984736f0/login-light.png',
      fullPage: false,
    });
  });
});
