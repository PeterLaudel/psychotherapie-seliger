import { useEffect, useState } from "react";
import { CreatePdfParams, createPdf } from "./createPdf";

export const usePdf = ({
  patient,
  therapeut,
  invoiceNumber,
  positions,
}: CreatePdfParams) => {
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
      const pdfData = await createPdf({
        patient,
        therapeut,
        invoiceNumber,
        positions,
      });
      setPdfBlob(pdfData);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    generatePdf();
  }, [patient, invoiceNumber, positions, therapeut]);

  return pdfBlob;
};
