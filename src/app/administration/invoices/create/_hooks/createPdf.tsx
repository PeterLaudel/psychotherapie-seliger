import { PDFDocument } from "pdf-lib";
import { InvoiceTemplate, Position } from "./invoiceTemplate";
import { createZugferdXml as createZugferdXmlOrigin } from "@/zugferd";
import { Patient } from "@/models/patient";
import { ownerInfo } from "@/owner";
import dayjs from "dayjs";

export interface CreatePdfParams {
  patient?: Patient;
  invoiceNumber: string;
  positions: Position[];
  diagnosis?: string;
}

export async function createPdf(params: CreatePdfParams) {
  const blob = await renderPdf(params);

  if (!blob) return null;

  const arrayBuffer = await blob.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const zugferdXml = createZugferdXml(params);
  const xmlBytes = Buffer.from(zugferdXml, "utf-8");

  await pdfDoc.attach(xmlBytes, "zugferd-invoice.xml", {
    mimeType: "application/xml",
    description: "ZUGFeRD Invoice XML",
    creationDate: new Date(),
    modificationDate: new Date(),
  });

  //save as base64
  return await pdfDoc.saveAsBase64();
}

async function renderPdf(params: CreatePdfParams) {
  const { patient } = params;

  const invoice = (
    <InvoiceTemplate {...params} billingInfo={patient?.billingInfo} />
  );

  const pdf = await import("@react-pdf/renderer").then((module) => module.pdf);
  return await pdf(invoice).toBlob();
}

function createZugferdXml(params: CreatePdfParams) {
  if (!params.patient || !params.positions.length) {
    return "";
  }
  return createZugferdXmlOrigin({
    invoiceDate: dayjs().format("YYYYMMDD"),
    invoiceNumber: params.invoiceNumber,
    positions: params.positions.map((p, index) => ({
      id: index.toString(),
      description: p.service.description,
      price: p.price,
      quantity: p.amount,
      tax: 0.0, // Assuming no tax for medical services
    })),
    buyer: {
      name: params.patient.name,
      street: params.patient.billingInfo.address.street,
      city: params.patient.billingInfo.address.city,
      zip: params.patient.billingInfo.address.zip,
      country: "DE",
    },
    seller: {
      name: `${ownerInfo.name} ${ownerInfo.surname}`,
      street: ownerInfo.address.street,
      city: ownerInfo.address.city,
      zip: ownerInfo.address.zip,
      country: ownerInfo.address.country,
      identifier: ownerInfo.taxId,
      vatId: ownerInfo.vatId,
    },
  });
}
