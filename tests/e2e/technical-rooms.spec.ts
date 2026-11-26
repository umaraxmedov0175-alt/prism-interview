import { test, expect, type Page } from '@playwright/test';

async function startLiveSession(page: Page, trackSlug: 'software-engineering' | 'system-design' | 'consulting') {
  await page.goto('/app/practice/new');
  await expect(page.getByRole('heading', { name: /new mock interview/i })).toBeVisible();

  await page.getByLabel('Track').selectOption(trackSlug);
  await page.getByRole('button', { name: /start interview room/i }).click();

  await expect(page).toHaveURL(/\/app\/practice\/.+\/check/);
  await expect(page.getByRole('heading', { name: /device check/i })).toBeVisible();

  await page.getByRole('button', { name: /enter interview room/i }).click();
  await expect(page).toHaveURL(/\/app\/practice\/.+\/live/);
}

test.describe('Phase 4 — Technical & Case Rooms', () => {
  test('software-engineering session opens CodingRoom in /live', async ({ page }) => {
    await startLiveSession(page, 'software-engineering');

    await expect(page.getByRole('region', { name: 'Coding workspace' })).toBeVisible();
    await expect(page.getByRole('tablist', { name: 'Coding problems' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /visible test cases/i })).toBeVisible();
  });

  test('system-design session opens WhiteboardRoom in /live', async ({ page }) => {
    await startLiveSession(page, 'system-design');

    await expect(page.getByRole('region', { name: 'System Design Whiteboard' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'System design phases' })).toBeVisible();
    await expect(page.getByLabel('System design drawing canvas')).toBeVisible();
  });

  test('consulting session opens CaseRoom in /live', async ({ page }) => {
    await startLiveSession(page, 'consulting');

    await expect(page.getByRole('region', { name: 'Case Interview Workspace' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Case Workspace' })).toBeVisible();
    await expect(page.getByRole('tablist', { name: 'Case selector' })).toBeVisible();
  });
});
