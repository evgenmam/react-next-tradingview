import { Grid, GridProps, Typography } from "@mui/joy";
import { Stack } from "@mui/system";
import { TargetChart } from "./target-chart";

const G = (props: GridProps) => <Grid xs={12} md={4} sm={6} {...props} />;

export const Markets = () => {
  return (
    <>
      <Grid xs={12}>
        <Stack p={1}>
          <Typography>Markets</Typography>
        </Stack>
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
