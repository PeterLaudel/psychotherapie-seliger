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
      "xmlns:rsm": "urn:ferd:CrossIndustryDocument:invoice:1p0",
      "xmlns:ram": "urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:12",
      "xmlns:udt": "urn:un:unece:uncefact:data:standard:UnqualifiedDataType:15",
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

  // prettier-ignore
  transaction.ele("ram:SellerTradeParty")
      .ele("ram:Name").txt(seller.name).up()
      .ele("ram:PostalTradeAddress")
        .ele("ram:StreetName").txt(seller.street).up()
        .ele("ram:CityName").txt(seller.city).up()
        .ele("ram:PostalZone").txt(seller.zip).up()
        .ele("ram:CountryID").txt(seller.country).up()
      .up()
    .up();

  // prettier-ignore
  transaction.ele("ram:BuyerTradeParty")
      .ele("ram:Name").txt(buyer.name).up()
      .ele("ram:PostalTradeAddress")
        .ele("ram:StreetName").txt(buyer.street).up()
        .ele("ram:CityName").txt(buyer.city).up()
        .ele("ram:PostalZone").txt(buyer.zip).up()
        .ele("ram:CountryID").txt(buyer.country).up()
      .up()
    .up();

  addPositions(transaction, positions);
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
    lineItem
      .ele("ram:SpecifiedLineTradeAgreement")
      .ele("ram:GrossPriceProductTradePrice")
      .ele("ram:ChargeAmount")
      .txt(position.price.toFixed(2))
      .up()
      .up()
      .up();
    lineItem
      .ele("ram:SpecifiedLineTradeDelivery")
      .ele("ram:BilledQuantity", { unitCode: "C62" })
      .txt(position.quantity.toString())
      .up()
      .up();
    lineItem
      .ele("ram:SpecifiedLineTradeSettlement")
      .ele("ram:ApplicableTradeTax")
      .ele("ram:TypeCode")
      .txt("VAT")
      .up()
      .ele("ram:CategoryCode")
      .txt("E")
      .up()
      .ele("ram:RateApplicablePercent")
      .txt(position.tax.toFixed(2))
      .up()
      .ele("ram:ExemptionReason")
      .txt("Medical service")
      .up()
      .up()
      .up()
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

  // prettier-ignore
  settlement.ele("ram:SpecifiedTradeSettlementPaymentMeans")
    .ele("ram:TypeCode").txt("42").up() // 42 = Bank transfer
    .up();

  // prettier-ignore
  settlement.ele("ram:ApplicableTradeTax")
    .ele("ram:TypeCode").txt("VAT").up()
    .ele("ram:CategoryCode").txt("E").up() // E = Exempt
    .ele("ram:RateApplicablePercent").txt("0.00").up()
    .ele("ram:ExemptionReason").txt("Medical service").up()
    .ele("ram:CalculatedAmount").txt("0.00").up()
    .ele("ram:BasisAmount").txt(totalAmount.toFixed(2)).up()
    .up();

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
