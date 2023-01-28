import { useTheme } from "@mui/joy";
import Highcharts from "highcharts";
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
}) => {
  const { rows, dataset: dsname } = useRows("source");
  const colors = useTheme();

  const series: Highcharts.SeriesCandlestickOptions[] = [
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
  ];

  const yAxis: Highcharts.YAxisOptions[] = [
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

    getLabelAxis("source", dsname, 48, height),
  ];
  return { series, yAxis };
};
