"use server";

import { getInvoicesRepository, getTherapeutsRepository } from "@/server";
import { revalidatePath } from "next/cache";
import mailInvoice from "./mailInvoice";
import { encryptPdfBase64 } from "./encryptPdf";
import { pdfOwnerPassword } from "@/environment";

export async function sendInvoiceEmail(invoiceId: number) {
  const invoicesRepository = await getInvoicesRepository();
  const invoice = await invoicesRepository.find(invoiceId);

  const therapistsRepository = await getTherapeutsRepository();
  const therapeut = await therapistsRepository.all().then((t) => t[0]);

  const base64Pdf = await encryptPdfBase64(
    invoice.base64Pdf,
    invoice.patient.invoicePassword || "",
    process.env.PDF_OWNER_PASSWORD || '',
  );

  await mailInvoice(therapeut, { ...invoice, base64Pdf });

  await invoicesRepository.save({ ...invoice, status: "sent" });
  revalidatePath("/administration/invoices");
}

export async function markInvoiceAsPending(invoiceId: number) {
  const invoicesRepository = await getInvoicesRepository();
  const invoice = await invoicesRepository.find(invoiceId);

  await invoicesRepository.save({ ...invoice, status: "pending" });
  revalidatePath("/administration/invoices");
}

export async function markInvoiceAsPaid(invoiceId: number) {
  const invoicesRepository = await getInvoicesRepository();
  const invoice = await invoicesRepository.find(invoiceId);

  await invoicesRepository.save({ ...invoice, status: "paid" });
  revalidatePath("/administration/invoices");
}

export async function markInvoiceAsSent(invoiceId: number) {
  const invoicesRepository = await getInvoicesRepository();
  const invoice = await invoicesRepository.find(invoiceId);

  await invoicesRepository.save({ ...invoice, status: "sent" });
  revalidatePath("/administration/invoices");
}

export async function deleteInvoice(invoiceId: number) {
  const invoicesRepository = await getInvoicesRepository();

  await invoicesRepository.delete(invoiceId);
  revalidatePath("/administration/invoices");
}
