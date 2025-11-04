import { getInvoicesRepository } from "@/server";
import { InvoiceViewer } from "./invoiceViewer";

type Props = {
  params: Promise<{
    invoiceId: number;
  }>;
};

export default async function Page({ params }: Props) {
  const { invoiceId } = await params;
  const invoiceRepository = await getInvoicesRepository();
  const invoice = await invoiceRepository.find(invoiceId);

  return <InvoiceViewer invoice={invoice} />;
}
