import { CLOSING } from "ws";
import { IChartData } from "../../../types/app.types";
import { ISOpenClose } from "./signal-events";
import * as R from "ramda";
import { cur } from "../../../utils/number.utils";

type N = {
  value: number;
  label: string;
};
export type ISTrade = {
  open: IChartData;
  close?: IChartData;
  high: IChartData;
  low: IChartData;
  length: number;
  pnl?: N;
};

export const useStrategyTrades = (
  { open, close }: ISOpenClose,
  rows: IChartData[]
): ISTrade[] => {
  const trades = Object.keys(open || {})
    .map((k) => {
      const closed = Object.keys(close || {}).find((c) => c > k);
      const bars = rows.filter(
        (r) => r.time >= +k && (!closed || r.time <= +closed)
      );

      const high = bars.reduce(R.maxBy(R.propOr(0, "high")), bars[0]);
      const low = bars.reduce(R.minBy(R.propOr(Infinity, "low")), bars[0]);
      const pnl =
        Math.floor(((bars.at(-1)?.close || 0) - (bars[0]?.close || 0)) * 100) /
        100;
      return {
        open: bars[0],
        close: bars.at(-1),
        high,
        low,
        length: bars.length,
        closed: !!closed,
        pnl: {
          value: pnl,
          label: cur(pnl),
        },
        drawDown: {},
      };
    })
    .filter((t) => t.open);
  return trades;
};
