import { sessionFactory } from "factories/session";
import { test, expect } from "../fixtures";

test("lists sessions in the dashboard", async ({ page }) => {
  await sessionFactory.createList(2);

  await page.goto("/administration/documentation");

  // Two data rows plus the header row
  await expect(page.getByRole("row")).toHaveCount(3);

  // Draft chip visible (factory default status is "draft")
  await expect(page.getByText("Entwurf").first()).toBeVisible();
});

test("shows the high-risk panel for high-risk sessions", async ({ page }) => {
  await sessionFactory.create({ riskLevel: "high" });

  await page.goto("/administration/documentation");

  await expect(page.getByText("Aktive Risiko-Flags")).toBeVisible();
});

test("does not show the high-risk panel when no high-risk sessions exist", async ({
  page,
}) => {
  await sessionFactory.create({ riskLevel: "low" });

  await page.goto("/administration/documentation");

  await expect(page.getByText("Aktive Risiko-Flags")).not.toBeVisible();
});
