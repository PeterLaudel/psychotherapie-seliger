"use server";

import { drive_v3 } from "@googleapis/drive";
import { sheets_v4 } from "@googleapis/sheets";
import { gmail_v1 } from "@googleapis/gmail";
import { Invoice } from "../../../models/invoice";
import { getAuthClient, getServicesRepository } from "../../../server";
import { OAuth2Client } from "google-auth-library";
import { copyFile } from "fs";
import { Readable } from "stream";

class DocumentManager {
  private drive: drive_v3.Drive;

  constructor(auth: OAuth2Client) {
    this.drive = new drive_v3.Drive({ auth });
  }

  async copy(fileId: string, name: string) {
    const {
      data: { id: copyId },
    } = await this.drive.files.copy({
      fileId,
      requestBody: {
        name,
      },
    });

    if (!copyId) {
      throw new Error("Failed to copy file");
    }

    return copyId;
  }

  async delete(fileId: string) {
    await this.drive.files.delete({ fileId });
  }

  async toPdf(fileId: string) {
    const { data } = await this.drive.files.export(
      {
        fileId,
        mimeType: "application/pdf",
      },
      { responseType: "arraybuffer" }
    );

    if (!data) throw new Error("Failed to get file");
    const buffer = data as ArrayBuffer;
    const readableStream = new Readable();
    readableStream.push(Buffer.from(buffer));
    readableStream.push(null);

    const {
      data: { id: pdfId },
    } = await this.drive.files.create({
      requestBody: {
        name: "invoice.pdf",
      },
      media: {
        mimeType: "application/pdf",
        body: readableStream,
      },
    });

    if (!pdfId) throw new Error("Failed to create pdf");
    return pdfId;
  }
}

export async function createInvoice() {
  const auth = await getAuthClient();
  const drive = new drive_v3.Drive({ auth });

  const manager = new DocumentManager(auth);
  const copyId = await manager.copy(
    "1X2hzdn3hAjleZKadkFLTk6TXgcoDWDX_Q__MHGX5J-E",
    "Invoice Template"
  );

  const sheets = new sheets_v4.Sheets({ auth });

  const invoice: Pick<Invoice, "patient" | "positions"> = {
    patient: {
      id: "1",
      name: "John",
      surname: "Doe",
      address: "123 Main St",
      zip: "12345",
      city: "Springfield",
      email: "john.doe@example.com",
      phone: "123-456-7890",
    },
    positions: [
      {
        date: new Date(),
        service: (await (await getServicesRepository()).get())[0],
        number: 1,
        factor: "2.3",
      },
    ],
  };

  const data = [
    {
      range: "A1:C1", // Adjust the range for patient details
      values: [
        [invoice.patient.name, invoice.patient.address, invoice.patient.email],
      ],
    },
    {
      range: "A10:D", // Adjust the range for positions
      values: invoice.positions.map((position) => [
        position.date,
        position.service.description,
        position.number,
        position.factor,
      ]),
    },
  ];

  sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: copyId,
    requestBody: {
      data,
      valueInputOption: "RAW",
    },
  });

  const pdfId = await manager.toPdf(copyId);
  //   await manager.delete(copyId);

  const response = await drive.files.get(
    {
      fileId: pdfId,
      alt: "media",
    },
    { responseType: "arraybuffer" }
  );

  if (!response.data) throw new Error("Failed to get file");

  const buffer = Buffer.from(response.data as ArrayBuffer);

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
    buffer.toString("base64"),
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
