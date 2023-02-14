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

type Props = {
  open?: ISEvents;
  close?: ISEvents;
  rows?: IChartData[];
  trades?: ISTrade[];
};

const StrategyChartCC = (props: any) => <HStock {...props} />;
const StrategyChartC = memo(StrategyChartCC);

export const StrategyChart: FC<Props> = ({
  open = [],
  close = [],
  rows = [],
  trades = [],
}) => {
  const [event, setEvent] = useState<Highcharts.PointerEventObject | null>(
    null
  );
  const initSetter = (chart: Highcharts.Chart) => {
    chart.container.addEventListener("mousewheel", (e) =>
      chartZoomScroll(e as WheelEvent, chart, 0.2)
    );
    chart.container.addEventListener("mousemove", (e) => {
      const p = chart.pointer.normalize(e);
      setEvent(p);
    });
  };
  const ref = useRef(null);
  const options = useTradesChartConfig(rows, trades);
  useEffect(() => {
    console.log(event);
  }, [event]);
  return <StrategyChartC callback={initSetter} options={options} ref={ref} />;
};
