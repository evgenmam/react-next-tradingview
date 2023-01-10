import { Html, Head, Main, NextScript } from "next/document";
import { CssVarsProvider } from "@mui/joy/styles";
import { Container } from "@mui/system";
import { getInitColorSchemeScript } from "@mui/joy/styles";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <CssVarsProvider>
          <Container maxWidth="xl">
            <Main />
            <NextScript />
          </Container>
        </CssVarsProvider>
      </body>
    </Html>
  );
}
