"use server";

import { getInvoicesRepository, getTherapeutsRepository } from "@/server";
import { revalidatePath } from "next/cache";

import * as nodemailer from "nodemailer";

export async function sendInvoiceEmail(invoiceId: number) {
  const invoicesRepository = await getInvoicesRepository();
  const invoice = await invoicesRepository.find(invoiceId);

  const therapistsRepository = await getTherapeutsRepository();
  const therapeut = await therapistsRepository.all().then((t) => t[0]);

  const transporter = await createTransport();
  await transporter.sendMail({
    from: `${therapeut.name} ${therapeut.surname} <${therapeut.email}>`,
    to: `${invoice.name} ${invoice.surname} <${invoice.email}>`,
    subject: `Ihre Rechnung ${invoice.invoiceNumber}`,
    text: `Sehr geehrte/r ${invoice.name} ${invoice.surname},\n\nanbei erhalten Sie Ihre Rechnung ${invoice.invoiceNumber}.\n\nMit freundlichen Grüßen\n${therapeut.name} ${therapeut.surname}`,
    attachments: [
      {
        filename: `Rechnung_${invoice.invoiceNumber}.pdf`,
        content: Buffer.from(invoice.base64Pdf, "base64"),
        contentType: "application/pdf",
      },
    ],
  });

  await invoicesRepository.save({ ...invoice, status: "sent" });
  revalidatePath("/administration/invoices");
}

export async function markInvoiceAsPaid(invoiceId: number) {
  const invoicesRepository = await getInvoicesRepository();
  const invoice = await invoicesRepository.find(invoiceId);

  await invoicesRepository.save({ ...invoice, status: "paid" });
  revalidatePath("/administration/invoices");
}

export async function deleteInvoice(invoiceId: number) {
  const invoicesRepository = await getInvoicesRepository();
  await invoicesRepository.delete(invoiceId);

  revalidatePath("/administration/invoices");  
}

async function createTransport() {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}
