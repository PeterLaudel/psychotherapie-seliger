import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { isDevelopment, isE2E } from "@/environment";
import { Invoice } from "@/models/invoice";
import { Therapeut } from "@/models/therapeut";
import { getServerSession } from "next-auth";
import * as nodemailer from "nodemailer";

export default async function mailInvoice(
  therapeut: Therapeut,
  invoice: Invoice
): Promise<void> {
  // Placeholder function for sending invoice email

  const transporter = await createTransport();
  const info = await transporter.sendMail({
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

  if (isE2E() || isDevelopment()) {
    global.lastEmailPreviewUrl = nodemailer.getTestMessageUrl(info) || null;
  }
}

async function createTransport() {
  if (isE2E() || isDevelopment()) {
    const account = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Not authenticated");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: session.user.email,
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      refreshToken: session.refreshToken,
    },
  });
}
