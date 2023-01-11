import { Html, Head, Main, NextScript } from "next/document";
import { CssVarsProvider } from "@mui/joy/styles";
import { Container } from "@mui/system";
import { getInitColorSchemeScript } from "@mui/joy/styles";
import { Sheet } from "@mui/joy";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body style={{ background: "#eee" }}>
        <CssVarsProvider>
          <Container maxWidth={false}>
            <Main />
            <NextScript />
          </Container>
        </CssVarsProvider>
      </body>
    </Html>
  );
}
