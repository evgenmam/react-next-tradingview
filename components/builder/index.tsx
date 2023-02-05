import { Box, Container, CssVarsProvider, Grid } from "@mui/joy";
import { ChartConfigDrawer } from "../v2/chart-config-drawer";
import { PointerWrapper } from "./context/pointer.context";
import { RangeWrapper } from "./context/range.context";
import { Markets } from "./markets";
import { MySignals } from "./my-signals";
import { Studies } from "./studies";
import { ChartEventWrapper } from "./context/events.context";
import { Loader } from "../utils/loader";
import { MyStrategies } from "./my-strategies";
import { HoverWrapper } from "../../hooks/hover.hook";
import XScrollbar from "../utils/scrollbars";
import { ChartRangeControls } from "./markets/chart-range-controls";

const TVBuilder = () => {
  return (
    <PointerWrapper>
      <RangeWrapper>
        <HoverWrapper>
          <Box overflow="hidden" height="100%" mx={-3}>
            <XScrollbar>
              <Box px={3} pb="100px">
                <ChartEventWrapper>
                  <Loader small />
                  <Grid container spacing={2}>
                    <Markets />
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <Studies />
                      <MySignals />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <MyStrategies withLink />
                    </Grid>
                  </Grid>
                  <ChartConfigDrawer />
                </ChartEventWrapper>
              </Box>
            </XScrollbar>
          </Box>
        </HoverWrapper>
        <ChartRangeControls />
      </RangeWrapper>
    </PointerWrapper>
  );
};

export default TVBuilder;
