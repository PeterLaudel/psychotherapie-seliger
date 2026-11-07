import { test, expect } from "@playwright/test";

test("redirects the root path to the homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/home$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Privatpraxis für Psychotherapie in Leipzig",
    }),
  ).toBeVisible();
});

test("shows the contact form", async ({ page }) => {
  await page.goto("/home");

  await expect(
    page.getByRole("heading", { name: "Termin anfragen" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Absenden" })).toBeVisible();
});

test("links to impressum and datenschutz", async ({ page }) => {
  await page.goto("/home");

  await page.getByRole("link", { name: "Impressum" }).click();
  await expect(page).toHaveURL(/\/home\/impressum$/);
  await expect(page.getByRole("heading", { name: "Anschrift" })).toBeVisible();

  await page.goto("/home");
  await page.getByRole("link", { name: "Datenschutz" }).click();
  await expect(page).toHaveURL(/\/home\/datenschutz$/);
});
