import type { Patient } from "../../../models/patient";
import type { Factor, Service } from "../../../models/service";

export interface BillEntry {
  date?: Date;
  service?: Service;
  number?: number;
  factor?: Factor;
}

export interface FormProps {
  patient?: Patient;
  entries: BillEntry[];
}
