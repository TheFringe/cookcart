import { test, expect } from '@playwright/test';

test('visar inloggningssidan när användaren inte är inloggad', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('login-page')).toBeVisible();
});
