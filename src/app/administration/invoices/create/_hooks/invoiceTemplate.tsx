import {
  Document,
  //next is confused because of the Image namin clash
  Image as ReactPdfImage,
  Page,
  Text,
  View,
} from "@react-pdf/renderer/lib/react-pdf.browser";
import { createTw } from "react-pdf-tailwind";
import logoBuffer from "./logo";
import { Service } from "@/models/service";
import { BillingInfo, Patient } from "@/models/patient";
import { generateSepaQrBase64Png } from "./generateSepaQrBase64Png";

type InvoicePatient = Pick<Patient, "name" | "surname" | "birthdate">;

export type Position = {
  serviceDate: string, amount: number, factor: string, service: Service; price: number, pageBreak?: boolean
};

export interface Recipient {
  name: string;
  iban: string;
  bic?: string;
  street: string;
  zip: string;
  city: string;
  taxId: string;
}

export interface Props {
  invoiceNumber: string;
  diagnosis?: string;
  billingInfo?: BillingInfo;
  patient?: InvoicePatient;
  positions: Position[];
  recepient: Recipient;
}

function toKey({ service, serviceDate, amount, factor }: Position) {
  return `${service.originalGopNr}${serviceDate}${amount}${factor}`;
}

export function InvoiceTemplate({
  invoiceNumber,
  billingInfo,
  patient,
  positions,
  diagnosis,
  recepient,
}: Props) {
  const tw = createTw({});
  const total = positions.reduce((acc, position) => acc + position.price, 0);
  const dateFormatter = new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const currencyFormatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  const data = generateSepaQrBase64Png({
    recipient: recepient.name,
    bic: recepient.bic,
    iban: recepient.iban,
    amount: total,
    purposeCode: "MEDI",
    remittanceInfo: invoiceNumber,
  })

  return (
    <Document>
      <Page size="A4" style={tw("p-12")} wrap>
        <View style={tw("flex-row h-[8vh]")}>
          <ReactPdfImage src={{ data: logoBuffer, format: "png" }} />
        </View>
        <View style={tw("flex-row justify-between pt-20")}>
          <View style={tw("flex-row")}>
            <View>
              <Text style={tw("text-xs border-b")}>
                {`${recepient.name} • ${recepient.street} • ${recepient.zip} ${recepient.city}`}
              </Text>
              {billingInfo && (
                <>
                  <Text
                    style={tw("text-sm mt-8")}
                  >{`${billingInfo.name} ${billingInfo.surname}`}</Text>
                  <Text style={tw("text-sm")}>
                    {billingInfo.address.street}
                  </Text>
                  <Text style={tw("text-sm")}>
                    {`${billingInfo.address.zip} ${billingInfo.address.city}`}
                  </Text>
                </>
              )}
            </View>
          </View>
          <View style={tw("flex-col border-l-2 text-sm pl-2 pt-2 pb-2")}>
            <Text style={tw("font-bold")}>M.Sc. A.Ute Seliger</Text>
            <Text>Psychologische Psychotherapeutin</Text>
            <Text style={tw("mb-3")}>ENR.: 9660750</Text>
            <Text>{`${recepient.street}`}</Text>
            <Text style={tw("mb-3")}>{`${recepient.zip} ${recepient.city}`}</Text>
            <Text>psychotherapie@praxis-seliger.com</Text>
          </View>
        </View>
        <View style={tw("flex-row justify-between pt-8")}>
          <View style={tw("flex-col")}>
            <Text
              style={tw("font-black text-lg")}
            >{`Rechnung Nr. ${invoiceNumber}`}</Text>
          </View>
          <View style={tw("flex-col")}>
            <Text style={tw("text-sm")}>
              Leipzig, {dateFormatter.format(new Date())}
            </Text>
          </View>
        </View>
        <View style={tw("flex-row justify-between pt-8")}>
          <View style={tw("flex-col")}>
            <Text style={tw("text-sm")}>
              {patient &&
                `Behandelt wurde: ${patient.surname}, ${patient.name
                }, geb.: ${dateFormatter.format(
                  Date.parse(patient.birthdate)
                )} `}
            </Text>
          </View>
        </View>
        {diagnosis && (
          <View style={tw("flex-row justify-between pt-4")}>
            <View style={tw("flex-col")}>
              <Text style={tw("text-sm")}>{`${diagnosis}`}</Text>
            </View>
          </View>
        )}
        <View style={tw("flex-row justify-between pt-4")}>
          <View style={tw("flex-col")}>
            <Text style={tw("text-sm")}>Sehr geehrte Damen und Herren,</Text>
            <Text style={tw("text-sm pt-2")}>
              vielen Dank für Ihr Vertrauen. Für meine Leistungen berechne ich
              den folgenden Betrag:
            </Text>
          </View>
        </View>

        <View style={tw("flex-row border-b py-2 pt-12")}>
          <View style={tw("w-[10vw]")}>
            <Text style={tw("text-sm font-bold self-center")}>Datum</Text>
          </View>
          <View style={tw("w-[10vw]")}>
            <Text style={tw("text-sm font-bold self-center")}>Code</Text>
          </View>
          <View style={tw("w-[50vw]")}>
            <Text style={tw("text-sm font-bold self-center")}>Leistung</Text>
          </View>
          <View style={tw("w-[10vw]")}>
            <Text style={tw("text-sm font-bold self-center")}>Faktor</Text>
          </View>
          <View style={tw("w-[10vw]")}>
            <Text style={tw("text-sm font-bold self-center")}>Anzahl</Text>
          </View>
          <View style={tw("w-[10vw]")}>
            <Text style={tw("text-sm font-bold self-end")}>Betrag</Text>
          </View>
        </View>
        {positions.map((position) => (
          <View
            style={tw("flex-row py-2")}
            key={toKey(position)}
            break={position.pageBreak}
            wrap={false}
          >
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-center")}>
                {dateFormatter.format(Date.parse(position.serviceDate))}
              </Text>
            </View>
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-center")}>
                {position.service.originalGopNr}
              </Text>
            </View>
            <View style={tw("w-[50vw]")}>
              <Text style={tw("text-sm self-start")}>
                {position.service.description}
              </Text>
            </View>
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-center")}>{position.factor}</Text>
            </View>
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-center")}>{position.amount}</Text>
            </View>
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-end")}>
                {currencyFormatter.format(position.price)}
              </Text>
            </View>
          </View>
        ))}
        <View style={tw("flex-col pt-4")}>
          <View style={tw("flex-row justify-end")}>
            <View style={tw("flex-col pr-5")}>
              <Text style={tw("text-sm")}>Gesamtsumme</Text>
            </View>
            <View style={tw("flex-col")}>
              <Text style={tw("text-sm")}>
                {currencyFormatter.format(total)}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={tw("text-sm mt-4")}>
            Leistungen gemäß Katalog: GOÄ | Heilbehandlung – daher von der
            Umsatzsteuer nach § Nr. 14a UStG befreit
          </Text>
        </View>
        <View>
          <Text style={tw("text-sm mt-4")}>
            Bitte überweisen Sie den Rechnungsbetrag innerhalb von 7 Tagen auf
            mein unten genanntes Konto. Geben Sie dabei bitte als
            Verwendungszweck die Rechnungsnummer an.
          </Text>
        </View>
        <View style={tw("flex-row h-[8vh] justify-end mt-4")}>
          <View style={tw("flex-row border")}>
            <View style={tw("flex-col items-center self-center ml-2")}>
              <Text style={tw("text-sm font-bold")}>Überweisen per Code</Text>
              <Text style={tw("text-sm")}>Code mit der Banking-App scannen</Text>
            </View>
            <ReactPdfImage src={data} />
          </View>
        </View>
        <View style={tw("absolute bottom-8 self-center")} fixed>
          <View style={tw("flex-col items-center")}>
            <Text style={tw("text-sm")}>Deutsche Apotheker und Ärztebank</Text>
            <Text style={tw("text-sm")}>
              {`IBAN: ${recepient.iban} • Swift/BIC: ${recepient.bic}`}
            </Text>
            <Text style={tw("text-sm")}>{`Steuernummer: ${recepient.taxId}`}</Text>
          </View>
        </View>
      </Page>
    </Document >
  );
}
