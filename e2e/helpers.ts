import { Page } from '@playwright/test';

export async function login(page: Page, emailaddress: string, password: string) {
  const loginButton = page.getByTestId('toggle-log-button');
  const email = page.getByLabel('Email :');
  const pwd = page.getByLabel('Password :');
  const submit = page.locator('button[type="submit"]');
  const modalWrapper = page.locator('.modal-wrapper');

  loginButton.click();

  await modalWrapper.waitFor({ state: 'attached' });

  await email.fill(emailaddress);
  await pwd.fill(password);
  await submit.click();

  await modalWrapper.waitFor({ state: 'detached' });
}
