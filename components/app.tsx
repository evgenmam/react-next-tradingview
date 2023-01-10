import { Box, Card, CardContent, Tab, TabList, TabPanel, Tabs } from "@mui/joy";
import { Stack } from "@mui/system";
import { useRef, useState } from "react";
import { CsvUpload } from "../components/csv/csv-upload";
import { DataChart } from "../components/data/chart";
import { DataTable } from "../components/data/table";
import { Settings } from "../components/settings/settings";

export default function App() {
  const [tab, setTab] = useState("chart");

  return (
    <>
      <Box position="absolute" top="0" right="0" p={1} zIndex={2}>
        <CsvUpload />
      </Box>
      <Stack spacing={2}>
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v as string);
          }}
        >
          <TabList>
            <Tab value="chart">Chart</Tab>
            <Tab value="table">Table</Tab>
          </TabList>
          <Box mt={2}>
            <Card
              variant="outlined"
              sx={tab === "table" ? { overflow: "auto", height: "600px" } : {}}
            >
              <CardContent>
                <TabPanel value="chart">
                  <DataChart />
                </TabPanel>
                <TabPanel value="table">
                  <DataTable />
                </TabPanel>
              </CardContent>
            </Card>
          </Box>
        </Tabs>
        <Settings />
      </Stack>
    </>
  );
}
