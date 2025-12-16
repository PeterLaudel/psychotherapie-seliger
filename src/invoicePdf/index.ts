/* eslint-disable no-param-reassign */
import { InvoicePosition } from "@/models/invoice";
import { Therapeut } from "@/models/therapeut";
import PDFDocument from "pdfkit";
import logoBuffer from "./logo";
import { Patient } from "@/models/patient";
import { generateSepaQrBase64PngBuffer } from "./generateSepaQrBase64Png";
import blobStream from "blob-stream";

export interface CreatePdfParams {
  patient?: Patient;
  therapeut: Therapeut;
  invoiceNumber: string;
  positions: (InvoicePosition & { price: number })[];
  options?: {
    invoicePassword?: string;
  };
}

const STANDARD_MARGINS = 48;

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export async function generateInvoiceBlob({
  patient,
  therapeut,
  invoiceNumber,
  positions,
  options,
}: CreatePdfParams) {
  const doc = new PDFDocument({
    margins: {
      left: STANDARD_MARGINS,
      right: STANDARD_MARGINS,
      top: STANDARD_MARGINS + 50,
      bottom: STANDARD_MARGINS + 50,
    },
    size: "A4",
    autoFirstPage: false,
    pdfVersion: "1.7",
    userPassword: options?.invoicePassword,
  });
  const stream = doc.pipe(blobStream());
  pageFooter(doc, therapeut);

  doc.addPage();

  const total = positions.reduce((prev, position) => prev + position.price, 0);

  invoiceLogo(doc);

  addressPart(doc, therapeut, patient);
  practicePart(doc, therapeut);
  doc.y = doc.y + 30;

  invoiceContext(doc, therapeut, invoiceNumber, patient);
  positionsPart(doc, total, positions);
  doc.moveDown(2);

  await addPaymentInfo(doc, invoiceNumber, total, therapeut);

  doc.end();

  return await new Promise<Blob>((resolve) => {
    stream.on("finish", function () {
      const blob = stream.toBlob("application/pdf");
      resolve(blob);
    });
  });
}

export function generateInvoiceBase64(params: CreatePdfParams) {
  return generateInvoiceBlob(params).then((blob) => blobToBase64(blob));
}

function pageFooter(doc: typeof PDFDocument, therapeut: Therapeut) {
  doc.on("pageAdded", () => {
    const bottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;

    const footerContent =
      `${therapeut.bankName}\n` +
      `IBAN: ${therapeut.iban} • Swift/BIC: ${therapeut.bic}\n` +
      `Steuernummer: ${therapeut.taxId}`;

    const textHeight = doc.fontSize(11).heightOfString(footerContent);

    doc
      .fontSize(11)
      .text(
        footerContent,
        doc.page.margins.left,
        doc.page.height - textHeight - STANDARD_MARGINS,
        { align: "center" }
      );

    doc.text("", doc.page.margins.left, doc.page.margins.top);
    doc.page.margins.bottom = bottom;
  });
}

function invoiceLogo(doc: typeof PDFDocument) {
  doc.image(logoBuffer, doc.page.margins.left, 48, {
    height: 50,
    align: "center",
  });
}

function addressPart(
  doc: typeof PDFDocument,
  therapeut: Therapeut,
  patient?: Patient
) {
  doc.y = 150;
  doc
    .fontSize(11)
    .text(
      `${therapeut.name} ${therapeut.surname} • ${therapeut.street} • ${therapeut.zip} ${therapeut.city}`,
      doc.page.margins.left,
      doc.y,
      {
        underline: true,
      }
    );

  if (!patient) return;
  doc
    .fontSize(11)
    .text(
      `${patient.billingInfo.name} ${patient.billingInfo.surname}\n` +
        `${patient.billingInfo.address.street}\n` +
        `${patient.billingInfo.address.zip} ${patient.billingInfo.address.city}\n`,
      doc.page.margins.left,
      doc.y + 20
    );
}

function practicePart(doc: typeof PDFDocument, therapeut: Therapeut) {
  doc.x = 370;
  doc.y = 150;

  const practiceContent =
    `${therapeut.title} ${therapeut.name} ${therapeut.surname}\n` +
    "Psychologische Psychotherapeutin\n" +
    `ENR: ${therapeut.enr}\n\n` +
    `${therapeut.street}\n` +
    `${therapeut.zip} ${therapeut.city}\n\n` +
    `${therapeut.email}`;

  // Draw the vertical line BEFORE the text
  const height = doc.heightOfString(practiceContent);

  doc
    .lineWidth(2)
    .moveTo(doc.x - 10, doc.y - 10) // start slightly left of the text
    .lineTo(doc.x - 10, doc.y + height + 10) // adjust height as needed
    .stroke();

  doc.text(practiceContent, doc.x, doc.y);
}

function invoiceContext(
  doc: typeof PDFDocument,
  therapeut: Therapeut,
  invoiceNumber: string,
  patient?: Patient
) {
  const invTop = doc.y;

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(`Rechnung Nr. ${invoiceNumber}`, doc.page.margins.left, invTop, {
      align: "left",
    });

  doc
    .fontSize(11)
    .font("Helvetica")
    .text(
      `${therapeut.city}, ${dateFormatter.format(new Date())}`,
      doc.page.margins.left,
      invTop,
      {
        align: "right",
      }
    );

  doc.y = doc.y + 20;

  // -------------------------------------------------------------
  // PATIENT BLOCK
  // -------------------------------------------------------------
  doc
    .fontSize(11)
    .text(
      `Behandelt wurde: ${patient?.surname}, ${patient?.name}, geb.: ${
        patient?.birthdate &&
        dateFormatter.format(Date.parse(patient?.birthdate))
      }\n\n` +
        `${patient?.diagnosis}\n\n` +
        "Sehr geehrte Damen und Herren,\n\n" +
        "vielen Dank für Ihr Vertrauen. Für meine Leistungen berechne ich den folgenden Betrag:\n\n"
    );
}

function positionsPart(
  doc: typeof PDFDocument,
  total: number,
  positions: (InvoicePosition & { price: number })[]
) {
  const table = doc.fontSize(11).table({
    rowStyles: (i) => {
      return i < 1
        ? { border: [0, 0, 1, 0], padding: [0, 0, 0, 0] }
        : { border: false, padding: [10, 0, 0, 0] };
    },
    columnStyles: ["70", "*", "200", "*", "*", "*"],
  });
  table.row([
    { text: "Datum", align: "center", font: { src: "Helvetica-Bold" } },
    { text: "Code", align: "center", font: { src: "Helvetica-Bold" } },
    {
      text: "Leistung",
      align: "center",
      font: { src: "Helvetica-Bold" },
    },
    { text: "Faktor", align: "center", font: { src: "Helvetica-Bold" } },
    { text: "Anzahl", align: "center", font: { src: "Helvetica-Bold" } },
    {
      text: "Betrag",
      align: { x: "right" },
      font: { src: "Helvetica-Bold" },
    },
  ]);

  positions.forEach((position) =>
    table.row([
      {
        text: dateFormatter.format(Date.parse(position.serviceDate)),
        align: { x: "center", y: "top" },
      },
      {
        text: position.service.originalGopNr,
        align: { x: "center", y: "top" },
      },
      {
        text: position.service.description,
        align: { x: "left", y: "top" },
      },
      { text: position.factor, align: { x: "center", y: "top" } },
      { text: String(position.amount), align: { x: "center", y: "top" } },
      {
        text: currencyFormatter.format(position.price),
        align: { x: "right", y: "top" },
      },
    ])
  );
  table.end();
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(`Gesamtsumme ${currencyFormatter.format(total)}`, {
      align: "right",
    });
}

async function addPaymentInfo(
  doc: typeof PDFDocument,
  invoiceNumber: string,
  total: number,
  therapeut: Therapeut
) {
  doc.font("Helvetica").moveDown(2);

  doc
    .fontSize(11)
    .text(
      "Leistungen gemäß Katalog: GOÄ | Heilbehandlung – daher von der Umsatzsteuer nach § Nr. 14a UStG befreit.\n\n" +
        "Bitte überweisen Sie den Rechnungsbetrag innerhalb von 7 Tagen auf mein unten genanntes Konto. Geben Sie dabei bitte als Verwendungszweck die Rechnungsnummer an.\n\n"
    );

  const buffer = await generateSepaQrBase64PngBuffer({
    recipient: `${therapeut.name} ${therapeut.surname}`,
    bic: therapeut.bic,
    iban: therapeut.iban,
    amount: total,
    purposeCode: "MEDI",
    remittanceInfo: invoiceNumber,
  });

  const blockHeight = 115; // QR code + text + margin
  ensureSpace(doc, blockHeight);

  const currentX = doc.page.width - doc.page.margins.right;
  const currentY = doc.y;
  doc
    .font("Helvetica-Bold")
    .text("Überweisen per Code", currentX - 175 - 75, currentY + 30, {
      width: 175,
      height: 75,
      align: "center",
    });
  doc
    .font("Helvetica")
    .text(
      "Code mit der Banking-App scannen",
      currentX - 175 - 75,
      currentY + 40,
      {
        width: 175,
        height: 75,
        align: "center",
      }
    );
  doc.image(buffer, currentX - 75, currentY, {
    width: 75,
    height: 75,
  });
  doc
    .lineWidth(1)
    .rect(currentX - 175 - 75 - 10, currentY, 260, 75)
    .stroke();
}

function ensureSpace(doc: typeof PDFDocument, neededHeight: number) {
  const bottom = doc.page.height - doc.page.margins.bottom;

  if (doc.y + neededHeight > bottom) {
    doc.addPage();
    doc.y = doc.page.margins.top; // reset cursor
  }
}

function blobToBase64(blob: Blob) {
  return blob
    .arrayBuffer()
    .then((buffer) => Buffer.from(buffer).toString("base64"));
}
