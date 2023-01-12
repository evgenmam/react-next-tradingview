import { Divider, Grid, Stack } from "@mui/joy";
import { Box } from "@mui/system";
import dynamic from "next/dynamic";
import { memo, useState } from "react";
import { useThrottledCallback } from "use-debounce";
import { useRows } from "../../hooks/data.hook";
import { ChartData } from "./chart-data";
import { TargetChart } from "./target-chart";

export const TargetData1 = () => {
  const { rows } = useRows("target");
  const [active, s] = useState(rows.length - 1);
  const setActive = useThrottledCallback((i: number) => {
    s(i);
  }, 50);

  return (
    <Box mt={2}>
      <Grid container spacing={2} columns={24}>
        <Grid xs={24} md={19}>
          {rows.length && (
            <TargetChart rows={JSON.stringify(rows)} setHover={setActive} />
          )}
        </Grid>
        <Grid xs={24} md={5}>
          <Stack flexShrink={0} spacing={2}>
            <ChartData datasource="target" />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export const TargetData = memo(TargetData1);
