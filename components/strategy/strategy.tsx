import { Card, Divider, Stack, Typography } from "@mui/joy";
import { Box } from "@mui/system";
import { CsvUpload } from "../csv/csv-upload";
import { DatasetSelect } from "../data/selects/dataset-select";
import { Signals } from "./signals";

export const Strategy = () => {
  return (
    <Card variant="outlined" sx={{ height: "100%", boxSizing: "border-box" }}>
      <Stack spacing={2} divider={<Divider />}>
        <Typography fontSize={16} my={1.5}>
          Strategy Builder
        </Typography>
        <Signals />
        {/* <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box minWidth={300}>
            <DatasetSelect dataset="target" />
          </Box>
          <CsvUpload dataset="target" label="Import Target Chart" />
        </Stack> */}
      </Stack>
    </Card>
  );
};
