import { test, expect } from '@playwright/test';

test.describe('Phase 3 — Content, Story Bank, Progress, and Plan', () => {
  test('public SEO question page has schema.org FAQPage markup and Learn hub links to drill', async ({
    page,
  }) => {
    await page.goto('/questions/beh-1');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('disagreed with a teammate');
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toContain('FAQPage');

    await page.goto('/companies/linear');
    await expect(page.getByText('unverified', { exact: true })).toBeVisible();

    await page.goto('/learn/star-method');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('STAR Method');
  });

  test('Story Bank saves story and updates competency coverage grid', async ({ page }) => {
    await page.goto('/app/stories');
    await page.getByPlaceholder(/story title/i).fill('Checkout DB latency fix');
    await page.getByRole('button', { name: /save story/i }).click();
    await expect(page.getByText('Checkout DB latency fix')).toBeVisible();
    await expect(page.getByText('1 story').first()).toBeVisible();
  });
});
