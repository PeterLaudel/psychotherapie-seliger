"use server";

import { drive_v3 } from "@googleapis/drive";
import { sheets_v4 } from "@googleapis/sheets";
import { getAuthClient } from "../../../server";
import { OAuth2Client } from "google-auth-library";
import { Readable } from "stream";
import { Factor } from "../../../models/service";
import { Patient } from "../../../models/patient";
import { Position as FormPosition } from "./sheets";

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
}

interface Contact {
  name: string;
  street: string;
  zip: string;
  city: string;
}

interface Position {
  date: Date;
  code: string;
  description: string;
  factor: Factor;
  number: number;
  amount: number;
}

class InvoiceTemplate {
  private sheets: sheets_v4.Sheets;
  private originalId = "1X2hzdn3hAjleZKadkFLTk6TXgcoDWDX_Q__MHGX5J-E";

  constructor(private auth: OAuth2Client) {
    this.sheets = new sheets_v4.Sheets({ auth });
  }

  async fill(fileName: string, contact: Contact, positions: Position[]) {
    const manager = new DocumentManager(this.auth);
    const copyId = await manager.copy(this.originalId, "temp");

    const data = [
      {
        range: "A1:D1", // Adjust the range for patient details
        values: [[contact.name, contact.street, contact.zip, contact.city]],
      },
      {
        range: "A10:F", // Adjust the range for positions
        values: positions.map((position) => [
          position.date,
          position.code,
          position.description,
          position.factor,
          position.number,
          position.amount,
        ]),
      },
    ];

    await this.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: copyId,
      requestBody: {
        data,
        valueInputOption: "RAW",
      },
    });

    const converter = new DocumentToPdfConverter(this.auth);
    const pdfId = await converter.convert(copyId, fileName);
    manager.delete(copyId);
    return pdfId;
  }
}

class DocumentToPdfConverter {
  constructor(private auth: OAuth2Client) {}

  async convert(fileId: string, fileName: string) {
    const drive = new drive_v3.Drive({ auth: this.auth });
    const { data } = await drive.files.export(
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
    } = await drive.files.create({
      requestBody: {
        name: `fileName.pdf`,
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

export async function createInvoice(
  patient: Patient,
  positions: Required<FormPosition>[]
) {
  const auth = await getAuthClient();
  const newTemplate = new InvoiceTemplate(auth);

  const invoicePositions = positions.map((position) => ({
    date: position.date,
    code: position.service.originalGopNr,
    description: position.service.description,
    factor: position.factor,
    number: position.number,
    amount: (position.service.amounts[position.factor] || 0) * position.number,
  }));

  return newTemplate.fill("invoice", { ...patient }, invoicePositions);

  // const email = [
  //   'From: "Sender Name" <sender@example.com>',
  //   `To: peter.laudel@gmail.com`,
  //   "Subject: Your Invoice",
  //   "MIME-Version: 1.0",
  //   'Content-Type: multipart/mixed; boundary="boundary"',
  //   "",
  //   "--boundary",
  //   'Content-Type: text/plain; charset="UTF-8"',
  //   "Content-Transfer-Encoding: 7bit",
  //   "",
  //   "Please find attached your invoice.",
  //   "",
  //   "--boundary",
  //   "Content-Type: application/pdf",
  //   "Content-Transfer-Encoding: base64",
  //   'Content-Disposition: attachment; filename="invoice.pdf"',
  //   "",
  //   buffer.toString("base64"),
  //   "",
  //   "--boundary--",
  // ].join("\r\n");

  // const encodedEmail = Buffer.from(email)
  //   .toString("base64")
  //   .replace(/\+/g, "-")
  //   .replace(/\//g, "_")
  //   .replace(/=+$/, "");

  // const gmail = new gmail_v1.Gmail({ auth });

  // await gmail.users.messages.send({
  //   userId: "me",
  //   requestBody: {
  //     raw: encodedEmail,
  //   },
  // });
}
