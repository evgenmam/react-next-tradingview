import { useTheme } from "@mui/joy";
import { useMemo } from "react";
import { useRows } from "../../../hooks/data.hook";
import { useRangeSet } from "../context/range.context";

export const useTargetChartConfig = (set: string, height?: number) => {
  const { palette } = useTheme();
  const setRange = useRangeSet();
  const { rows, dataset } = useRows(set);
  const options: Highcharts.Options = useMemo(
    () => ({
      title: {
        text: dataset,
        floating: true,
        y: 20,
      },
      chart: {
        height,
      },
      series: [
        {
          name: dataset,
          type: "candlestick",
          data: rows.map(({ time, open, high, low, close }) => [
            time,
            open,
            high,
            low,
            close,
          ]),
          lineWidth: 1,
          upColor: palette.success[300],
          upLineColor: palette.success[400],
          color: palette.danger[400],
          lineColor: palette.danger[400],
          dataGrouping: {
            enabled: false,
          }
        },
      ],
      xAxis: {
        events: {
          setExtremes: (e) => {
            if (e.trigger !== "sync") setRange({ event: e, key: set });
          },
        },

        crosshair: {
          dashStyle: "Dash",
          label: {
            enabled: true,
            shape: "square",
            style: {
              textAlign: "right",
            },
            backgroundColor: palette?.background?.level1,
          },
        },
      },
      tooltip: {
        shared: true,
        split: false,
        borderWidth: 0,
        borderColor: "transparent",
        shape: "square",
        positioner: function () {
          return {
            x: 10,
            y: 10,
          };
        },
      },
      rangeSelector: {
        enabled: false,
      },
      yAxis: {
        crosshair: {
          dashStyle: "Dash",
          label: {
            enabled: true,
            shape: "square",
            style: {
              textAlign: "right",
            },
            backgroundColor: palette?.background?.level1,
          },
        },
      },
      navigator: {
        enabled: false,
      },
      scrollbar: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
    }),
    [height, rows, palette.text.primary, dataset]
  );
  return options;
};
