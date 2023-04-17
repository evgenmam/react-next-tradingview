import { CLOSING } from "ws";
import { IChartData, IStrategy } from "../../../types/app.types";
import { ISEvents, ISOpenClose } from "./signal-events";
import * as R from "ramda";
import { addPercent, cur, subPercent, val } from "../../../utils/number.utils";
import { useSettings } from "../../../hooks/settings.hook";
import * as D from "date-fns";
import { v4 } from "uuid";
import { useDebugValue } from "react";

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
  action: string;
  id?: string;
  strategy?: {
    open?: number;
    close?: number;
  };
  stopLossTriggered?: boolean;
  takeProfitTriggered?: boolean;
  takeProfit?: number;
  stopLoss?: number;
  openSignalTime?: number;
  closeSignalTime?: number;
}

const toInterval = (t: ISTrade): D.Interval => ({
  start: t.open?.time,
  end: t?.close?.time || new Date(),
});

const isOverlapping = R.curry((a: ISTrade, b: ISTrade) =>
  D.areIntervalsOverlapping(toInterval(a), toInterval(b))
);

const applyTakeProfit = (v: IChartData[], takeProfit: number) => {
  const tpPrice = addPercent(takeProfit)(v[0].open);
  const index = R.findIndex<IChartData>((c) => c.high > tpPrice)(v);
  return R.take(index + 2)(v);
};

const applyStopLoss = (v: IChartData[], stopLoss: number) => {
  const tpPrice = addPercent(stopLoss)(v[0].open);
  const index = R.findIndex<IChartData>((c) => c.low < tpPrice)(v);
  return R.take(index + 2)(v);
};

const hasTp = (v: IChartData[], tp?: number) =>
  !!tp && !!R.find<IChartData>((c) => c.high > addPercent(tp)(v[0].open))(v);

const hasSl = (v: IChartData[], sl?: number) => {
  return (
    !!sl && !!R.find<IChartData>((c) => c.low < subPercent(sl)(v[0].open))(v)
  );
};

export const useStrategyTrades = (
  { openBars, closeBars }: ISOpenClose,
  rows: IChartData[] = [],
  strategy?: IStrategy,
  tp?: number,
  sl?: number
): ISTrade[] => {
  const c = useSettings();

  const trades = openBars
    .map((k) => rows.length - k)
    .reduce<ISTrade[]>((v, openBarIdx) => {
      if (!rows.at(openBarIdx)) return v;
      const openPrice = val(rows.at(openBarIdx)!.open);
      let closeBarIdx = closeBars
        .map((k) => rows.length - k)
        .find((c) => c > openBarIdx && c < rows.length);
      const closed = !!closeBarIdx;

      const allBars = rows.slice(
        openBarIdx,
        closeBarIdx ? closeBarIdx + 1 : rows.length
      );
      let bars = [...allBars];
      if (!bars.length) return v;
      if (hasSl(allBars, sl)) bars = applyStopLoss(allBars, sl!);
      if (hasTp(allBars, tp)) bars = applyTakeProfit(allBars, tp!);
      const high = bars.reduce(R.maxBy(R.propOr(0, "high")), bars[0]);
      const low = bars.reduce(R.minBy(R.propOr(Infinity, "low")), bars[0]);
      const closePrice = val(
        (!closed ? bars.at(-1)?.close : bars.at(-1)?.open) || 0
      );

      const contracts = val(
        strategy?.usd
          ? Math.floor(strategy.usd / openPrice)
          : strategy?.entry || 1
      );
      const openTotal = val(openPrice * contracts);
      const closeTotal = val(closePrice * contracts);
      const pnl = val(closeTotal - openTotal);
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
          action: strategy?.direction || "long",
        })
      );

      if (!rows.at(-openBarIdx - 1)) return v;

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
        action: strategy?.direction || "long",
        strategy: {
          open: openBarIdx && rows?.at(openBarIdx - 1)?.time,
          close: closeBarIdx && rows?.at(closeBarIdx - 1)?.time,
        },
        takeProfitTriggered: hasTp(allBars, tp),
        stopLossTriggered: hasSl(allBars, sl),
        takeProfit: tp && addPercent(tp)(bars[0].open),
        stopLoss: sl && subPercent(sl)(bars[0].open),
        openSignalTime: openBarIdx && rows?.at(openBarIdx - 1)?.time,
        closeSignalTime: closeBarIdx && rows?.at(closeBarIdx - 1)?.time,
      };

      return [...v, trade];
    }, []);

  return trades;
};
