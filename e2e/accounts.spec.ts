import { test, expect } from '@playwright/test';
import { logIn, newEmail, signUp } from './helpers';

test('sign up shows errors under empty and weak fields', async ({ page }) => {
  await page.goto('/signup');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('Please enter your name.')).toBeVisible();
  await expect(page.getByText('Please enter your email.')).toBeVisible();
  await expect(page.getByText('Password must be at least 8 characters.')).toBeVisible();
  await page.getByLabel('Password', { exact: true }).fill('onlyletters');
  await expect(page.getByText('Password must have a letter and a number.')).toBeVisible();
});

test('a new user signs up and lands on the dashboard', async ({ page }) => {
  await signUp(page);
  await expect(page.getByRole('button', { name: /My Invitations \(0\)/ })).toBeVisible();
});

test('the same email cannot create two accounts', async ({ page }) => {
  const user = await signUp(page);
  await page.getByRole('button', { name: 'Sign Out' }).click();
  await page.goto('/signup');
  await page.getByLabel('Name').fill('Someone Else');
  await page.getByLabel('Email').fill(user.email.toUpperCase());
  await page.getByLabel('Password', { exact: true }).fill('another123');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('An account with this email already exists')).toBeVisible();
});

test('wrong password shows a clear message and five tries pause login', async ({ page }) => {
  const user = await signUp(page, { email: newEmail('lock') });
  await page.getByRole('button', { name: 'Sign Out' }).click();
  for (let i = 0; i < 5; i++) {
    await logIn(page, user.email, `wrongpass${i}`);
    await expect(page.getByText('Wrong email or password')).toBeVisible();
  }
  await logIn(page, user.email, user.password);
  await expect(page.getByText('Too many wrong attempts. Try again in 3 minutes.')).toBeVisible();
});

test('keep me logged in survives closing the browser, unticked does not', async ({ page, browser }) => {
  const user = await signUp(page);
  const remembered = await browser.newContext({ storageState: await page.context().storageState() });
  const reopened = await remembered.newPage();
  await reopened.goto('/dashboard');
  await expect(reopened.getByText(`Welcome back, ${user.name}`)).toBeVisible();
  await remembered.close();

  await page.getByRole('button', { name: 'Sign Out' }).click();
  await logIn(page, user.email, user.password, false);
  await expect(page).toHaveURL(/\/dashboard/);
  const closed = await browser.newContext({ storageState: await page.context().storageState() });
  const fresh = await closed.newPage();
  await fresh.goto('/dashboard');
  await expect(fresh).toHaveURL(/\/login/);
  await closed.close();
});

test('the dashboard sends logged-out visitors to log in', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/);
});
