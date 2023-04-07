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
import { BNumberInput } from "../utils/number-input";
import { useSettings } from "../../hooks/settings.hook";

const StrategyDetails = () => {
  const [id, setId] = useQueryState("id", queryTypes.integer.withDefault(0));
  const [, setCompare] = useQueryState(
    "compare",
    queryTypes.boolean.withDefault(false)
  );
  const { takeProfit, setTakeProfit, stopLoss, setStopLoss } = useSettings();
  return (
    <Box>
      <Grid2 container columnSpacing={2}>
        <Grid2 xs={12} sm={4}>
          <Box height="100vh" overflow="hidden">
            <XScrollbar>
              <Box px={2}>
                <MyStrategies selected={id} onSelect={setId} useTpLs />
              </Box>
            </XScrollbar>
          </Box>
        </Grid2>
        <Grid2 xs={12} sm={8}>
          <Box height="100vh" overflow="hidden" mx={-2} px={2}>
            <XScrollbar>
              <Stack spacing={1} pt={1}>
                <Space justifyContent="start" s={2}>
                  <Button
                    onClick={() => setCompare(true)}
                    size="sm"
                    variant="plain"
                    disabled={!id}
                  >
                    Compare Mode
                  </Button>
                  <BNumberInput
                    suffix="%"
                    value={takeProfit}
                    onChange={setTakeProfit}
                    label="Take Profit"
                  />
                  <BNumberInput
                    suffix="%"
                    value={stopLoss}
                    onChange={setStopLoss}
                    label="Stop Loss"
                  />
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
