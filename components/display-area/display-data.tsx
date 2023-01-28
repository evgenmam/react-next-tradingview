import { Box, Divider } from "@mui/joy";
import { Stack } from "@mui/system";
import { Indicators } from "../data/indicators";
import XScrollbar from "../utils/scrollbars";
import { DisplayDataStudies } from "./display-data-studies";
import { DisplayDataTable } from "./display-data-table";

export const DisplayData = () => {
  return (
    <Stack height="100%" width={300}>
      <Box height="100%" px={1} sx={{ table: { width: "100%" } }}>
        <XScrollbar>
          <Stack spacing={2} width="100%">
            <Divider>Source</Divider>
            <DisplayDataTable dataset="source" />
            <Divider>Studies</Divider>
            <DisplayDataStudies />
            {/* <Indicators /> */}
            <Divider>Target</Divider>
            <DisplayDataTable dataset="target" />
            <DisplayDataTable dataset="target2" />
          </Stack>
        </XScrollbar>
      </Box>
    </Stack>
  );
};
