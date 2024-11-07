import { drive_v3 } from "@googleapis/drive";
import { getAuthClient } from "../../../../server";
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
  const auth = await getAuthClient();
  const drive = new drive_v3.Drive({
    auth: auth,
  });
  const { data } = await drive.files.get(
    {
      fileId: invoiceReviewId,
      alt: "media",
    },
    {
      responseType: "arraybuffer",
    }
  );
  const buffer = Buffer.from(data as ArrayBuffer);
  const base64 = buffer.toString("base64");

  return (
    <div className="w-full h-[100vh]">
      <PDFViewer data={base64} />
    </div>
  );
}
