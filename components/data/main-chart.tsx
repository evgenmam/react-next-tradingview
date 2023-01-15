import { memo, useEffect, useRef } from "react";
import {
  useIndicators,
  useRows,
  useSettings,
  useSignals,
} from "../../hooks/data.hook";
import { IIndicator } from "../../types/app.types";
import { HStock } from "../hchart";
import Highcharts from "highcharts/highstock";
import * as R from "ramda";
import colors from "material-colors";
import { applySignal } from "../../utils/calculations";
import { useHoverSet } from "../../hooks/hover.hook";
import HighchartsReact from "highcharts-react-official";
import { useZoomSet } from "../../hooks/zoom.hook";

export const MainChart1 = () => {
  const chartRef = useRef<HighchartsReact.RefObject | null>(null);
  const { rows } = useRows("source");
  const { signals } = useSignals();
  const { indicators } = useIndicators();
  const { showSignals } = useSettings();
  const { overlay = [], stack = [] } = R.groupBy<IIndicator>((v) =>
    v.main ? "overlay" : "stack"
  )(indicators);

  const setHover = useHoverSet();
  const setZoom = useZoomSet();

  const chartH = 400;
  const indxPercent = 0.4;

  const additionsAxis: Highcharts.YAxisOptions[] = stack.map((v, idx) => {
    const h = chartH * indxPercent;
    const s = idx + 1;
    return {
      yAxis: s,
      height: h,
      top: h * s + (chartH - h),
    };
  });

  const additionalSeries: (Highcharts.SeriesOptions & { type: any })[] = [
    ...stack,
    ...overlay,
  ].flatMap((v, idx) =>
    v.fields.map((f) => {
      switch (f.type) {
        case "scatter":
          return {
            yAxis: v.main ? 0 : idx + 1,
            type: "spline",
            color: f.color,
            data: rows.map((row) => [row.time, row[f.key]]),
            name: f.key,
            lineWidth: 0,
            marker: {
              enabled: true,
              symbol: "circle",
              radius: 2.5,
            },
            states: {
              hover: {
                lineWidthPlus: 0,
              },
            },
          };
        default:
          return {
            yAxis: v.main ? 0 : idx + 1,
            type: f.type as any,
            color: f.color,
            data: rows.map((row) => [row.time, row[f.key]]),
            name: f.key,
            marker: {
              symbol: "circle",
              radius: 2.5,
            },
          };
      }
    })
  );

  const signalMarkers = showSignals
    ? signals
        .filter((v) => !v.hide)
        .flatMap(applySignal(rows))
        .flatMap(({ data, signal }) =>
          data.map((v) => ({
            x: v.time,
            color: signal.color,
            value: v.time,
          }))
        )
        .sort((a, b) => a.x - b.x)
    : [];

  const options: Highcharts.Options = {
    yAxis: [
      {
        height: chartH,
      },
      ...additionsAxis,
    ],
    plotOptions: {
      series: {
        events: {
          mouseOut: () => {
            setHover(-1);
          },
        },
      },
    },
    global: {},

    series: [
      {
        type: "candlestick",
        data: rows.map((row) => [
          row.time,
          row.open,
          row.high,
          row.low,
          row.close,
        ]),
        color: colors.red[400],
        upColor: colors.green[400],
        lineColor: colors.red[700],
        upLineColor: colors.green[700],
        name: "Market value",
        tooltip: {},
      },
      // {
      //   type: "flags",
      //   data: signalMarkers,
      // },
      ...additionalSeries,
    ],

    chart: {
      height: stack.length * (chartH * indxPercent) + chartH + 180,
    },
    accessibility: {
      enabled: false,
    },
    tooltip: {
      formatter: function (tooltip) {
        if (this.x && typeof this.x === "number") setHover(this.x);
        return [this.x ? new Date(this.x).toLocaleString() : null];
      },
      split: true,
      outside: true,
    },
    xAxis: {
      plotLines: [...signalMarkers],
      crosshair: {
        width: 3,
      },
      events: {
        setExtremes: (e) => {
          if (e.trigger === "syncExtremes") return;
          setZoom({ min: e.min, max: e.max });
        },
      },
    },
  };

  return <HStock options={options} ref={chartRef} />;
};

export const MainChart = memo(MainChart1);
