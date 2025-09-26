import { getInvoicesRepository } from "@/server";
import { PdfViewer } from "./pdfViewer";

type Props = {
    params: Promise<{
        invoiceId: number;
    }>
};

export default async function Page({
    params
}: Props) {
    const { invoiceId } = await params;
    const invoiceRepository = await getInvoicesRepository();
    const invoice = await invoiceRepository.find(invoiceId);

    return <PdfViewer base64Pdf={invoice.base64Pdf} />;
}