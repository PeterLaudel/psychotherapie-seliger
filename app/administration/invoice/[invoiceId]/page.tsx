import { getInvoicesRepository } from "../../../../server";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./pdfViewer"), { ssr: false });

interface Props {
  params: {
    invoiceId: string;
  };
}

export default async function InvoiceReview({ params: { invoiceId } }: Props) {
  const invoiceRepository = await getInvoicesRepository();
  const { base64 } = await invoiceRepository.get(invoiceId);
  return (
    <div className="w-full h-[100vh]">
      <PDFViewer data={base64} />
    </div>
  );
}
