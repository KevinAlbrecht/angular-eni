import { expect, test } from '@playwright/test';
import { login } from '../helpers';

test.describe('disconnected', () => {
  test('display login message', async ({ page }) => {
    await page.goto('/');
    const msg = page.locator('span', { hasText: 'Please log in' });
    expect(msg).toBeTruthy();
  });
});

test.describe('connected', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await login(page, 'user@test.com', '1234');
  });

  test('display column template', async ({ page }) => {
    await page.waitForSelector('[data-testid="column"]');
    const column = page.locator('[data-testid="column"]').first();

    await column.first().waitFor({ state: 'visible' });

    const title = column.locator('h4').first();
    const addTicketLink = column.locator('a', { hasText: 'Add ticket' });

    await expect(title).toHaveText('To Do');
    expect(addTicketLink).toBeTruthy();
  });

  test('display ticket correctly', async ({ page }) => {
    const ticket = page.locator('[data-testid="ticket"]').first();
    const title = ticket.locator('h4').first();
    const editLink = ticket.locator('a[href^="/ticket/"]');

    expect(title).toBeTruthy();
    expect(editLink).toBeTruthy();
  });

  test('can drag and drop', async ({ page }) => {
    const columns = page.locator('[data-testid="column"]');
    const sourceColumn = columns.nth(0);
    const targetColumn = columns.nth(2);
    const fromCard = sourceColumn.locator('[appDraggable]').nth(0);
    const toCard = targetColumn.locator('[appDraggable]').nth(0);
    const initialFromCardTitle = await fromCard.locator('h4').textContent();

    if (initialFromCardTitle === null) {
      throw new Error('Initial card title is null');
    }

    await fromCard.dragTo(toCard);

    expect(toCard.locator('h4')).toHaveText(initialFromCardTitle, { timeout: 1000 });
  });
});
