import { Container, CssVarsProvider, Grid } from "@mui/joy";
import React, { useState } from "react";
import { Settings } from "../components/settings/settings";
import { HoverWrapper } from "../hooks/hover.hook";
import { ModalContext, IModalContext } from "../hooks/modal.hook";
import { PromptDialog } from "./dialogs/prompt-dialog";
import { DisplayArea } from "./display-area/display-area";
import { Strategy } from "./strategy/strategy";
import { Theme, ThemeWrapper } from "./theme";
import { Loader } from "./utils/loader";
import { ChartConfigDrawer } from "./v2/chart-config-drawer";
import { SnackbarProvider } from "notistack";

export default function App() {
  const ctx = useState<IModalContext | null>(null);
  return (
    <ModalContext.Provider value={ctx}>
      <HoverWrapper>
        <ThemeWrapper />
        <Grid container height="100vh" columnSpacing={2}>
          <Grid xs={12} md={8} height="100%">
            <DisplayArea />
          </Grid>
          <Grid xs={12} md={4} height="100%">
            <Strategy />
          </Grid>
        </Grid>
        <Settings />
        <PromptDialog />
        <ChartConfigDrawer />
      </HoverWrapper>
    </ModalContext.Provider>
  );
}
