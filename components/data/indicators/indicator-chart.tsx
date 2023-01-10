import { useRows } from "../../../hooks/data.hook";
import { IChartData, IIndicator } from "../../../types/app.types";

import dynamic from "next/dynamic";
import { Box } from "@mui/system";
import { memo } from "react";
import { useApexChart } from "../../../hooks/apex-chart.hook";

type Props = {
  indicator: IIndicator;
  rows: string;
};
export const IndicatorChart1 = ({ indicator, rows }: Props) => {
  const d = JSON.parse(rows);

  const series: ApexAxisChartSeries = indicator.fields.map((f) => ({
    name: f.key,
    data: d.map((row: IChartData) => ({
      x: new Date(row.time * 1000),
      y: row[f.key],
    })),
    type: f.type,
  }));

  const options: ApexCharts.ApexOptions = {
    title: {
      text: indicator.name,
    },
    chart: {
      animations: {
        enabled: false,
      },
      height: 250,
      type: "line",
      id: indicator.name,
      group: "mainchart",
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
    yaxis: {
      labels: {
        minWidth: 40,
      },
    },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        return null;
      },
    },
    series,
  };

  const { elRef } = useApexChart(options);

  return <div id={indicator.name} ref={elRef} />;
};

export const IndicatorChart = memo(IndicatorChart1);
