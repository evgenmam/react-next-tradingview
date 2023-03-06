import { Button } from "@mui/joy";
import { Drawer, Stack } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Box } from "@mui/system";
import { queryTypes, useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";
import { MyStrategies } from "../builder/my-strategies";
import { Loader } from "../utils/loader";
import { Space } from "../utils/row";
import XScrollbar from "../utils/scrollbars";
import { ChartConfigDrawer } from "../v2/chart-config-drawer";
import CompareDrawer from "./compare-drawer";
import { StrategyData } from "./strategy-data";

const StrategyDetails = () => {
  const [id, setId] = useQueryState("id", queryTypes.integer.withDefault(0));
  const [, setCompare] = useQueryState(
    "compare",
    queryTypes.boolean.withDefault(false)
  );
  return (
    <Box>
      <Grid2 container columnSpacing={2}>
        <Grid2 xs={12} sm={4}>
          <Box height="100vh" overflow="hidden">
            <XScrollbar>
              <Box px={2}>
                <MyStrategies selected={id} onSelect={setId} />
              </Box>
            </XScrollbar>
          </Box>
        </Grid2>
        <Grid2 xs={12} sm={8}>
          <Box height="100vh" overflow="hidden" mx={-2} px={2}>
            <XScrollbar>
              <Stack spacing={1} pt={1}>
                <Space justifyContent="start">
                  <Button
                    onClick={() => setCompare(true)}
                    size="sm"
                    variant="plain"
                    disabled={!id}
                  >
                    Compare Mode
                  </Button>
                </Space>
                <StrategyData id={id} />
              </Stack>
            </XScrollbar>
          </Box>
          <CompareDrawer />
        </Grid2>
      </Grid2>
      <Loader small />
      <ChartConfigDrawer />
    </Box>
  );
};

export default StrategyDetails;
