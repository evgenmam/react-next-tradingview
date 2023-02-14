import { useTheme } from "@mui/joy";
import { useMemo } from "react";
import { IChartData } from "../../../types/app.types";
import { ISTrade } from "./strategy-trades";
import * as R from "ramda";
import { CLOSING } from "ws";

export const useTradesChartConfig = (
  rows: IChartData[],
  trades: ISTrade[],
  dataset: string
) => {
  const { palette } = useTheme();
  const options: Highcharts.Options = useMemo(
    () => ({
      title: {
        text: dataset,
      },
      series: [
        {
          data: rows.map(({ time, ...d }) => {
            // const color = open[time]
            //   ? palette?.success?.[200]
            //   : close[time]
            //   ? palette?.danger?.[200]
            //   : palette?.neutral?.[800];
            const color = palette?.neutral?.[800];
            return {
              x: time,
              ...R.pick(["open", "high", "low", "close"])(d),
              color,
              upColor: color,
              lineColor: color,
              upLineColor: color,
            };
          }),
          states: {
            hover: {
              lineWidthPlus: 3,
            },
            inactive: {
              opacity: 0.9,
            },
          },
          dataGrouping: { enabled: false },
          showInLegend: false,
          type: "candlestick" as const,
        },

        ...trades.map(({ open, close, high, low, ...b }) => {
          const color = !close
            ? palette.danger?.[500]
            : close?.close > open?.close
            ? palette.success?.[500]
            : palette.danger?.[500];
          const l = {
            x: low?.time,
            y: low?.low,
            dataLabels: {
              formatter: () => "asdf",
              verticalAlign: "top",
              shape: "callout",
            },
          } as Highcharts.PointOptionsObject;

          return {
            id: b.id,
            data: [
              { x: open?.time, y: open?.close, name: "4" },
              { x: high?.time, y: high?.high, name: "1" },
              { x: close?.time, y: close?.close, name: "2" },
              { x: low?.time, y: low?.low, name: "3" },
            ],
            type: "polygon" as const,
            name: `${b.pnl?.value}<br />${b.length} bars `,
            color: color + "80",

            lineColor: !close
              ? palette.danger?.[500]
              : close?.close > open?.close
              ? palette.success?.[500]
              : palette.danger?.[500],
            states: {
              hover: {
                lineWidthPlus: 3,
              },
              inactive: {
                opacity: 0.9,
              },
            },
          } as Highcharts.SeriesPolygonOptions;
        }),
      ],
      navigator: {
        enabled: false,
      },
      scrollbar: {
        enabled: false,
      },
      rangeSelector: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        range: (rows?.at?.(-1)?.time || 1) - (rows?.at?.(0)?.time || 0),
      },
      legend: {
        enabled: true,
      },
    }),
    [rows, trades, palette, dataset]
  );
  return options;
};
