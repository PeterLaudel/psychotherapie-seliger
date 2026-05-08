import { invoiceFactory } from "factories/invoice";
import { test, expect } from "../fixtures";
import { patientFactory } from "factories/patient";
import { patientInvoiceFactory } from "factories/patientInvoice";

test("filter invoices", async ({ page }) => {
  const patient1 = await patientFactory.create({ name: "Jane", surname: "Doe" });
  const patient2 = await patientFactory.create({ name: "John", surname: "Doe" });

  const invoice1 = await invoiceFactory.create({ invoiceAmount: 100 });
  const invoice2 = await invoiceFactory.create({ invoiceAmount: 200 });

  await patientInvoiceFactory.create({ patientId: patient1.id, invoiceId: invoice1.id });
  await patientInvoiceFactory.create({ patientId: patient2.id, invoiceId: invoice2.id });

  await page.goto("/administration/invoices");

  await expect(page.getByText("100")).toBeVisible();
  await expect(page.getByText("200")).toBeVisible();

  await page.getByPlaceholder("Suche").fill("Jane");

  await page.waitForResponse("/api/invoices*");

  await expect(page.getByText("200")).not.toBeVisible();
  await expect(page.getByText("100")).toBeVisible();
});
