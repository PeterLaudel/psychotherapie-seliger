import { Invoice } from "@/models/invoice";
import { getInvoicesRepository } from "@/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") as Invoice["status"] || undefined;

  const invoicesRepository = await getInvoicesRepository();
  const invoices = await invoicesRepository.filter({ search, status });

  return NextResponse.json(invoices);
}