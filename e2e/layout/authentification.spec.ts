import { expect, test } from '@playwright/test';
import { login } from '../helpers';

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
    await submit.click();

    await expect(email).toBeDisabled();
    await expect(pwd).toBeDisabled();
    await expect(submit).toBeDisabled();

    await modalWrapper.waitFor({ state: 'detached' });
  });

  test('can log out', async ({ page }) => {
    await login(page, 'user@test.com', '1234');
    const logoutButton = page.getByTestId('toggle-log-button');

    expect(logoutButton).toHaveText('Log out');

    await logoutButton.click();
    await expect(logoutButton).toHaveText('Log in');
  });
});
