import { expect, test } from '@playwright/test';
import { login } from '../helpers';

test.describe('Ticket creation/edition', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await login(page, 'user@test.com', '1234');
  });

  test('create ticket', async ({ page }) => {
    const ticketToCreateData = {
      title: 'title',
      description: 'description',
      type: 'bug',
      assignee: 'John',
    };

    const firstColumn = page.locator('[data-testid="column"]').first();
    const addTicketLink = firstColumn.locator('a', { hasText: 'Add ticket' });

    await addTicketLink.click();
    await expect(page).toHaveURL('ticket?columnId=1');

    const titleForm = page.locator('input[name="title"]');
    const descriptionForm = page.locator('textarea[name="description"]');
    const typeForm = page.locator('select[name="type"]');
    const assigneeForm = page.locator('input[name="assignee"]');
    const submitButton = page.locator('button[type="submit"]');
    const editButton = page.locator('button[type="button"]', { hasText: 'Edit' });

    await titleForm.fill(ticketToCreateData.title);
    await descriptionForm.fill(ticketToCreateData.description);
    await typeForm.selectOption(ticketToCreateData.type);
    await assigneeForm.fill(ticketToCreateData.assignee);
    await submitButton.click();

    await editButton.waitFor({
      state: 'attached',
    });

    expect(titleForm).not.toBeAttached();
    expect(descriptionForm).not.toBeAttached();
    expect(typeForm).not.toBeAttached();
    expect(assigneeForm).not.toBeAttached();
    expect(submitButton).not.toBeAttached();
    expect(page.locator('section>span', { hasText: ticketToCreateData.title })).toBeTruthy();
    expect(page.locator('section>span', { hasText: ticketToCreateData.description })).toBeTruthy();
    expect(page.locator('section>span', { hasText: ticketToCreateData.type })).toBeTruthy();
    expect(page.locator('section>span', { hasText: ticketToCreateData.assignee })).toBeTruthy();
    expect(editButton).toBeTruthy();
  });
});
