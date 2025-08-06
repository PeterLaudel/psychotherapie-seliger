import { createZugferdXml, InvoiceData } from "./zugferd";

describe("createZugferdXml", () => {
  it("should create a valid Zugferd XML document", () => {
    const invoiceData: InvoiceData = {
        number: "INV-12345",
        date: "2023-10-01",
        positions: [
          {
            description: "Therapy session",
            quantity: 1,
            price: 150.0,
            tax: 0.0,
            id: "pos-1",
          },
          {
            description: "Follow-up consultation",
            quantity: 1,
            price: 100.0,
            tax: 0.0,
            id: "pos-2",
          },
        ],
        seller: {
          name: "Therapist Name",
          street: "Therapist Street 123",
          city: "Therapist City",
          zip: "12345",
          country: "Germany",
        },
        buyer: {
          name: "Patient Name",
          street: "Patient Street 456",
          city: "Patient City",
          zip: "67890",
          country: "Germany",
        },
      };

    const xml = createZugferdXml(invoiceData);
    expect(xml).toMatchSnapshot();
  });
});
