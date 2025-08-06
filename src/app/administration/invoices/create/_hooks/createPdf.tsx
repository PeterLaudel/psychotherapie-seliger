import { PDFDocument } from "pdf-lib";
import { InvoiceTemplate, Position } from "./invoiceTemplate";
import { createZugferdXml } from "./zugferd";
import { Patient } from "@/models/patient";


export interface CreatePdfParams {
  patient?: Patient;
  invoiceNumber: string;
  mappedPositions: Position[];
  diagnosis?: string;
}

export async function createPdf({
  patient,
  invoiceNumber,
  mappedPositions,
  diagnosis,
}: CreatePdfParams): Promise<Uint8Array | null> {
  if (!patient) return null;
  const invoice = (
    <InvoiceTemplate
      invoiceNumber={invoiceNumber}
      billingInfo={patient?.billingInfo}
      diagnosis={diagnosis}
      patient={patient}
      positions={mappedPositions}
    />
  );

  const pdf = await import("@react-pdf/renderer").then((module) => module.pdf);
  const blob = await pdf(invoice).toBlob();

  if (!blob) {
    return null;
  }

  const arrayBuffer = await blob.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const zugferdXml = createZugferdXml({
    date: new Date().toISOString(),
    number: invoiceNumber,
    positions: mappedPositions.map((p) => ({
      id: p.id.toString(),
      description: p.service.description,
      price: p.price,
      quantity: p.amount,
      tax: 0.0, // Assuming no tax for medical services
    })),
    buyer: {
      name: patient.name,
      street: patient.billingInfo.address.street,
      city: patient.billingInfo.address.city,
      zip: patient.billingInfo.address.zip,
      country: "DE",
    },
    seller: {
      name: "Ute Seliger",
      street: "Friedrich-Ebert-Straße 98",
      city: "Leipzig",
      zip: "04105",
      country: "DE",
    },
  });

  const xmlBytes = Buffer.from(zugferdXml, "utf-8");

  await pdfDoc.attach(xmlBytes, "zugferd-invoice.xml", {
    mimeType: "application/xml",
    description: "ZUGFeRD Invoice XML",
    creationDate: new Date(),
    modificationDate: new Date(),
  });

  return await pdfDoc.save();
}
