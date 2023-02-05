import { FC } from "react";
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

export const StrategyChart: FC<Props> = ({
  open = [],
  close = [],
  rows = [],
  trades = [],
}) => {
  const initSetter = (chart: Highcharts.Chart) => {
    chart.container.addEventListener("mousewheel", (e) =>
      chartZoomScroll(e as WheelEvent, chart, 0.2)
    );
  };
  const options = useTradesChartConfig(rows, trades);
  return <HStock options={options} callback={initSetter} />;
};
