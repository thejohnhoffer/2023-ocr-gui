import { test, expect } from '@playwright/test';
import fs from 'fs';

const URL = `http://localhost:${PORT}/`;

const repo = 'read-and-chat-gui';
const user = process.env.GITHUB_USER ?? '';
const URL = `https://github.com/${user}/${repo}/releases`;
const PAGES = `https://${user}.github.io/${repo}`;
const TAG = 'v7.1.2';

const cleanup = async () => {
  fs.unlinkSync('.env');
}

const loadInstallPage = async ({ page }) => {
  const intervals = [ 2000 ];
  await expect(async () => {
    const response = await page.request.get(page.url());
    expect(response.status()).toBe(404);
  }).not.toPass({ intervals });
  await page.reload();
}

test('Create GitHub App Link', async ({ page }) => {
  const quiz_pass = 'root';
  await page.goto(`${URL}/releases`);
  await page.getByRole('link', {
    name: 'Draft a new release'
  }).click();
  await page.getByRole('button', {
    name: 'Choose a tag'
  }).click();
  await page.getByPlaceholder('Find or create a new tag').fill(TAG);
  await page.getByRole('menuitemradio', {
    name: `Create new tag: ${TAG} on publish`
  }).click();
  await page.getByLabel('Set as a pre-release').check();
  await page.getByRole('button', {
    name: 'Publish release'
  }).click();
  console.log('Waiting 20 seconds...')
  await new Promise(r => setTimeout(r, 20000));
  await page.goto(`${URL}/releases/tag/${TAG}`);
  await page.getByRole('link', { name: PAGES }).click();

  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: /create github app/i }).click();
  await page.getByRole('link', { name: 'GitHub App' }).click();
  await page.getByRole('button', { name: 'Copy' }).click();
  const instPage = await page.waitForEvent('popup');
  await loadInstallPage({ page: instPage });

  await instPage.getByPlaceholder('Describe this release').click();
  await instPage.getByPlaceholder('Describe this release').fill('');
  await instPage.getByPlaceholder('Describe this release').press('Meta+a');
  await instPage.getByRole('button', {
    name: 'Update release'
  }).click();
  await finalPage = await page.waitForEvent('popup');
  await finalPage.getByRole('link', {
    name: '/install .* on your account/i'
  }).click();
  await finalPage.getByLabel('Only select repositories').check();
  await finalPage.getByRole('button', {
    name: 'Select repositories'
  }).click();
  await finalPage.getByPlaceholder('Search for a repository').fill(repo);
  await finalPage.getByRole('menuitem', { name: `/${user}.${repo}/i` }).click();
  await finalPage.getByRole('button', { name: 'Install' }).click();
  await page.getByLabel('Password:').fill('123');
  await page.getByRole('button', { name: 'Sign up' }).click();
  const bestPage = await page.waitForEvent('popup');
  await page.getByRole('link', { name: '/login/i' }).click();

  // Cleanup
  await cleanup();
});
