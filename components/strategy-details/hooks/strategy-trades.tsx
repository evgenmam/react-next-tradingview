import { CLOSING } from "ws";
import { IChartData, IStrategy } from "../../../types/app.types";
import { ISEvents, ISOpenClose } from "./signal-events";
import * as R from "ramda";
import { cur, val } from "../../../utils/number.utils";
import { useSettings } from "../../../hooks/settings.hook";
import * as D from "date-fns";
import { v4 } from "uuid";

type N = {
  value: number;
  percent: number;
  cumulative: number;
};
type DD = {
  value: number;
  // label: string;
  // percent: number;
};
export interface ISTrade {
  close?: IChartData;
  closed?: boolean;
  closePrice?: number;
  closeTotal?: number;
  contracts?: number;
  diff?: string;
  high?: IChartData;
  length?: number;
  low?: IChartData;
  open: IChartData;
  openPrice: number;
  openTotal: number;
  pnl?: N;
  symbol?: string;
  volume?: string;
  cumulative?: DD;
  invested?: number;
  openTrades?: number;
  id?: string;
}

const toInterval = (t: ISTrade): D.Interval => ({
  start: t.open?.time,
  end: t?.close?.time || new Date(),
});

const isOverlapping = R.curry((a: ISTrade, b: ISTrade) =>
  D.areIntervalsOverlapping(toInterval(a), toInterval(b))
);

export const useStrategyTrades = (
  { open = {}, close = {} }: ISOpenClose,
  rows: IChartData[] = [],
  strategy?: IStrategy
): ISTrade[] => {
  const c = useSettings();
  if (!open) return [];
  const trades = R.pipe<ISEvents[], number[], ISTrade[]>(
    R.keys<ISEvents>,
    R.reduce<number, ISTrade[]>((v, k) => {
      const closed = R.keys(close).find((c) => c > k);
      const firstBarIdx = rows.findIndex((r) => r.time >= +k);
      if (firstBarIdx < 0) return v;
      const lastBarIdx = rows.findIndex((r) => closed && r.time >= +closed);
      const bars: IChartData[] = rows.slice(firstBarIdx + 1, lastBarIdx + 1);
      if (!bars.length) return v;

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
      const pnl =
        val(closeTotal - openTotal) *
        (strategy?.direction === "short" ? -1 : 1);
      const symbol = c[strategy?.dataset as keyof typeof c]?.split?.(":")?.[1];
      const openTime = new Date(bars[0].time);
      const cc = bars.at(-1)?.time;
      const closeTime = cc ? new Date(cc) : new Date();
      const overlapping = v.filter(
        isOverlapping({
          open: bars[0],
          close: bars.at(-1),
          openTotal,
          openPrice,
        })
      );

      const trade: ISTrade = {
        id: v4(),
        close: bars.at(-1),
        closed: !!closed,
        closePrice,
        closeTotal,
        contracts,
        diff: D.formatDistanceStrict(openTime, closeTime),
        high,
        length: bars.length,
        low,
        open: bars[0],
        openPrice,
        openTotal,
        pnl: {
          value: pnl,
          percent: +(pnl / openTotal).toFixed(4),
          cumulative: v.reduce((a, b) => a + (b.pnl?.value || 0), pnl),
        },
        volume: `${contracts} ${symbol}`,
        symbol,
        openTrades: overlapping.length + 1,
        invested: val(
          overlapping.map((t) => t.openTotal).reduce((a, b) => a + b, openTotal)
        ),
      };

      return [...v, trade];
    }, [])
  )(open!);

  return trades;
};
