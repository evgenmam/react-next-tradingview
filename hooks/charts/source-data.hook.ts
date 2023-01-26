import { useTheme } from "@mui/joy";
import Highcharts from "highcharts";
import { useRows } from "../data.hook";

export const useSourceData = ({
  height = 500,
  next,
}: {
  height?: Highcharts.YAxisOptions["height"];
  next?: string[];
}) => {
  const { rows, dataset: dsname } = useRows("source");
  const colors = useTheme();

  const series: Highcharts.SeriesCandlestickOptions[] = [
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
      name: "source",
      tooltip: {},
      yAxis: "source",
    },
  ];

  const yAxis: Highcharts.YAxisOptions[] = [
    {
      id: "source",
      height,

      ...(next && {
        resize: {
          enabled: true,
          controlledAxis: { next },
        },
      }),
    },
  ];
  return { series, yAxis };
};
