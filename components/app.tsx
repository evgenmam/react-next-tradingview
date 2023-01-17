import { ChartBarIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Card,
  CardContent,
  Container,
  CssVarsProvider,
  Divider,
  Grid,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  useColorScheme,
  useTheme,
} from "@mui/joy";
import { Stack } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { DataChart } from "../components/data/chart";
import { DataTable } from "../components/data/table";
import { Settings } from "../components/settings/settings";
import { useSetting, useSettings } from "../hooks/data.hook";
import { HoverWrapper } from "../hooks/hover.hook";
import { ModalContext, IModalContext } from "../hooks/modal.hook";
import { ZoomWrapper } from "../hooks/zoom.hook";
import { CsvUpload } from "./csv/csv-upload";
import { DatasetSelect } from "./data/selects/dataset-select";
import { TargetData } from "./data/target";
import { TargetChart } from "./data/target-chart";
import { PromptDialog } from "./dialogs/prompt-dialog";
import { DisplayArea } from "./display-area/display-area";
import { Strategy } from "./strategy/strategy";
import { Theme, ThemeWrapper } from "./theme";
export default function App() {
  const [tab, setTab] = useState("chart");
  const ctx = useState<IModalContext | null>(null);
  return (
    <CssVarsProvider theme={Theme}>
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
            <Grid container height="100%" columnSpacing={2}>
              <Grid xs={12} md={8} height="100%">
                <DisplayArea />
              </Grid>
              <Grid xs={12} md={4}>
                <Strategy />
              </Grid>
            </Grid>
            {/* <ZoomWrapper>
              <Grid container spacing={2} height="100%">
                <Grid xs={12} md={8}>
                  <DisplayArea />
                </Grid>
                <Grid xs={12} md={4}>
                  <Strategy />
                </Grid>
              </Grid>
            </ZoomWrapper> */}
            <Settings />
            <PromptDialog />
          </Container>
        </HoverWrapper>
      </ModalContext.Provider>
    </CssVarsProvider>
  );
}
