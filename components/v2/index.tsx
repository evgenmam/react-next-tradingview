import { Container, CssVarsProvider, Grid } from "@mui/joy";
import { useState } from "react";
import { HoverWrapper } from "../../hooks/hover.hook";
import { IModalContext, ModalContext } from "../../hooks/modal.hook";
import { PromptDialog } from "../dialogs/prompt-dialog";
import { Settings } from "../settings/settings";
import { SymbolListDrawer } from "../symbol-list/symbol-list-drawer";
import { Theme, ThemeWrapper } from "../theme";
import { ChartConfigDrawer } from "./chart-config-drawer";
import { SnackbarProvider } from "notistack";

const V2 = () => {
  const ctx = useState<IModalContext | null>(null);
  return (
    <CssVarsProvider theme={Theme}>
      <SnackbarProvider>
        <ModalContext.Provider value={ctx}>
          <HoverWrapper>
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
              <Grid container height="100%" columnSpacing={2}></Grid>
              <PromptDialog />
            </Container>
          </HoverWrapper>
        </ModalContext.Provider>
        <ChartConfigDrawer />
      </SnackbarProvider>
    </CssVarsProvider>
  );
};

export default V2;
