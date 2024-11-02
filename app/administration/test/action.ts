"use server";

import { getAuthClient } from "../../../server";
import { gmail_v1 } from "@googleapis/gmail";

export async function sendInvoice(params: FormData) {
  const file = params.get("file") as File;
  const auth = await getAuthClient();

  if (!file) throw new Error("No file found");

  const bufferFile = await file.arrayBuffer();
  const encodedString = Buffer.from(bufferFile).toString("base64");
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
    encodedString,
    "",
    "--boundary--",
  ].join("\r\n");
  const encodedEmail = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const gmail = new gmail_v1.Gmail({ auth });
  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedEmail,
    },
  });
}
