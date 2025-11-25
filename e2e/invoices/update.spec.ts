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

  const sendedEmail = await page.request.get("/api/invoices/test"); // wait for email to be sent
  const emailData = await sendedEmail.json();

  expect(emailData["from"]).toStrictEqual({
    address: therapeut.email,
    name: `${therapeut.name} ${therapeut.surname}`,
  });
  expect(emailData["to"]).toStrictEqual([
    {
      address: patient.billingInfo.email,
      name: `${patient.name} ${patient.surname}`,
    },
  ]);
  expect(emailData["subject"]).toStrictEqual(
    `Ihre Rechnung ${invoice.invoiceNumber}`
  );
});
