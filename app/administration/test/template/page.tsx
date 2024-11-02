"use client";

import dynamic from "next/dynamic";
import {
  Page,
  Document as ReactDocument,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

//render nextjs dynamic

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

const PDFViewer = dynamic(
  () => import("./pdfViewer").then((module) => module.default),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export default function Template() {
  return (
    <PDFViewer>
      <ReactDocument>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Section #1</Text>
          </View>
          <View style={styles.section}>
            <Text>Section #2</Text>
          </View>
        </Page>
      </ReactDocument>
    </PDFViewer>
  );
}
