import { test, expect } from '@playwright/test';
import { isLive, shareLink, signUp } from './helpers';

test('a celebration message is published and opens for guests', async ({ page, browser }) => {
  await signUp(page);
  await page.goto('/messages');
  await page.getByRole('button', { name: /Graduation/ }).click();
  await page.getByRole('button', { name: 'Use this message' }).first().click();
  await page.locator('#msg-recipient_name').fill('Wanjiru');
  await page.locator('#msg-sender_name').fill('Amani');
  const font = await page.locator('#msg-font option', { hasText: 'Caveat' }).first().getAttribute('value');
  await page.locator('#msg-font').selectOption(font!);
  await page.getByRole('button', { name: 'Publish & Share' }).click();
  await expect(page.getByText('Your message is ready!')).toBeVisible();
  const link = await shareLink(page);

  const guestContext = await browser.newContext();
  const guest = await guestContext.newPage();
  await guest.goto(link);
  await expect(guest.getByText('Dear Wanjiru,')).toBeVisible();
  await guestContext.close();

  await page.goto('/dashboard');
  await page.getByRole('button', { name: /My Messages \(1\)/ }).click();
  await expect(page.getByRole('button', { name: /^Edit / }).first()).toBeVisible();
});

test('the contact form checks fields and sends', async ({ page }) => {
  test.skip(isLive, 'Skipped on the live site so it does not email the owner');
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByText('Please write your message.')).toBeVisible();
  await page.getByLabel('Your Name').fill('Achieng');
  await page.getByLabel('Email').fill('achieng@example.com');
  await page.getByLabel('Subject').fill('Hello');
  await page.getByLabel('Message').fill('Testing the contact form');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByText('Message sent!')).toBeVisible();
});
