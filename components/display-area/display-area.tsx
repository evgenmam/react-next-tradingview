import { Card, CardContent } from "@mui/joy";
import { CardHeader, Divider, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { DatasetSelect } from "../data/selects/dataset-select";
import XScrollbar from "../utils/scrollbars";
import { DisplayChart } from "./display-chart";
import { DisplayData } from "./display-data";

export const DisplayArea = () => {
  return (
    <Box height="100%" sx={{ boxSizing: "border-box" }} py={2}>
      <Card
        sx={{
          p: 0,
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack direction="row" py={1} px={2} divider={<Divider />} spacing={2}>
          <DatasetSelect
            label="Source "
            dataset="source"
            sx={{ minWidth: 300 }}
            placeholder="Select Source"
          />
          <DatasetSelect
            label="Target 1"
            dataset="target"
            sx={{ minWidth: 300 }}
            placeholder="Select Target Data"
          />
          <DatasetSelect
            label="Target 2"
            dataset="target2"
            sx={{ minWidth: 300 }}
            placeholder="Select Target Data"
          />
        </Stack>
        <Stack direction="row" height="100%">
          <DisplayChart />
          <DisplayData />
        </Stack>
      </Card>
    </Box>
  );
};
