import { useTheme } from "@mui/joy";
import { useMemo } from "react";
import { IChartData } from "../../../types/app.types";
import { ISTrade } from "./strategy-trades";
import * as R from "ramda";
import { CLOSING } from "ws";

export const useTradesChartConfig = (rows: IChartData[], trades: ISTrade[]) => {
  const { palette } = useTheme();
  const options: Highcharts.Options = useMemo(
    () => ({
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
            x: low.time,
            y: low.low,
            dataLabels: {
              formatter: () => "asdf",
              verticalAlign: "top",
              shape: "callout",
            },
          } as Highcharts.PointOptionsObject;
          const h = { x: high.time, y: high.high };

          return {
            data: [
              { x: open.time, y: open.close },
              high.time <= low.time ? h : l,
              ...(close ? [{ x: close.time, y: close.close }] : []),
              high.time >= low.time ? h : l,
              { x: open.time, y: open.close },
            ],
            type: "polygon" as const,
            name: `${b.pnl?.label}<br />${b.length} bars `,
            color: color + "80",
            style: {},
            // opacity: 0.4,
            lineColor: !close
              ? palette.danger?.[500]
              : close?.close > open?.close
              ? palette.success?.[500]
              : palette.danger?.[500],
            state: {
              hover: {
                lineWidthPlus: 3,
              },
            },
          };
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
    [rows, trades, palette]
  );
  return options;
};
