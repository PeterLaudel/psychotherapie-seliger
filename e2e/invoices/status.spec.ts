import { invoiceFactory } from "factories/invoice";
import { test, expect } from "../fixtures";
import { patientFactory } from "factories/patient";
import { patientInvoiceFactory } from "factories/patientInvoice";
import { therapeutFactory } from "factories/therapeut";

test("sents an invoice email", async ({ page }) => {
  const therapeut = await therapeutFactory.create();
  const patient = await patientFactory.create();
  const invoice = await invoiceFactory.create({ status: "pending" });
  await patientInvoiceFactory.create({
    patientId: patient.id,
    invoiceId: invoice.id,
  });

  await page.goto("/administration/invoices");

  await expect(page.getByText("Invoices")).toBeVisible();

  await page.getByRole("button", { name: "Rechnung senden" }).click();
  await page.getByRole("button", { name: "Senden" }).click();

  await expect(page.getByText("Versendet")).toBeVisible();

  await page.goto("/api/invoices/test", { waitUntil: "networkidle" }); // wait for email to be sent

  await expect(
    page.getByText(
      `${therapeut.name} ${therapeut.surname} <${therapeut.email}>`
    )
  ).toBeVisible();
  await expect(
    page.getByText(
      `${patient.name} ${patient.surname} <${patient.billingInfo.email}>`
    )
  ).toBeVisible();
  await expect(
    page.getByText(`Ihre Rechnung ${invoice.invoiceNumber}`, { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText(`Rechnung_${invoice.invoiceNumber}.pdf`)
  ).toBeVisible();
});
