import { therapeutFactory } from "factories/therapeut";
import { serviceFactory } from "../../factories/service";
import { test, expect } from "../fixtures";
import { patientFactory } from "factories/patient";

test("createas an invoice", async ({ page }) => {
  await therapeutFactory.create({});
  const patient = await patientFactory.create({
    name: "Max",
    surname: "Mustermann",
  });
  const service = await serviceFactory.create({
    short: "Super short",
  });

  await page.goto("/administration/invoices");

  await page.getByRole("button", { name: "Rechnung anlegen" }).click();

  const heading = page.getByRole("heading", { name: "Rechnung erstellen" });
  await expect(heading).toBeVisible();

  await page.getByRole("combobox", { name: "Patient" }).first().click();
  await page.getByRole("option", { name: patient.name }).click();

  await page.getByRole("textbox", { name: "Diagnose" }).fill("Doof");

  const dateGroup = page.getByRole("group", { name: "Leistungs Datum" });
  await dateGroup.getByRole("spinbutton", { name: "Tag" }).fill("10");
  await dateGroup.getByRole("spinbutton", { name: "Monat" }).fill("10");
  await dateGroup.getByRole("spinbutton", { name: "Jahr" }).fill("2024");

  await page.getByRole("combobox", { name: "Leistung" }).click();
  await page.getByRole("option", { name: service.short }).click();

  await page.getByRole("button", { name: "Rechnung versenden" }).click();

  const succesAlert = page.getByRole("alert");
  await expect(succesAlert.getByText("Rechnung wurde erstellt")).toBeVisible();
});
