import { Patient } from "./patient";
import { Factor, Service } from "./service";

export interface Position {
  date: Date;
  service: Service;
  number: number;
  factor: Factor;
}

export interface Invoice {
  id: string;
  patient: Patient;
  positions: Position[];
}
