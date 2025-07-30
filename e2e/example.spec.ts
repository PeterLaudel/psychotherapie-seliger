import { test, expect } from '@playwright/test';


test('creates a patient', async ({ page }) => {
  await page.goto('/administration/patients');

  // Click the get started link.
  await page.getByRole('button', { name: 'Patienten anlegen' }).click();

  await expect(page.getByText('Patienten anlegen')).toBeVisible();

  await page.getByRole('textbox', { name: 'Vorname' }).first().fill('Max');
  await page.getByRole('textbox', { name: 'Nachname' }).first().fill('Mustermann');
  await page.getByRole('textbox', { name: 'E-Mail' }).first().fill('max.mustermann@example.com');
  await page.getByRole('textbox', { name: 'Geburtsdatum' }).first().fill('05.05.1990');
  await page.getByRole('textbox', { name: 'Straße' }).first().fill('Musterstraße 1');
  await page.getByRole('textbox', { name: 'PLZ' }).first().fill('12345');
  await page.getByRole('textbox', { name: 'Stadt' }).first().fill('Musterstadt');

  await page.getByRole('button', { name: 'Patient anlegen' }).click();

  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
