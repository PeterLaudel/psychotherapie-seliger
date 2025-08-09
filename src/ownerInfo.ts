interface Owner {
  name: string;
  surname: string;
  address: {
    street: string;
    zip: string;
    city: string;
    country?: string;
  };
  email: string;
  phone: string;
  taxId?: string;
  vatId?: string;
  bank?: {
    accountHolder: string;
    iban: string;
    bic: string;
    bankName: string;
  };
  website?: string;
}

export const ownerInfo: Owner = {
  name: "Ute",
  surname: "Seliger",
  address: {
    street: "Friedrich-Ebert-Straße 98",
    zip: "04105",
    city: "Leipzig",
    country: "DE",
  },
  email: "psychotherapie@praxis-seliger.com",
  phone: "01234 567890",
  taxId: "231/274/03511",
  bank: {
    accountHolder: "Ute Seliger",
    iban: "DE16 3006 0601 0022 1680 56",
    bic: "DAAEDEDDXXX",
    bankName: "Deutsche Apotheker und Ärztebank",
  },
  website: "https://www.psychotherapie-seliger.de",
};