import { useTheme } from "@mui/joy";
import Highcharts from "highcharts";
import { useMemo } from "react";
import { getLabelAxis } from "../../utils/chart.utils";
import { useRows } from "../data.hook";

export const useSourceData = ({
  height = 500,
  next,
  top = 0,
}: {
  height?: Highcharts.YAxisOptions["height"];
  next?: string[];
  top?: Highcharts.YAxisOptions["top"];
}): [
  s: {
    series: Highcharts.SeriesCandlestickOptions[];
    yAxis: Highcharts.YAxisOptions[];
  },
  l: boolean
] => {
  const { rows, dataset: dsname, loading } = useRows("source");
  const colors = useTheme();

  const series: Highcharts.SeriesCandlestickOptions[] = useMemo(
    () => [
      {
        type: "candlestick",
        data: rows.map((row) => ({
          x: row.time,
          open: row.open,
          high: row.high,
          low: row.low,
          close: row.close,
          id: `s${row.time}`,
        })),
        color: colors.palette.danger.outlinedColor,
        upColor: colors.palette.success.outlinedColor,
        lineColor: colors.palette.danger.outlinedColor,
        upLineColor: colors.palette.success.outlinedColor,
        name: "source",
        tooltip: {},
        yAxis: "source",
        id: "source-ds",
      },
    ],
    [rows, colors.palette]
  );

  const yAxis: Highcharts.YAxisOptions[] = useMemo(
    () => [
      {
        id: "source",
        height,
        top,
        ...(next && {
          resize: {
            enabled: true,
            controlledAxis: { next },
          },
        }),
      },

      // @ts-ignore
      getLabelAxis("source", dsname, 48, 30),
    ],
    [height, top, next, dsname]
  );
  return [{ series, yAxis }, loading];
};
