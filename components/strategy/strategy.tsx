import { Card, Divider, Stack, Typography } from "@mui/joy";
import { Box } from "@mui/system";
import { CsvUpload } from "../csv/csv-upload";
import { DatasetSelect } from "../data/selects/dataset-select";
import XScrollbar from "../utils/scrollbars";
import { Signals } from "./signals";
import { Strategies } from "./strategies";
import { TradeStats } from "./trade-stats";

export const Strategy = () => {
  return (
    <Box height="100%" sx={{ boxSizing: "border-box", overflow: "hidden" }}>
      <XScrollbar>
        <Card variant="outlined" sx={{ boxSizing: "border-box", my: 2 }}>
          <Stack spacing={2} divider={<Divider />}>
            <Typography fontSize={16} my={1.5} textAlign="center">
              Strategy Builder
            </Typography>
            <Signals />
            <Strategies />
            <TradeStats />
          </Stack>
        </Card>
      </XScrollbar>
    </Box>
  );
};
