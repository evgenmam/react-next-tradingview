import { Grid, GridProps, Typography } from "@mui/joy";
import { Stack } from "@mui/system";
import { Space } from "../utils/row";
import { ChartRangeControls } from "./markets/chart-range-controls";
import { SyncControls } from "./markets/sync-controls";
import { TargetChart } from "./target-chart";

const G = (props: GridProps) => <Grid xs={12} md={4} sm={6} {...props} />;

export const Markets = () => {
  return (
    <>
      <Grid xs={12}>
        <Space p={1} sb c pr={16}>
          <Typography>Markets</Typography>
          <SyncControls />
        </Space>
      </Grid>
      <G>
        <TargetChart set="source" />
      </G>
      <G>
        <TargetChart set="target" />
      </G>
      <G>
        <TargetChart set="target2" />
      </G>
    </>
  );
};
