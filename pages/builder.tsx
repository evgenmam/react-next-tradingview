import { Box, Container, CssVarsProvider } from "@mui/joy";
import dynamic from "next/dynamic";

import { Theme, ThemeWrapper } from "../components/theme";
import XScrollbar from "../components/utils/scrollbars";
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
            bgcolor: a.palette.background.level1,
            height: "100vh",

            pl: 0,
            pr: 0,
          };
        }}
      >
        <ThemeWrapper />
        <HoverWrapper>
          <Box overflow="hidden" height="100%" mx={-3}>
            <XScrollbar>
              <Box px={3}>
                <TVBuilder />
              </Box>
            </XScrollbar>
          </Box>
        </HoverWrapper>
      </Container>
    </CssVarsProvider>
  );
};
export default BuilderPage;
