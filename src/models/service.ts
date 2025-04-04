export const factorArray = ["1.0", "1.8", "2.3"] as const;
export type Factor = typeof factorArray[number];

type Amount = { [fac in Factor]?: number };

export interface Service {
  id: number;
  short: string;
  originalGopNr: string;
  description: string;
  note?: string;
  points: number;
  amounts: Amount;
}
