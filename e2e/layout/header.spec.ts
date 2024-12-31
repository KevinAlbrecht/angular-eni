import { expect, test } from '@playwright/test';

import { login } from '../helpers';

test.describe('user-card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navigation links and login button are present', async ({ page }) => {
    const homeLink = page.locator('a', { hasText: 'Board' });
    const adminLink = page.locator('a', { hasText: 'Admin' });
    const loginButton = page.locator('button', { hasText: 'Log in' });

    await expect(homeLink).toHaveAttribute('href', '/');
    expect(adminLink).toBeTruthy();
    expect(loginButton).toBeTruthy();
  });

  test('cannot navigate to admin page as user', async ({ page }) => {
    await login(page, 'user@test.com', '1234');
    const adminLink = page.locator('a', { hasText: 'Admin' });

    await expect(adminLink).not.toHaveAttribute('href');

    await adminLink.click();
    await expect(page).not.toHaveURL(/admin/);
  });

  test('can navigate to admin page as admin', async ({ page }) => {
    await login(page, 'admin@test.com', '1234', true);
    const adminLink = page.locator('a', { hasText: 'Admin' });

    await expect(adminLink).toHaveAttribute('href', '/admin');

    await adminLink.click();
    await expect(page).toHaveURL(/admin/);
  });
});
