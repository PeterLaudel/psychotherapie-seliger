import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { InvoicesList } from "./invoicesList";
import { getInvoicesRepository } from "@/server";
import { invoicesQueryKey } from "@/queries/invoices";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: invoicesQueryKey(),
    queryFn: async () => {
      const search = (await searchParams).search || "";
      const repo = await getInvoicesRepository();
      return repo.filter({ search });
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InvoicesList />
    </HydrationBoundary>
  );
}
