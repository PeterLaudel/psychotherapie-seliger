import { serviceFactory } from "factories/service";

import { test, expect } from "../fixtures";

test("updates the description of the form", async ({ page }) => {
  const service = await serviceFactory.create({
    description: "Old description",
  });

  await page.goto("/administration/services");

  const heading = page.getByRole("heading", { name: "Leistung" });
  await expect(heading).toBeVisible();

  await page.getByRole("gridcell", { name: "Old description" }).click();

  await page.waitForURL("/administration/services/" + service.id);

  await page.getByLabel("Beschreibung").fill("New description");

  await page.getByRole("button", { name: "Speichern" }).click();

  await expect(heading).toBeVisible();
  await expect(page.getByText("Service gespeichert")).toBeVisible();
  await expect(page.getByRole("gridcell", { name: "New description" })).toBeVisible();
});
