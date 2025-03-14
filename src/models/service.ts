export type Factor = "1.0" | "1.8" | "2.3";

type Amount = { [fac in Factor]?: number };

export interface Service {
  short: string;
  originalGopNr: string;
  description: string;
  note?: string;
  points: number;
  amounts: Amount;
}
