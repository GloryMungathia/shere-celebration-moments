import { expect, type Page } from '@playwright/test';

export const isLive = !!process.env.E2E_BASE_URL;

export function newEmail(tag = 'guest') {
  return `${tag}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;
}

export async function signUp(page: Page, { name = 'Amani Wanjiru', email = newEmail(), password = 'secret123' } = {}) {
  await page.goto('/signup');
  await page.getByLabel('Name').fill(name);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText(`Welcome back, ${name}`)).toBeVisible();
  return { name, email, password };
}

export async function logIn(page: Page, email: string, password: string, remember = true) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  const box = page.getByLabel('Keep me logged in for 30 days');
  if (remember) await box.check();
  else await box.uncheck();
  await page.getByRole('button', { name: 'Log In' }).click();
}

export async function openTemplate(page: Page, occasion: string, name: string) {
  await page.goto(`/templates/${occasion}`);
  const card = page.locator('div.group', { has: page.getByRole('heading', { name, exact: true }) });
  await card.getByRole('button', { name: 'Use this template' }).click();
  await expect(page.locator('#inv-title')).toBeVisible();
}

export async function shareLink(page: Page) {
  return page.locator('input[readonly]').first().inputValue();
}

export async function textColor(page: Page, text: string) {
  return page.getByRole('heading', { name: text }).first().evaluate((el) => getComputedStyle(el).color);
}
