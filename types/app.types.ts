import Highcharts from "highcharts/highstock";

export type IChartData = {
  close: number;
  open: number;
  high: number;
  low: number;
  time: number;
  [key: string]: number;
};

export type ISettings = {
  hideEmpty: boolean;
  maxDigits: number;
};

export type IIndicatorField = {
  key: string;
  type: Highcharts.Series["type"];
  // | "histogram"
  // | "pie"
  // | "donut"
  // | "radialBar"
  // | "scatter"
  // | "bubble"
  // | "heatmap"
  // | "treemap"
  // | "boxPlot"
  // | "candlestick"
  // | "radar"
  // | "polarArea"
  // | "rangeBar";
  color?: string;
  props?: Record<string, any>;
};

export type IIndicator = {
  name: string;
  fields: IIndicatorField[];
  main: boolean;
};

export type IField = { key: string; isNull: boolean };
