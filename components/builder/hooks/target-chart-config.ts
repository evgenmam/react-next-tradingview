import { useTheme } from "@mui/joy";
import { useMemo } from "react";
import { useRows } from "../../../hooks/data.hook";
import { useRangeSet } from "../context/range.context";
import { useBarColorers } from "./study-chart/bar-colorers";
import * as R from "ramda";

export const useTargetChartConfig = (set: string, height?: number) => {
  const { palette } = useTheme();
  const setRange = useRangeSet();
  const { rows, dataset } = useRows(set);
  const colorers = useBarColorers();
  const isSource = set === "source";
  const indColorers = useMemo(
    () =>
      isSource
        ? R.groupBy<any, string>(
            R.prop("value"),
            colorers?.filter((v) => !v?.hidden)
          )
        : {},
    [colorers, isSource]
  );

  const options: Highcharts.Options = useMemo(
    () => ({
      title: {
        text: dataset,
        floating: true,
        y: 20,
      },
      chart: {
        height,
        marginLeft: 0,
        marginRight: 0,
      },
      series: [
        {
          name: dataset,
          type: "candlestick",
          data: rows.map(({ time, open, high, low, close }) => ({
            close,
            high,
            low,
            open,
            x: time,
            ...(indColorers?.[time] && {
              color: indColorers?.[time]?.[0]?.color,
            }),
            label: indColorers?.[time]
              ?.map(
                ({ label, color }) =>
                  `<div><svg viewBox="0 0 8 8" width="8" height="8"><circle cx="4" cy="4" r="4" fill="${color}"/></svg> ${label}</div>`
              )
              .join(""),
          })),
          tooltip: {
            footerFormat: "{point.label}",
          },
          lineWidth: 1,
          upColor: palette.success[300],
          upLineColor: palette.success[400],
          color: palette.danger[400],
          lineColor: palette.danger[400],
          dataGrouping: {
            enabled: false,
          },
        },
      ],
      pane: {
        size: "50%",
      },
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
        useHTML: true,
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
    [
      height,
      rows,
      dataset,
      indColorers,
      palette?.background?.level1,
      palette.danger,
      palette.success,
      set,
      setRange,
    ]
  );
  return options;
};
