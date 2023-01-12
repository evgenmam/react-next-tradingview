import { ChartBarIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@mui/joy";
import { Stack } from "@mui/system";
import React, { useRef, useState } from "react";
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
import { Strategy } from "./strategy/strategy";

export default function App() {
  const [tab, setTab] = useState("chart");
  const ctx = useState<IModalContext | null>(null);
  return (
    <ZoomWrapper>
      <HoverWrapper>
        <ModalContext.Provider value={ctx}>
          <Box position="absolute" top="0" right="0" p={1} zIndex={2}></Box>
          <Stack spacing={2} mb={2}>
            <Grid container spacing={2}>
              <Grid xs={12} md={8}>
                <Box>
                  <Card
                    variant="outlined"
                    sx={
                      tab === "table"
                        ? { overflow: "auto", height: "600px" }
                        : {}
                    }
                  >
                    <Tabs
                      variant="plain"
                      value={tab}
                      onChange={(_, v) => {
                        setTab(v as string);
                      }}
                    >
                      <Stack spacing={2} divider={<Divider />}>
                        <Stack direction={"row"} alignItems="center">
                          <Box minWidth={300}>
                            <DatasetSelect dataset="source" />
                          </Box>
                          <CsvUpload dataset="source" />
                          <TabList sx={{ ml: "auto" }}>
                            <Tab value="chart">
                              <ChartBarIcon width={24} />
                            </Tab>
                            <Tab value="table">
                              <TableCellsIcon width={24} />
                            </Tab>
                          </TabList>
                        </Stack>
                        <CardContent>
                          <TabPanel value="chart">
                            <DataChart />
                          </TabPanel>
                          <TabPanel value="table">
                            <DataTable />
                          </TabPanel>
                        </CardContent>
                      </Stack>
                    </Tabs>
                  </Card>
                  <Card variant="outlined" sx={{ mt: 2 }}>
                    <Stack spacing={2} divider={<Divider />}>
                      <Stack direction={"row"} alignItems="center">
                        <Box minWidth={300}>
                          <DatasetSelect dataset="target" />
                        </Box>
                        <CsvUpload dataset="target" />
                      </Stack>
                      <CardContent>
                        <TargetData />
                      </CardContent>
                    </Stack>
                  </Card>
                </Box>
              </Grid>
              <Grid xs={12} md={4}>
                <Strategy />
              </Grid>
            </Grid>
            <Settings />
          </Stack>
          <PromptDialog />
        </ModalContext.Provider>
      </HoverWrapper>
    </ZoomWrapper>
  );
}
