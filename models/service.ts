export const allFactors = ["1.0", "1.8", "2.3"] as const;

export type Factor = typeof allFactors[number];

type Amount = [
  [typeof allFactors[0], number | undefined],
  [typeof allFactors[1], number | undefined],
  [typeof allFactors[2], number | undefined]
];

export interface Service {
  short: string;
  originalGopNr: string;
  description: string;
  note?: string;
  points: number;
  amounts: Amount;
}
