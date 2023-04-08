import Highcharts from "highcharts/highstock";

export type IChartData = {
  close: number;
  open: number;
  high: number;
  low: number;
  time: number;
  dataset: string;
  period: number;
} & Record<string, number>;

export type ISettings = {
  hideEmpty: boolean;
  maxDigits: number;
  fetching: boolean;
};

export type IIndicatorField = {
  key: string;
  type: Highcharts.Series["type"];
  color?: string;
  props?: Record<string, any>;
  hide?: boolean;
};

export type IIndicator = {
  name: string;
  fields: IIndicatorField[];
  dataset: string;
  main: boolean;
  height?: number;
};

export type IField = { key: string; isNull: boolean; dataset: string };

export type IConditionEntry = {
  type: "field" | "number";
  field?: string;
  value?: number;
  offset?: number;
};

export type ICondition = {
  a: IConditionEntry;
  b?: IConditionEntry;
  operator:
    | "crossesUp"
    | "crossesDown"
    | "equals"
    | "greater"
    | "less"
    | "greaterOrEqual"
    | "lessOrEqual"
    | "true"
    | "notEqual";
  next?: "AND" | "OR";
  offset?: number;
  color?: string;
};

export type IConditionGroup = {
  conditions: ICondition | IConditionGroup;
  operator?: "and" | "or";
};

export type ISignal = {
  condition: ICondition[];
  preview?: boolean;
  id?: number;
  color?: string;
  hide?: boolean;
  name?: string;
};

export type IStrategy = {
  openSignal?: ISignal;
  closeSignal?: ISignal;
  hide?: boolean;
  dataset?: string;
  id?: number;
  color?: string;
  direction: "long" | "short";
  entry?: number;
  openOn?: "open" | "close";
  closeOn?: "open" | "close";
  usd?: number;
  scripts?: Record<string, string>;
  takeProfit?: number;
  stopLoss?: number;
};

export type IBaseTrade = {
  action: "open" | "close";
  close?: boolean;
  long?: boolean;
  short?: boolean;
  open?: boolean;
  time: number;
  strategy: IStrategy;
};

export type IBaseTradePack = {
  open: IBaseTrade[];
  close: IBaseTrade[];
};

export type ITrade = {
  color?: string;
  pnl?: number;
  pnlRate?: number;
  short: boolean;
  duration?: number;
  openPrice: number;
  closePrice?: number;
  opened: number;
  closed?: number;
  strategy: IStrategy;
  runup?: number;
  drawdown?: number;
  runupRate?: number;
  drawdownRate?: number;
  highestPrice?: number;
  lowestPrice?: number;
  highest?: number;
  lowest?: number;
  totalIn?: number;
  totalOut?: number;
  count?: number;
};

export type ITradeWithTotals = ITrade & {
  totalPnl: number;
  moneyIn?: number;
};
