import { memo } from "react";
import { useIndicators, useRows } from "../../hooks/data.hook";
import { IChartData, IIndicator, IIndicatorField } from "../../types/app.types";
import { useApexChart } from "../../hooks/apex-chart.hook";
import { HChart, HStock } from "../hchart";
import Highcharts from "highcharts/highstock";
import * as R from "ramda";
import colors from "material-colors";

export const MainChart1 = ({
  setHover,
}: {
  rows: string;
  setHover: (i: number) => void;
}) => {
  const { rows } = useRows();
  const { indicators } = useIndicators();
  const { overlay = [], stack = [] } = R.groupBy<IIndicator>((v) =>
    v.main ? "overlay" : "stack"
  )(indicators);

  const chartH = 50;

  const additionsAxis: Highcharts.YAxisOptions[] = stack.map((v, idx) => {
    const h = (100 - chartH) / stack.length;
    const s = idx + 1;
    return {
      yAxis: s,
      height: `${h}%`,
      top: `${h * idx + chartH}%`,
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
          radius: 2.5
        }
      };
    })
  );

  const options: Highcharts.Options = {
    yAxis: [
      {
        height: `${stack.length ? chartH : 100 - chartH}%`,
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
        color: colors.red[500],
        upColor: colors.green[500],
        lineColor: colors.red[500],
        upLineColor: colors.green[500],
        name: "Market value",
      },
      ...additionalSeries,
    ],
    chart: {
      height: (stack.length + 1) * 300 + 120,
    },
    tooltip: {
      formatter: function (tooltip) {
        if (this.x && typeof this.x === "number") setHover(this.x);
        return false;
      },
    },

    // series: [
    //   {
    //     data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9],
    //   },
    // ],
  };
  console.log(options);

  return <HStock options={options} />;
};

export const MainChart = memo(MainChart1);
