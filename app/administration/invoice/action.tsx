"use server";

import { gmail_v1 } from "@googleapis/gmail";
import { renderToBuffer } from "@react-pdf/renderer";
import { getAuthClient, getInvoicesRepository, getUser } from "../../../server";
import InvoiceTemplate, { Props as InvoiceParameters } from "./invoiceTemplate";

interface Message {
  recipient: string;
  subject: string;
  text: string;
}

export async function createInvoice(
  invoiceParameters: InvoiceParameters,
  message: Message
) {
  const pdf = await renderToBuffer(<InvoiceTemplate {...invoiceParameters} />);

  const user = await getUser();
  const invoiceRepository = await getInvoicesRepository();
  const { base64, number } = await invoiceRepository.create({
    base64: pdf.toString("base64"),
    number: invoiceParameters.invoiceNumber,
  });
  const email = [
    `From: "${user.name}" <${user.email}>`,
    `To: ${message.recipient}`,
    `Subject: ${message.subject}`,
    "MIME-Version: 1.0",
    'Content-Type: multipart/mixed; boundary="boundary"',
    "",
    "--boundary",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    message.text,
    "",
    "--boundary",
    "Content-Type: application/pdf",
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="Rechnung_${number}.pdf"`,
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
