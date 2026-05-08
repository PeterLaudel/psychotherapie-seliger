import { getInvoicesRepository } from "@/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || undefined;

  const invoicesRepository = await getInvoicesRepository();
  const invoices = await invoicesRepository.filter({ search });

  return NextResponse.json(invoices);
}