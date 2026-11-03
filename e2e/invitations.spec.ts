import { test, expect } from '@playwright/test';
import { openTemplate, shareLink, signUp, textColor } from './helpers';

const OCCASIONS = ['wedding', 'birthday', 'graduation', 'anniversary', 'engagement', 'baby-shower', 'other'];

test('the home page has no sparkle badge', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Create beautiful invitations/ })).toBeVisible();
  await expect(page.getByText('Beautiful invitations in minutes')).toHaveCount(0);
});

test('every occasion has templates to choose from', async ({ page }) => {
  for (const occasion of OCCASIONS) {
    await page.goto(`/templates/${occasion}`);
    await expect(page.getByRole('button', { name: 'Use this template' }).first()).toBeVisible();
  }
});

test('a guest designs an invitation, signs up to save it and keeps their work', async ({ page }) => {
  await openTemplate(page, 'birthday', 'Balloon Party');
  await page.locator('#inv-title').fill("Amani's 25th");
  await page.locator('#inv-venue').fill('The Alchemist');
  await page.getByRole('button', { name: 'Primary color #0f766e' }).click();
  await expect.poll(() => textColor(page, "Amani's 25th")).toBe('rgb(15, 118, 110)');

  await page.getByRole('button', { name: 'Save Draft' }).click();
  await expect(page).toHaveURL(/\/login/);
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByLabel('Name').fill('Amani');
  await page.getByLabel('Email').fill(`amani-${Date.now()}@example.com`);
  await page.getByLabel('Password', { exact: true }).fill('secret123');
  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page.locator('#inv-title')).toHaveValue("Amani's 25th");
  await expect.poll(() => textColor(page, "Amani's 25th")).toBe('rgb(15, 118, 110)');
  await page.getByRole('button', { name: 'Save Draft' }).click();
  await expect(page.getByText('Draft saved. Find it in your dashboard.')).toBeVisible();
});

test('a card with a pattern, title font, two events and a signature publishes for guests', async ({ page, browser }) => {
  await signUp(page);
  await openTemplate(page, 'graduation', 'Crimson Ceremony');
  await page.locator('#inv-intro').fill('Graduation invite');
  await page.locator('#inv-title').fill('Graduation');
  await page.locator('#inv-name').fill('Dorcas Muturia');
  await page.locator('#inv-event_label').fill('Graduation Ceremony');
  await page.locator('#inv-event_date').fill('2026-11-13');
  await page.locator('#inv-event_time').fill('10:00');
  await page.locator('#inv-venue').fill('Taita Taveta University');
  await page.getByLabel('Add a second event').check();
  await page.locator('#inv-second_label').fill('Thanksgiving Party');
  await page.locator('#inv-second_date').fill('2026-11-22');
  await page.locator('#inv-second_venue').fill('AIC Milimani Nakuru');
  await page.locator('#inv-closing').fill('Thank you for being part of my story.');
  await page.locator('#inv-signature').fill('Dorcas Muturia');
  await page.getByRole('button', { name: /Leafy branches/ }).click();
  const font = await page.locator('#design-heading-font option', { hasText: 'Pinyon Script' }).first().getAttribute('value');
  await page.locator('#design-heading-font').selectOption(font!);
  await expect(page.getByTestId('pattern-botanical')).toBeVisible();

  await page.getByRole('button', { name: 'Publish & Share' }).click();
  await expect(page.getByText('Your invitation is ready!')).toBeVisible();
  const link = await shareLink(page);
  expect(link).toMatch(/\/invite\/[a-z0-9]{10}$/);

  const guestContext = await browser.newContext();
  const guest = await guestContext.newPage();
  await guest.goto(link);
  const card = guest.getByTestId('invitation-card');
  await expect(card.getByRole('heading', { name: 'Graduation' })).toBeVisible();
  await expect(card).toContainText('GRADUATION INVITE', { ignoreCase: true });
  await expect(card).toContainText('Taita Taveta University', { ignoreCase: true });
  await expect(card).toContainText('AIC Milimani Nakuru', { ignoreCase: true });
  await expect(card).toContainText('Friday, 13 November 2026');
  await expect(card).toContainText('10:00 AM');
  await expect(card).toContainText('Kind regards,');
  await expect(guest.getByTestId('pattern-botanical')).toBeVisible();
  const headingFont = await card.getByRole('heading', { name: 'Graduation' }).evaluate((el) => getComputedStyle(el).fontFamily);
  expect(headingFont).toContain('Pinyon Script');
  await guestContext.close();
});

test('editing a published invitation keeps the same link', async ({ page, browser }) => {
  await signUp(page);
  await openTemplate(page, 'wedding', 'Rose Garden');
  await page.locator('#inv-title').fill('Emma & James');
  await page.getByRole('button', { name: 'Publish & Share' }).click();
  const link = await shareLink(page);

  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Edit Emma & James' }).click();
  await page.locator('#inv-title').fill('Emma & James Wedding');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Changes saved. Your link shows the new version.')).toBeVisible();

  const guestContext = await browser.newContext();
  const guest = await guestContext.newPage();
  await guest.goto(link);
  await expect(guest.getByRole('heading', { name: 'Emma & James Wedding' })).toBeVisible();
  await guestContext.close();
});

test('a draft has no public page and another user cannot open it', async ({ page, browser }) => {
  await signUp(page);
  await openTemplate(page, 'other', 'Confetti Pop');
  await page.locator('#inv-title').fill('Secret Party');
  await page.getByRole('button', { name: 'Save Draft' }).click();
  await expect(page.getByText('Draft saved. Find it in your dashboard.')).toBeVisible();
  const editUrl = page.url();

  const otherContext = await browser.newContext();
  const other = await otherContext.newPage();
  await signUp(other, { name: 'Baraka' });
  await expect(other.getByText('Secret Party')).toHaveCount(0);
  await other.goto(editUrl);
  await expect(other.getByText('Invitation not found')).toBeVisible();
  await other.goto('/invite/notarealslug');
  await expect(other.getByRole('heading', { name: /not found|not yet published/i })).toBeVisible();
  await otherContext.close();
});

test('a published invitation fits a phone screen @phone', async ({ page }) => {
  await signUp(page);
  await openTemplate(page, 'graduation', 'Navy & Gold');
  await page.locator('#inv-title').fill('Graduation');
  await page.getByRole('button', { name: 'Publish & Share' }).click();
  const link = await shareLink(page);
  await page.goto(link);
  await expect(page.getByTestId('invitation-card')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
