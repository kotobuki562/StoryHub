import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"

Font.register({
  family: "Noto Sans JP",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/notosansjp/v6/NoEzHYDvYyXAwUQ5LCzLQ.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/notosansjp/v6/NoEzHYDvYyXAwUQ5LCzLQ.ttf",
      fontWeight: 700,
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
})

export const PDFDOcument = (
  <Document creator="my" subject="test" title="test title" language="ja">
    <div className="flex flex-col">
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>こんにちは</Text>
        </View>
      </Page>
    </div>
  </Document>
)
