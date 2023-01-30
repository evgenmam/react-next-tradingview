import { useTheme } from "@mui/joy";
import Highcharts from "highcharts";
import { useMemo } from "react";
import { getLabelAxis, getNextLabel } from "../../utils/chart.utils";
import { useRows } from "../data.hook";

export const useChartData = ({
  height = 400,
  dataset = "source",
  top = 0,
  next,
  nextLabel,
}: {
  height?: Highcharts.YAxisOptions["height"];
  dataset?: string;
  top?: Highcharts.YAxisOptions["top"];
  next?: string[];
  nextLabel?: string;
}): [
  s: {
    series: Highcharts.SeriesCandlestickOptions[];
    yAxis: Highcharts.YAxisOptions[];
  },
  l: boolean
] => {
  const { rows, dataset: dsname, loading } = useRows(dataset);
  const colors = useTheme();

  const series: Highcharts.SeriesCandlestickOptions[] = useMemo(
    () => [
      {
        type: "candlestick",
        data: rows.map((row) => [
          row.time,
          row.open,
          row.high,
          row.low,
          row.close,
        ]),
        color: colors.palette.danger.outlinedColor,
        upColor: colors.palette.success.outlinedColor,
        lineColor: colors.palette.danger.outlinedColor,
        upLineColor: colors.palette.success.outlinedColor,
        name: dataset,
        yAxis: dataset,
        label: {
          enabled: true,
        },
      },
    ],
    [rows, dataset, colors.palette]
  );

  const yAxis: Highcharts.YAxisOptions[] = useMemo(
    () => [
      {
        id: dataset,
        height,
        top,
        ...(next && {
          resize: {
            enabled: true,
            controlledAxis: { next },
          },
        }),
      },
      getLabelAxis(dataset, dsname, top),
    ],
    [dataset, dsname, height, top, next]
  );
  return [{ series, yAxis }, loading];
};
