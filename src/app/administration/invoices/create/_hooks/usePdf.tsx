import { useEffect, useState } from "react";
import { CreatePdfParams, createPdf } from "./createPdf";

export const usePdf = ({
  patient,
  invoiceNumber,
  mappedPositions,
  diagnosis,
}: CreatePdfParams) => {
  const [pdfBlob, setPdfBlob] = useState<Uint8Array | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
      const pdfData = await createPdf({
        patient,
        invoiceNumber,
        mappedPositions,
        diagnosis,
      });
      setPdfBlob(pdfData);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    generatePdf();
  }, [patient, invoiceNumber, mappedPositions, diagnosis]);

  return pdfBlob;
};
