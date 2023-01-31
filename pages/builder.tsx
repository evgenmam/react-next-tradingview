import { Container, CssVarsProvider } from "@mui/joy";
import dynamic from "next/dynamic";

import { Theme, ThemeWrapper } from "../components/theme";
import { HoverWrapper } from "../hooks/hover.hook";

const TVBuilder = dynamic(() => import("../components/builder"), {
  ssr: false,
});

const BuilderPage = () => {
  return (
    <CssVarsProvider theme={Theme}>
      <Container
        maxWidth={false}
        sx={(a) => {
          return {
            bgcolor: a.palette.background.level2,
            height: "100vh",
          };
        }}
      >
        <ThemeWrapper />
        <HoverWrapper>
          <TVBuilder />
        </HoverWrapper>
      </Container>
    </CssVarsProvider>
  );
};
export default BuilderPage;
