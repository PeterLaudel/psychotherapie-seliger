import { Invoice } from "@/models/invoice";

export interface InvoicesQueryKey {
  search?: string;
  status?: Invoice["status"];
}

export function invoicesQueryKey(query: InvoicesQueryKey) {
  return ["invoices", query];
}

export async function fetchInvoices(query: InvoicesQueryKey): Promise<Invoice[]> {
  const url = new URLSearchParams();
  if (query.search) url.set("search", query.search);
  if (query.status) url.set("status", query.status);
  const res = await fetch(`/api/invoices?${url}`);
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
}
