import { Page } from '@playwright/test';

import { getBoardWithMultipleColumns } from './board';

export async function login(page: Page, emailaddress: string, password: string, isAdmin = false) {
  const loginButton = page.getByTestId('toggle-log-button');
  const email = page.getByLabel('Email :');
  const pwd = page.getByLabel('Password :');
  const submit = page.locator('button[type="submit"]');
  const modalWrapper = page.locator('.modal-wrapper');

  loginButton.click();

  await modalWrapper.waitFor({ state: 'attached' });

  await email.fill(emailaddress);
  await pwd.fill(password);

  await Promise.all([
    submit.click(),
    page.route('**/api/login', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: isAdmin ? 'admin-fake-token' : 'user-fake-token',
          user: { username: 'John', isAdmin },
        }),
      });
    }),
    page.waitForResponse('**/api/login'),
    page.route('**/api/board', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          board: getBoardWithMultipleColumns(),
        }),
      });
    }),
    page.waitForResponse('**/api/board'),
  ]);

  await modalWrapper.waitFor({ state: 'detached' });
}

export function delayPromise(action: Promise<unknown>, ms: number): Promise<unknown> {
  return Promise.all([new Promise((resolve) => setTimeout(resolve, ms)), action]);
}
