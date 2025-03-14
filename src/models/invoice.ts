import { Patient } from "./patient";
import { Factor, Service } from "./service";

export interface Position {
  date: Date;
  service: Service;
  number: number;
  factor: Factor;
}

export interface Invoice {
  patient: Patient;
  positions: Position[];
}
