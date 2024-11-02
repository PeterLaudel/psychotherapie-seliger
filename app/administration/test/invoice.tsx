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
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
    },

    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
  });
  return (
    <Document>
      <Page size="A4" style={tw("flex-col p-10")}>
        <View style={tw("flex-row h-[8vh]")}>
          <Image src="/logo.png" />
        </View>
        <View style={tw("flex-row justify-between")}>
          <View style={tw("flex-row")}>
            <View>
              <Text style={tw("text-sm border-b")}>
                Ute Seliger - Friedrich-Ebert-Straße 98 - 04105 Leipzig
              </Text>
            </View>
          </View>
          <View style={tw("flex-col border-l-2 text-sm pl-2 pt-2 pb-2")}>
            <View>
              <Text style={tw("font-bold")}>M.Sc. A.Ute Seliger</Text>
              <Text>Psychologische Psychotherapeutin</Text>
              <Text style={tw("mb-3")}>ENR.: 9660750</Text>
              <Text>Friedrich-Eber-Str. 98</Text>
              <Text style={tw("mb-3")}>04105 Leipzig</Text>
              <Text>psychotherapie@praxis-seliger.com</Text>
            </View>
          </View>
        </View>

        <View style={tw("flex-row justify-between")}>
          <View style={tw("flex-col")}>
            <Text style={tw("font-black text-lg")}>Rechnung Nr. L030724</Text>
          </View>
          <View style={tw("flex-col")}>
            <Text style={tw("text-sm")}>Leipzig, 01.01.2021</Text>
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
