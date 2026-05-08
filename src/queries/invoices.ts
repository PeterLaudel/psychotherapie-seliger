import { Invoice } from "@/models/invoice";

export function invoicesQueryKey(search = "") {
  return ["invoices", { search }];
}

export async function fetchInvoices(search = ""): Promise<Invoice[]> {
  const url = new URLSearchParams();
  if (search) url.set("search", search);
  const res = await fetch(`/api/invoices?${url}`);
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
}
