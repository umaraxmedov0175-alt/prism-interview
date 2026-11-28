import { test, expect } from '@playwright/test';

test.describe('Phase 0 — Marketing & Dashboard', () => {
  test('landing page renders in light and dark mode with interactive HeroSandbox', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Practice the exact interview'
    );

    // Interactive HeroSandbox: switch track & test live telemetry reaction
    await page.getByRole('tab', { name: 'System Design' }).click();
    await expect(page.getByText('Detected')).toBeVisible();
    await page.getByLabel(/edit the answer below/i).fill('I would use Redis caching.');
    await expect(page.getByText('Missing', { exact: true })).toBeVisible();

    await page.screenshot({
      path: 'C:/Users/HP/.gemini/antigravity/brain/88ef9704-6e4f-495f-81e5-ae18984736f0/redesign-light.png',
    });

    const toggle = page.getByRole('button', { name: /switch to dark mode|toggle theme/i });
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.screenshot({
      path: 'C:/Users/HP/.gemini/antigravity/brain/88ef9704-6e4f-495f-81e5-ae18984736f0/redesign-dark.png',
    });

    expect(errors).toEqual([]);
  });

  test('/app dashboard and /auth/login render cleanly', async ({ page }) => {
    await page.goto('/app');
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: /sign in to prism: interview/i })).toBeVisible();
  });
});
