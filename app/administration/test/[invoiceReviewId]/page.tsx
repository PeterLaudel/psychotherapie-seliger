import { drive_v3 } from "@googleapis/drive";
import { getAuthClient, getInvoicesRepository } from "../../../../server";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./pdfViewer"), { ssr: false });

interface Props {
  params: {
    invoiceReviewId: string;
  };
}

export default async function InvoiceReview({
  params: { invoiceReviewId },
}: Props) {
  const invoiceRepository = await getInvoicesRepository();
  const { base64 } = await invoiceRepository.get(invoiceReviewId);
  return (
    <div className="w-full h-[100vh]">
      <PDFViewer data={base64} />
    </div>
  );
}
