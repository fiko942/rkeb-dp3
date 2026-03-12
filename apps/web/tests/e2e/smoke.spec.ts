import { expect, test } from '@playwright/test';

test('dashboard smoke test', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Alumni Tracking Operations Dashboard')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Alumni' })).toBeVisible();
});
