import { Grid } from "@mui/joy";
import { ChartConfigDrawer } from "../v2/chart-config-drawer";
import { PointerWrapper } from "./context/pointer.context";
import { RangeWrapper } from "./context/range.context";
import { Markets } from "./markets";
import { MySignals } from "./my-signals";
import { Studies } from "./studies";
import { ChartEventWrapper } from "./context/events.context";

const TVBuilder = () => {
  return (
    <PointerWrapper>
      <RangeWrapper>
        <ChartEventWrapper>
          <Grid container spacing={2}>
            <Markets />
          </Grid>
          <Studies />
          <Grid container spacing={2}>
            <MySignals />
          </Grid>
          <ChartConfigDrawer />
        </ChartEventWrapper>
      </RangeWrapper>
    </PointerWrapper>
  );
};

export default TVBuilder;
