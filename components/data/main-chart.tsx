import { memo } from "react";
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

export const MainChart1 = ({
  setHover,
}: {
  rows: string;
  setHover: (i: number) => void;
}) => {
  const { rows } = useRows("source");
  const { signals } = useSignals();
  const { indicators } = useIndicators();
  const { showSignals } = useSettings();
  const { overlay = [], stack = [] } = R.groupBy<IIndicator>((v) =>
    v.main ? "overlay" : "stack"
  )(indicators);

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
      formatter: function (tooltip) {
        if (this.x && typeof this.x === "number") setHover(this.x);
        return [this.x ? new Date(this.x).toDateString() : ""];
      },
    },
    xAxis: {
      plotLines: showSignals
        ? signals
            .filter((v) => !v.hide)
            .flatMap(applySignal(rows))
            .flatMap(({ data, signal }) =>
              data.map((v) => ({
                value: v.time,
                color: signal.color,
                width: 2,
              }))
            )
        : [],
    },
  };

  console.log();

  return <HStock options={options} />;
};

export const MainChart = memo(MainChart1);
