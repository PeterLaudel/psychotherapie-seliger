"use server";

import { gmail_v1 } from "@googleapis/gmail";
import { renderToBuffer } from "@react-pdf/renderer";
import { getAuthClient, getInvoicesRepository } from "../../../server";
import InvoiceTemplate, { Props as InvoiceParameters } from "./invoiceTemplate";

export async function createInvoice(invoiceParameters: InvoiceParameters) {
  const pdf = await renderToBuffer(<InvoiceTemplate {...invoiceParameters} />);
  const invoiceRepository = await getInvoicesRepository();
  const { base64 } = await invoiceRepository.create({
    base64: pdf.toString("base64"),
    name: "invoice",
  });
  const email = [
    'From: "Sender Name" <sender@example.com>',
    `To: peter.laudel@gmail.com`,
    "Subject: Your Invoice",
    "MIME-Version: 1.0",
    'Content-Type: multipart/mixed; boundary="boundary"',
    "",
    "--boundary",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    "Please find attached your invoice.",
    "",
    "--boundary",
    "Content-Type: application/pdf",
    "Content-Transfer-Encoding: base64",
    'Content-Disposition: attachment; filename="invoice.pdf"',
    "",
    base64,
    "",
    "--boundary--",
  ].join("\r\n");

  const encodedEmail = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const auth = await getAuthClient();
  const gmail = new gmail_v1.Gmail({ auth });
  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedEmail,
    },
  });
}
