import { NextRequest } from "next/server";
import { CreatePdfParams, generateInvoice } from "@/invoicePdf";

export async function POST(request: NextRequest) {
  const data = (await request.json()) as CreatePdfParams;

  const newBuffer = await generateInvoice(data);
  return new Response(newBuffer, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
