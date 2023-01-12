import { memo, useEffect, useRef } from "react";
import {
  useIndicators,
  useRows,
  useSetting,
  useSettings,
  useSignals,
} from "../../hooks/data.hook";
import { IChartData, IIndicator, IIndicatorField } from "../../types/app.types";
import { useApexChart } from "../../hooks/apex-chart.hook";
import { HChart, HStock } from "../hchart";
import Highcharts from "highcharts/highstock";
import * as R from "ramda";
import colors from "material-colors";
import { applySignal } from "../utils/calculations";
import { useHoverSet } from "../../hooks/hover.hook";
import HighchartsReact from "highcharts-react-official";
import { syncExtremes } from "../../utils/chart.utils";
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

  const chartH = 300;

  const additionsAxis: Highcharts.YAxisOptions[] = stack.map((v, idx) => {
    const h = chartH;
    const s = idx + 1;
    return {
      yAxis: s,
      height: `${h}px`,
      top: `${h * idx + chartH + 100}px`,
      resize: { enabled: true },
    };
  });

  const additionalSeries: (Highcharts.SeriesOptions & { type: any })[] = [
    ...stack,
    ...overlay,
  ].flatMap((v, idx) =>
    v.fields.map((f) => {
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
    })
  );

  const signalMarkers = showSignals
    ? signals
        .filter((v) => !v.hide)
        .flatMap(applySignal(rows))
        .flatMap(({ data, signal }) =>
          data.map((v) => ({
            x: v.time,
            title: " ",
            shape: "circlepin",
            color: signal.color,
            fillColor: signal.color,
          }))
        )
        .sort((a, b) => a.x - b.x)
    : [];

  const options: Highcharts.Options = {
    yAxis: [
      {
        height: chartH + 100 + "px",
        resize: {
          enabled: true,
        },
      },
      ...additionsAxis,
    ],
    plotOptions: {
      series: {
        dataGrouping: { enabled: false },
      },
    },
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
        color: colors.red[100],
        upColor: colors.green[100],
        lineColor: colors.red[700],
        upLineColor: colors.green[700],
        name: "Market value",
        tooltip: {},
      },
      {
        type: "flags",
        data: signalMarkers,
      },
      ...additionalSeries,
    ],

    chart: {
      height: (stack.length + 1) * 300 + 100 + 100,
    },
    accessibility: {
      enabled: false,
    },
    tooltip: {
      // enabled: true,
      // split: false,
      shared: false,
    },
    // tooltip: {
    //   // formatter: function (tooltip) {
    //   //   if (this.x && typeof this.x === "number") setHover(this.x);
    //   //   return [];
    //   // },
    //   // outside: true,
    // },

    xAxis: {
      events: {
        setExtremes: (e) => {
          if (e.trigger === "syncExtremes") return;
          setZoom({ min: e.min, max: e.max });
        },
      },

      // plotLines: showSignals
      //   ? signals
      //       .filter((v) => !v.hide)
      //       .flatMap(applySignal(rows))
      //       .flatMap(({ data, signal }) =>
      //         data.map((v) => ({
      //           value: v.time,
      //           color: signal.color,
      //           width: 2,
      //         }))
      //       )
      //   : [],
    },
  };

  return <HStock options={options} ref={chartRef} />;
};

export const MainChart = memo(MainChart1);
