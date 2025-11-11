import { useEffect, useState } from "react";
import { CreatePdfParams, createPdf } from "./createPdf";

export const usePdf = ({
  patient,
  therapeut,
  invoiceNumber,
  positions,
  diagnosis,
}: CreatePdfParams) => {
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
      const pdfData = await createPdf({
        patient,
        therapeut,
        invoiceNumber,
        positions,
        diagnosis,
      });
      setPdfBlob(pdfData);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    generatePdf();
  }, [patient, invoiceNumber, positions, diagnosis, therapeut]);

  return pdfBlob;
};
