import { CLOSING } from "ws";
import { IChartData, IStrategy } from "../../../types/app.types";
import { ISOpenClose } from "./signal-events";
import * as R from "ramda";
import { cur, val } from "../../../utils/number.utils";
import { useSettings } from "../../../hooks/settings.hook";
import * as D from "date-fns";

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
  openPrice: number;
};

export const useStrategyTrades = (
  { open, close }: ISOpenClose,
  rows: IChartData[] = [],
  strategy?: IStrategy
): ISTrade[] => {
  const c = useSettings();
  const trades = Object.keys(open || {})
    .map((k) => {
      const closed = Object.keys(close || {}).find((c) => c > k);
      const bars = rows.filter(
        (r) => r.time >= +k && (!closed || r.time <= +closed)
      );
      if (!bars.length) return {};

      const high = bars.reduce(R.maxBy(R.propOr(0, "high")), bars[0]);
      const low = bars.reduce(R.minBy(R.propOr(Infinity, "low")), bars[0]);
      const openPrice = val(bars[0]?.close || 0);
      const closePrice = val(bars.at(-1)?.close || 0);
      const openTotal = val(
        strategy?.usd || (strategy?.entry || 1) * openPrice
      );
      const contracts = val(
        strategy?.usd ? openTotal / openPrice : strategy?.entry || 1
      );
      const closeTotal = val(contracts * closePrice);
      const pnl = val(closeTotal - openTotal);
      const symbol = c[strategy?.dataset as keyof typeof c]?.split?.(":")?.[1];
      const openTime = new Date(bars[0].time);
      const cc = bars.at(-1)?.time;
      const closeTime = cc ? new Date(cc) : new Date();
      return {
        open: bars[0],
        close: bars.at(-1),
        high,
        low,
        length: bars.length,
        closed: !!closed,
        openPrice,
        closePrice,
        openTotal,
        closeTotal,
        contracts,
        volume: `${contracts} ${symbol}`,
        symbol,
        diff: D.formatDistanceStrict(openTime, closeTime),
        pnl: {
          value: pnl,
          label: cur(pnl),
          percent: val(pnl / openTotal),
        },
        drawDown: {},
      };
    })
    .filter((t) => t.open);
  return trades;
};
