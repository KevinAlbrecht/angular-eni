import { expect, test } from '@playwright/test';

import { delayPromise, login } from '../helpers';

test.describe('user-card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('can log in', async ({ page }) => {
    const loginButton = page.getByTestId('toggle-log-button').first();
    const email = page.getByLabel('Email :');
    const pwd = page.getByLabel('Password :');
    const submit = page.locator('button[type="submit"]');
    const modalWrapper = page.locator('.modal-wrapper');

    loginButton.click();

    await modalWrapper.waitFor({ state: 'attached' });

    await email.fill('user@test.com');
    await pwd.fill('1234');

    await Promise.all([
      submit.click(),
      page.route('**/api/login', (route) => {
        setTimeout(() => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              token: 'user-fake-token',
              user: { username: 'John', isAdmin: false },
            }),
          });
        }, 1000);
      }),
    ]);

    await expect(email).toBeDisabled();
    await expect(pwd).toBeDisabled();
    await expect(submit).toBeDisabled();

    await Promise.all([
      page.waitForResponse('**/api/login'),
      page.route('**/api/board', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            board: { columns: [], tickets: [] },
          }),
        });
      }),
      page.waitForResponse('**/api/board'),
    ]);
    await modalWrapper.waitFor({ state: 'detached' });
  });

  test('can log out', async ({ page }) => {
    await login(page, 'user@test.com', '1234');
    const logoutButton = page.getByTestId('toggle-log-button');

    await expect(logoutButton).toHaveText('Log out');

    await Promise.all([
      logoutButton.click(),
      page.route('**/api/logout', (route) => {
        route.fulfill({
          status: 200,
        });
      }),
      page.waitForResponse('**/api/logout'),
    ]);

    await expect(logoutButton).toHaveText('Log in');
  });
});
