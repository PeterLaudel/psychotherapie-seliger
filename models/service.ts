export const allFactors = ["1.0", "1.8", "2.3"];

export type Factor = typeof allFactors[number];

type Entry = [Factor, number | undefined];

type Amount = Entry[];

export interface Service {
  short: string;
  originalGopNr: string;
  description: string;
  note?: string;
  points: number;
  amounts: Amount;
}
