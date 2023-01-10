import { Box } from "@mui/system";
import dynamic from "next/dynamic";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useRows } from "../../hooks/data.hook";
import { IChartData } from "../../types/app.types";
import ApexCharts from "apexcharts";
import { useApexChart } from "../../hooks/apex-chart.hook";
export const MainChart1 = ({
  rows,
  setActive,
}: {
  rows: string;
  setActive: (i: number) => void;
}) => {
  const d = JSON.parse(rows);

  const series: ApexAxisChartSeries = [
    {
      data: d.map((row: IChartData) => ({
        x: new Date(row.time * 1000),
        y: [row.open, row.high, row.low, row.close],
      })),
      type: "candlestick",
    },
  ];
  const options: ApexCharts.ApexOptions = {
    title: {
      text: "Trade history",
    },
    chart: {
      type: "candlestick",
      id: "candles",
      group: "mainchart",
      events: {
        mouseMove: (_, __, options) => {
          try {
            setActive(options.dataPointIndex);
          } catch (error) {
            console.log(error);
          }
        },
      },
      height: 350,
      width: "100%",
      animations: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        minWidth: 40,
      },
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false,
      },
    },
    tooltip: {
      custom: () => {
        return null;
      },
    },
    series,
  };
  const { elRef } = useApexChart(options);
  return <div id="candles" ref={elRef}></div>;
};

export const MainChart = memo(MainChart1);
