"use client";

import dynamic from "next/dynamic";
const PDFViewer = dynamic(() => import("./pdfViewer"), { ssr: false });
const BlobProvider = dynamic(() => import("./blobProvider"), {
  ssr: false,
});
import {
  Page,
  Document,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer/lib/react-pdf.browser";
import { Patient } from "../../../models/patient";
import { Factor, Service } from "../../../models/service";
import { sendInvoice } from "./action";
import { createTw } from "react-pdf-tailwind";
import Address from "../../../components/contact/address";

export interface Position {
  date: Date;
  service: Service;
  number: number;
  factor: Factor;
}

interface Props {
  patient: Patient;
  positions: Position[];
}

const CompleteDocument = () => {
  const tw = createTw({});
  return (
    <Document>
      <Page size="A4" style={tw("p-12")} wrap>
        <View style={tw("flex-row h-[8vh]")}>
          <Image src="/logo.png" />
        </View>
        <View style={tw("flex-row justify-between pt-20")}>
          <View style={tw("flex-row")}>
            <View>
              <Text style={tw("text-xs border-b")}>
                Ute Seliger - Friedrich-Ebert-Straße 98 - 04105 Leipzig
              </Text>
              <Text style={tw("text-sm mt-8")}>Spaß Mann</Text>
              <Text style={tw("text-sm")}>Spaßstraße 1</Text>
              <Text style={tw("text-sm")}>04105 Leipzig</Text>
            </View>
          </View>
          <View style={tw("flex-col border-l-2 text-sm pl-2 pt-2 pb-2")}>
            <Text style={tw("font-bold")}>M.Sc. A.Ute Seliger</Text>
            <Text>Psychologische Psychotherapeutin</Text>
            <Text style={tw("mb-3")}>ENR.: 9660750</Text>
            <Text>Friedrich-Eber-Str. 98</Text>
            <Text style={tw("mb-3")}>04105 Leipzig</Text>
            <Text>psychotherapie@praxis-seliger.com</Text>
          </View>
        </View>

        <View style={tw("flex-row justify-between pt-8")}>
          <View style={tw("flex-col")}>
            <Text style={tw("font-black text-lg")}>Rechnung Nr. L030724</Text>
          </View>
          <View style={tw("flex-col")}>
            <Text style={tw("text-sm")}>Leipzig, 01.01.2021</Text>
          </View>
        </View>

        <View style={tw("flex-col pt-12")}>
          <View style={tw("flex-row border-b py-2")}>
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
          <View style={tw("flex-row p-auto py-2")}>
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-center")}>01.01.2021</Text>
            </View>
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-center")}>G908</Text>
            </View>
            <View style={tw("w-[50vw]")}>
              <Text style={tw("text-sm self-center")}>
                Das ist ein ziemlich langer text der hoffently über das hinaus
                geht was an Platz ist
              </Text>
            </View>
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-center")}>3,5</Text>
            </View>
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-center")}>1</Text>
            </View>
            <View style={tw("w-[10vw]")}>
              <Text style={tw("text-sm self-end")}>100,00 €</Text>
            </View>
          </View>
        </View>
        <View style={tw("flex-col pt-4")}>
          <View style={tw("flex-row justify-end")}>
            <View style={tw("flex-col pr-5")}>
              <Text style={tw("text-sm")}>Gesamtsumme</Text>
            </View>
            <View style={tw("flex-col")}>
              <Text style={tw("text-sm")}>100,00 €</Text>
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
};

export function Invoice({ patient, positions }: Props) {
  const completeDocument = <CompleteDocument />;
  return (
    <div className="flex-row h-[80vh]">
      <PDFViewer showToolbar={false} width={"100%"} height={"100%"}>
        {completeDocument}
      </PDFViewer>
      <BlobProvider document={completeDocument}>
        {({ blob }) => (
          <input
            type="button"
            value="Print"
            onClick={async () => {
              if (!blob) return;
              const formInput = new FormData();
              formInput.append("file", blob);
              const response = await sendInvoice(formInput);
            }}
          />
        )}
      </BlobProvider>
    </div>
  );
}
