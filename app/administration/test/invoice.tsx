import { Patient } from "../../../models/patient";
import { Factor, Service } from "../../../models/service";
import { createInvoice, sendInvoice } from "./action";

export interface Position {
  date: Date;
  service: Service;
  number: number;
  factor: Factor;
}

interface Props {
  invoiceId?: string;
  patient: Patient;
  positions: Position[];
}

export function Invoice({ patient, positions, invoiceId }: Props) {
  if (invoiceId) {
    return (
      <div className="h-full w-full">
        <iframe
          src={`https://drive.google.com/file/d/${invoiceId}/preview`}
          height={"100%"}
          width={"100%"}
        />
        <input
          type="button"
          value="Close"
          onClick={() => sendInvoice(invoiceId, patient)}
        />
      </div>
    );
  }

  return null;
}
