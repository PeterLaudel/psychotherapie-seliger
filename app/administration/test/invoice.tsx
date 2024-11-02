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
      <Page size="A4" style={styles.page}>
        <Image src="/logo.png" />
        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
};

export function Invoice({ patient, positions }: Props) {
  const completeDocument = <CompleteDocument />;
  return (
    <div>
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
