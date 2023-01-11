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

export const TargetChart1 = ({
  setHover,
}: {
  rows: string;
  setHover: (i: number) => void;
}) => {
  const { rows } = useRows("target");

  const chartH = 300;

  const options: Highcharts.Options = {
    yAxis: [
      {
        height: chartH + 100 + "px",
        resize: {
          enabled: true,
        },
      },
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
    ],
    chart: {
      height: 600,
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
    xAxis: {},
  };

  return <HStock options={options} />;
};

export const TargetChart = memo(TargetChart1);
