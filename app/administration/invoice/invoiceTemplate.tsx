import {
  Document,
  //next is confused because of the Image namin clash
  Image as ReactPdfImage,
  Page,
  Text,
  View,
} from "@react-pdf/renderer/lib/react-pdf.browser";
import { createTw } from "react-pdf-tailwind";
import { Patient } from "../../../models/patient";
import { Factor, Service } from "../../../models/service";
import Address from "../../../models/address";
import logoBuffer from "./logo";

type InvoiceAddress = {
  name: string;
  surname: string;
} & Address;

type InvoicePatient = { diagnosis?: string } & Pick<
  Patient,
  "name" | "surname" | "birthdate"
>;

type Position = {
  date: Date;
  number: number;
  factor: Factor;
  amount: number;
  pageBreak: boolean;
} & Pick<Service, "originalGopNr" | "description">;

export interface Props {
  invoiceNumber: string;
  invoiceAddress?: InvoiceAddress;
  patient?: InvoicePatient;
  positions: Position[];
}

export default function InvoiceTemplate({
  invoiceNumber,
  invoiceAddress,
  patient,
  positions,
}: Props) {
  const tw = createTw({});
  const total = positions.reduce((acc, position) => acc + position.amount, 0);
  const dateFormatter = new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const currencyFormatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

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
                Ute Seliger - Friedrich-Ebert-Straße 98 - 04105 Leipzig
              </Text>
              {invoiceAddress && (
                <>
                  <Text
                    style={tw("text-sm mt-8")}
                  >{`${invoiceAddress.name} ${invoiceAddress.surname}`}</Text>
                  <Text style={tw("text-sm")}>{invoiceAddress.street}</Text>
                  <Text style={tw("text-sm")}>
                    {`${invoiceAddress.zip} ${invoiceAddress.city}`}
                  </Text>
                </>
              )}
            </View>
          </View>
          <View style={tw("flex-col border-l-2 text-sm pl-2 pt-2 pb-2")}>
            <Text style={tw("font-bold")}>M.Sc. A.Ute Seliger</Text>
            <Text>Psychologische Psychotherapeutin</Text>
            <Text style={tw("mb-3")}>ENR.: 9660750</Text>
            <Text>Friedrich-Ebert-Str. 98</Text>
            <Text style={tw("mb-3")}>04105 Leipzig</Text>
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
                `Behandelt wurde: ${patient.surname}, ${
                  patient.name
                }, geb.: ${dateFormatter.format(patient.birthdate)} `}
            </Text>
          </View>
        </View>
        {patient?.diagnosis && (
          <View style={tw("flex-row justify-between pt-4")}>
            <View style={tw("flex-col")}>
              <Text style={tw("text-sm")}>{`${patient.diagnosis}`}</Text>
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
            key={position.originalGopNr}
            break={position.pageBreak}
            wrap={false}
          >
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-center")}>
                {dateFormatter.format(position.date)}
              </Text>
            </View>
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-center")}>
                {position.originalGopNr}
              </Text>
            </View>
            <View style={tw("w-[50vw]")}>
              <Text style={tw("text-sm self-start")}>
                {position.description}
              </Text>
            </View>
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-center")}>{position.factor}</Text>
            </View>
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-center")}>{position.number}</Text>
            </View>
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-end")}>
                {currencyFormatter.format(position.amount)}
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
        <View style={tw("absolute bottom-8 self-center")} fixed>
          <View style={tw("flex-col items-center")}>
            <Text style={tw("text-sm")}>Deutsche Apotheker und Ärztebank</Text>
            <Text style={tw("text-sm")}>
              IBAN: DE16 3006 0601 0022 1680 56 • Swift/BIC: DAAEDEDDXXX
            </Text>
            <Text style={tw("text-sm")}>Steuernummer: 231/274/03511</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
