import { test, expect } from "../fixtures";
import { patientFactory } from "factories/patient";

test("createas an invoice", async ({ page }) => {
  const patient = await patientFactory.create({
    name: "Max",
    surname: "Mustermann",
  });
  await page.goto("/administration/invoices");

  await page.getByRole("button", { name: "Rechnung anlegen" }).click();

  await expect(
    page.getByRole("heading", { name: "Rechnung erstellen" })
  ).toBeVisible();

  await page.getByRole("combobox", { name: "Patient" }).first().click();
  await page.getByRole("option", { name: patient.name }).click();
});
