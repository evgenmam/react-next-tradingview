import { Divider, Grid, Stack, Typography } from "@mui/joy";
import { Box } from "@mui/system";
import dynamic from "next/dynamic";
import { memo, useCallback, useEffect, useState } from "react";
import { useThrottledCallback } from "use-debounce";
import {
  useFields,
  useIndicators,
  useRows,
  useSettings,
} from "../../hooks/data.hook";
import { IChartData } from "../../types/app.types";
import { ChartData } from "./chart-data";
import { Indicators } from "./indicators";
import { IndicatorChart } from "./indicators/indicator-chart";
import { MainChart } from "./main-chart";

export const DataChart1 = () => {
  const { rows } = useRows();
  const [active, s] = useState(rows.length - 1);
  const setActive = useThrottledCallback((i: number) => {
    s(i);
  }, 50);

  return (
    <Box>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" />}
        spacing={2}
      >
        {rows.length && (
          <Box flexGrow={1} id="wrapper">
            <MainChart rows={JSON.stringify(rows)} setHover={setActive} />
          </Box>
        )}
        <Stack flexShrink={0} spacing={2}>
          <ChartData active={active} />
          <Indicators />
        </Stack>
      </Stack>
    </Box>
  );
};

export const DataChart = memo(DataChart1);
