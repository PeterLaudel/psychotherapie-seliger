import { useEffect, useState } from "react";
import { CreatePdfParams, createPdf } from "./createPdf";

export const usePdf = ({
  patient,
  invoiceNumber,
  positions,
  diagnosis,
}: CreatePdfParams) => {
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
      const pdfData = await createPdf({
        patient,
        invoiceNumber,
        positions,
        diagnosis,
      });
      setPdfBlob(pdfData);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    generatePdf();
  }, [patient, invoiceNumber, positions, diagnosis]);

  return pdfBlob;
};
