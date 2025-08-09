export interface Position {
  id: string;
  description: string;
  quantity: number;
  price: number;
  tax: number;
}

export interface Seller {
  identifier: string;
  vatId: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface Buyer {
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface ZugferdData {
  invoiceNumber: string;
  invoiceDate: string;
  positions: Position[];
  seller: Seller;
  buyer: Buyer;
}
