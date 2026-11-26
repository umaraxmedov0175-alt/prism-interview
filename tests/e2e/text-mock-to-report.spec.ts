import { test, expect } from '@playwright/test';

test.describe('Phase 1 — Text Mock to Report & Drill', () => {
  test('user completes a text mock, views report, and runs a drill', async ({ page }) => {
    await page.goto('/app/practice/new');
    await expect(page.getByRole('heading', { name: /new mock interview/i })).toBeVisible();

    await page.getByRole('button', { name: /start interview room/i }).click();
    await expect(page).toHaveURL(/\/app\/practice\/.+\/check/);
    await expect(page.getByRole('heading', { name: /device check/i })).toBeVisible();
    await page.getByRole('button', { name: /enter interview room/i }).click();
    await expect(page).toHaveURL(/\/app\/practice\/.+\/live/);

    // Verify live captions & voice controls
    await expect(page.getByText('Live Captions')).toBeVisible();
    await expect(page.getByRole('button', { name: /start microphone/i })).toBeVisible();

    // Wait for initial AI interviewer greeting
    await expect(page.getByText('Interviewer').first()).toBeVisible();

    const answerBox = page.getByPlaceholder(/speak with the mic or type your answer here/i);
    await answerBox.fill(
      'I led the checkout database migration where I rewrote 12 slow queries, reducing p95 latency by 72 percent from 420ms to 115ms.'
    );
    await page.getByRole('button', { name: /send answer/i }).click();

    // Wait for AI follow-up / next question
    await expect(page.getByText('You').first()).toBeVisible();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'C:/Users/HP/.gemini/antigravity/brain/88ef9704-6e4f-495f-81e5-ae18984736f0/live-room-light.png',
    });

    // End interview -> Report
    await page.getByRole('button', { name: /end interview/i }).click();
    await expect(page).toHaveURL(/\/app\/reports\/.+/);
    await expect(page.getByRole('heading', { name: /interview feedback report/i })).toBeVisible();
    await expect(page.getByText(/rubric breakdown/i)).toBeVisible();

    await page.screenshot({
      path: 'C:/Users/HP/.gemini/antigravity/brain/88ef9704-6e4f-495f-81e5-ae18984736f0/report-light.png',
    });

    // Toggle dark mode on report
    await page.getByRole('button', { name: /switch to dark mode|toggle theme/i }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.screenshot({
      path: 'C:/Users/HP/.gemini/antigravity/brain/88ef9704-6e4f-495f-81e5-ae18984736f0/report-dark.png',
    });

    // Navigate to Drill from Top Fix
    await page.getByRole('link', { name: /retry with this fix/i }).first().click();
    await expect(page).toHaveURL(/\/app\/drills/);
    await page.getByPlaceholder(/write your improved answer/i).fill(
      'In Q3, I personally owned the Redis caching rollout across 4 microservices, cutting p99 latency by 65% and saving $1,200/month in DB compute.'
    );
    await page.getByRole('button', { name: /grade my attempt/i }).click();
    await expect(page.getByText(/drill result/i)).toBeVisible();
  });
});
