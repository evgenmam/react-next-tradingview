import { FC, memo, useState, useRef, useEffect } from "react";
import { IChartData } from "../../types/app.types";
import { HChart, HStock } from "../hchart";
import { ISEvents } from "./hooks/signal-events";
import * as R from "ramda";
import { CLOSING } from "ws";
import { useTheme } from "@mui/joy";
import { chartZoomScroll } from "../../utils/chart.utils";
import { ISTrade } from "./hooks/strategy-trades";
import { useTradesChartConfig } from "./hooks/trades-chart-config";
import { useEventEmitter } from "ahooks";
import HighchartsReact from "highcharts-react-official";
import { EventEmitter } from "ahooks/lib/useEventEmitter";

type Props = {
  open?: ISEvents;
  close?: ISEvents;
  rows?: IChartData[];
  trades?: ISTrade[];
  emitter: EventEmitter<string[]>;
  clicker: EventEmitter<string>;
  dataset: string;
};

const StrategyChartCC = (props: any) => {
  return <HStock {...props} ref={props.chartRef} />;
};
const StrategyChartC = memo(StrategyChartCC);

export const StrategyChart: FC<Props> = ({
  open = [],
  close = [],
  rows = [],
  trades = [],
  emitter,
  clicker,
  dataset,
}) => {
  const ref = useRef<HighchartsReact.RefObject>(null);
  const initSetter = (chart: Highcharts.Chart) => {
    chart.container.addEventListener("mousewheel", (e) =>
      chartZoomScroll(e as WheelEvent, chart, 0.2)
    );
    chart.container.addEventListener("mousemove", (e) => {
      const p = chart.pointer.normalize(e);
      const point = chart.series[0].searchPoint(p, true);
      if (point) {
        const series = chart?.series
          ?.filter(
            (s) =>
              s.type === "polygon" &&
              Math.min(...s?.points?.map((v) => v.x)) <= point?.x &&
              Math.max(...s?.points?.map((v) => v.x)) >= point?.x
          )
          .map((s) => s.options.id!);
        emitter.emit(series);
      }
    });
  };
  const options = useTradesChartConfig(rows, trades, dataset);
  emitter.useSubscription((row) => {
    ref?.current?.chart?.series?.forEach((s) => {
      s?.setState("normal", true);
      if (row.includes(s.options.id!)) {
        s?.setState("hover", true);
      }
    });
  });
  clicker.useSubscription((row) => {
    const s = ref?.current?.chart?.series?.find((s) => s.options?.id === row);
    if (s) {
      const start = Math.min(...(s?.points?.map((v) => v.x) || []));
      const end = Math.max(...(s?.points?.map((v) => v.x) || []));

      if (start && end !== -Infinity) {
        ref?.current?.chart?.xAxis[0].setExtremes(
          start - (end - start) / 8,
          end + (end - start) / 8
        );
        s.setState("normal", true);
        s.setState("hover", true);
      }
    }
  });
  return (
    <StrategyChartC callback={initSetter} options={options} chartRef={ref} />
  );
};
