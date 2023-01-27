import { useTheme } from "@mui/joy";
import Highcharts from "highcharts";
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
}) => {
  const { rows, dataset: dsname } = useRows(dataset);
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
      name: dataset,
      yAxis: dataset,
      label: {
        enabled: true,
      },
    },
  ];

  const yAxis: Highcharts.YAxisOptions[] = [
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
  ];
  return { series, yAxis };
};
