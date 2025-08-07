import { create } from "xmlbuilder2";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";

interface ZugferdPosition {
  id: string;
  description: string;
  quantity: number;
  price: number;
  tax: number;
}

interface ZugferdPartie {
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface InvoiceData {
  number: string;
  date: string;
  positions: ZugferdPosition[];
  seller: ZugferdPartie;
  buyer: ZugferdPartie;
}

export function createZugferdXml(invoiceData: InvoiceData): string {
  const { positions, number, date, seller, buyer } = invoiceData;

  // prettier-ignore
  const xmlDoc = create({ version: "1.0", encoding: "UTF-8" }).ele(
    "rsm:CrossIndustryInvoice",
    {
      "xmlns:rsm": "urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100",
      "xmlns:ram": "urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100",
      "xmlns:udt": "urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100",
    }
  );

  // prettier-ignore
  xmlDoc.ele("rsm:ExchangedDocumentContext")
    .ele("ram:GuidelineSpecifiedDocumentContextParameter")
      .ele("ram:ID").txt("urn:factur-x:en16931:basic").up()
    .up()
  .up();

  // prettier-ignore
  xmlDoc.ele("rsm:ExchangedDocument")
    .ele("ram:ID").txt(number).up()
    .ele("ram:TypeCode").txt("380").up() // 380 = Commercial invoice
    .ele("ram:IssueDateTime")
      .ele("udt:DateTimeString", { format: "102" }).txt(date).up()
    .up()
  .up();

  const transaction = xmlDoc.ele("rsm:SupplyChainTradeTransaction");

  // Add all line items first
  addPositions(transaction, positions);

  // Add ApplicableHeaderTradeAgreement with Seller and Buyer
  const agreement = transaction.ele("ram:ApplicableHeaderTradeAgreement");
  agreement.ele("ram:SellerTradeParty")
    .ele("ram:Name").txt(seller.name).up()
    .ele("ram:PostalTradeAddress")
      .ele("ram:PostcodeCode").txt(seller.zip).up()
      .ele("ram:LineOne").txt(seller.street).up()
      .ele("ram:CityName").txt(seller.city).up()
      .ele("ram:CountryID").txt(seller.country).up()
    .up()
  .up();
  agreement.ele("ram:BuyerTradeParty")
    .ele("ram:Name").txt(buyer.name).up()
    .ele("ram:PostalTradeAddress")
      .ele("ram:PostcodeCode").txt(buyer.zip).up()
      .ele("ram:LineOne").txt(buyer.street).up()
      .ele("ram:CityName").txt(buyer.city).up()
      .ele("ram:CountryID").txt(buyer.country).up()
    .up()
  .up();

  // Add empty ApplicableHeaderTradeDelivery (required by schema)
  transaction.ele("ram:ApplicableHeaderTradeDelivery");

  // Add ApplicableHeaderTradeSettlement
  addMonetarySummary(transaction, positions);

  return xmlDoc.end({ prettyPrint: true });
}

function addPositions(xmlDoc: XMLBuilder, positions: ZugferdPosition[]): void {
  positions.forEach((position) => {
    const lineItem = xmlDoc.ele("ram:IncludedSupplyChainTradeLineItem");
    lineItem
      .ele("ram:AssociatedDocumentLineDocument")
        .ele("ram:LineID")
        .txt(position.id)
        .up()
      .up();
    lineItem
      .ele("ram:SpecifiedTradeProduct")
        .ele("ram:Name")
        .txt(position.description)
        .up()
      .up();
    // SpecifiedLineTradeAgreement: GrossPrice, NetPrice (required)
    const agreement = lineItem.ele("ram:SpecifiedLineTradeAgreement");
    agreement
      .ele("ram:GrossPriceProductTradePrice")
        .ele("ram:ChargeAmount")
        .txt(position.price.toFixed(2))
        .up()
      .up();
    agreement
      .ele("ram:NetPriceProductTradePrice")
        .ele("ram:ChargeAmount")
        .txt(position.price.toFixed(2))
        .up()
      .up();

    lineItem
      .ele("ram:SpecifiedLineTradeDelivery")
        .ele("ram:BilledQuantity", { unitCode: "C62" })
        .txt(position.quantity.toString())
        .up()
      .up();

    // SpecifiedLineTradeSettlement: ApplicableTradeTax, SpecifiedTradeSettlementLineMonetarySummation
    const settlement = lineItem.ele("ram:SpecifiedLineTradeSettlement");
    const tax = settlement.ele("ram:ApplicableTradeTax");
    tax.ele("ram:TypeCode").txt("VAT").up();
    tax.ele("ram:CategoryCode").txt("E").up();
    tax.ele("ram:ExemptionReasonCode").txt("E").up();
    tax.ele("ram:RateApplicablePercent").txt(position.tax.toFixed(2)).up();
    settlement
      .ele("ram:SpecifiedTradeSettlementLineMonetarySummation")
        .ele("ram:LineTotalAmount")
        .txt((position.price * position.quantity).toFixed(2))
        .up()
      .up();
  });
}

function addMonetarySummary(
  xmlDoc: XMLBuilder,
  positions: ZugferdPosition[]
): void {
  const totalAmount = positions.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const settlement = xmlDoc.ele("ram:ApplicableHeaderTradeSettlement");

  // Add required InvoiceCurrencyCode before payment means
  settlement.ele("ram:InvoiceCurrencyCode").txt("EUR").up();

  // prettier-ignore
  settlement.ele("ram:SpecifiedTradeSettlementPaymentMeans")
    .ele("ram:TypeCode").txt("42").up() // 42 = Bank transfer
    .up();

  // Header-level tax: order and content per schema
  const tax = settlement.ele("ram:ApplicableTradeTax");
  tax.ele("ram:CalculatedAmount").txt("0.00").up();
  tax.ele("ram:TypeCode").txt("VAT").up();
  tax.ele("ram:ExemptionReason").txt("Medical service").up();
  tax.ele("ram:BasisAmount").txt(totalAmount.toFixed(2)).up();
  tax.ele("ram:CategoryCode").txt("E").up();
  tax.ele("ram:ExemptionReasonCode").txt("E").up();
  tax.ele("ram:RateApplicablePercent").txt("0.00").up();

  // prettier-ignore
  settlement.ele("ram:SpecifiedTradeSettlementHeaderMonetarySummation")
    .ele("ram:LineTotalAmount").txt(totalAmount.toFixed(2)).up()
    .ele("ram:TaxBasisTotalAmount").txt(totalAmount.toFixed(2)).up()
    .ele("ram:TaxTotalAmount").txt("0.00").up()
    .ele("ram:GrandTotalAmount").txt(totalAmount.toFixed(2)).up()
    .ele("ram:DuePayableAmount").txt(totalAmount.toFixed(2)).up()
    .up();

  settlement.up();
}
