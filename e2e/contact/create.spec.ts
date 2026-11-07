import { test, expect } from "@playwright/test";

test("shows validation errors for an empty contact request", async ({
  page,
}) => {
  await page.goto("/home");

  await page.getByRole("button", { name: "Absenden" }).click();

  await expect(page.getByText("Formular unvollständig")).toBeVisible();
  await expect(
    page.getByText("Bitte geben Sie Ihren Namen ein."),
  ).toBeVisible();
});

test("sends a contact request and shows a confirmation", async ({ page }) => {
  // The contact endpoint is an external service, so the request is stubbed
  await page.route("**/*action=contactRequest*", (route) =>
    route.fulfill({ status: 200, body: "{}" }),
  );
  await page.goto("/home");

  await page.getByRole("textbox", { name: "Vorname" }).fill("Anna");
  await page.getByRole("textbox", { name: "Nachname" }).fill("Muster");
  await page.getByRole("textbox", { name: "Email" }).fill("anna@example.com");
  await page.getByRole("textbox", { name: "Nachricht" }).fill("Montags ab 16 Uhr");
  await page.getByRole("combobox", { name: "Bezahlung" }).selectOption("selbstzahler");
  await page.getByRole("button", { name: "Absenden" }).click();

  await expect(
    page.getByText("Vielen Dank für Ihre Anfrage."),
  ).toBeVisible();
});
