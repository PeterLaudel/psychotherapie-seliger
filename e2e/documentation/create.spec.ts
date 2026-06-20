import { patientFactory } from "factories/patient";
import { test, expect } from "../fixtures";

test("navigates to create page from the dashboard", async ({ page }) => {
  await page.goto("/administration/documentation");

  await page.getByRole("button", { name: "Sitzung dokumentieren" }).click();

  await expect(page).toHaveURL("/administration/documentation/create");
});

test("creates and finalizes a session from the patient page", async ({ page }) => {
  const patient = await patientFactory.create({ name: "Anna", surname: "Müller" });

  await page.goto(
    `/administration/documentation/create?patientId=${patient.id}`
  );

  // Wait for the draft to be created server-side
  await expect(page.getByRole("button", { name: "Abschließen" })).toBeVisible({
    timeout: 5000,
  });

  // Risk level is required to enable finalization
  await page.getByRole("button", { name: "Kein" }).click();

  await page.getByRole("textbox", { name: "Notizen (verschlüsselt)" }).fill("Erste Sitzung.");

  await page.getByRole("button", { name: "Abschließen" }).click();

  // Button is disabled once the session is finalized
  await expect(page.getByRole("button", { name: "Abschließen" })).toBeDisabled();
});

test("creates a session via patient selector", async ({ page }) => {
  await patientFactory.create({ name: "Anna", surname: "Müller" });

  await page.goto("/administration/documentation/create");

  await page.getByRole("combobox", { name: "Patient" }).click();
  await page.getByRole("option", { name: "Anna Müller" }).click();

  // Sitzungsnummer is empty until the draft is created server-side
  await expect(
    page.getByRole("spinbutton", { name: "Sitzungsnummer" })
  ).not.toHaveValue("", { timeout: 5000 });
});
