import { colors } from "@mui/material";
import {
  IBaseTradePack,
  IChartData,
  ISignal,
  IStrategy,
  ITrade,
  ITradeWithTotals,
} from "../types/app.types";
import * as R from "ramda";
import currency from "currency.js";
import { cur, per } from "./number.utils";
import * as D from "date-fns";

export type ITVStats = {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  openTrades: number;
  totalPnl: string;
  totalIn: string;
  totalOut: string;
  maxIn: string;
  roi: string;
};
export const applySignal = (rows: IChartData[]) => (signal: ISignal) => {
  const matches = signal.condition
    .map((c) => {
      const conds = rows.map((r, i: number) => {
        let result = false;
        const idx = i;

        const secondIdx = idx - (c?.a.field === c?.b?.field ? 1 : 0);
        console.log(idx);
        const a = rows[idx]?.[c.a.field!];
        const b = rows[secondIdx]?.[c.b?.field!];
        const prevA = rows[idx - 1]?.[c.a.field!];
        const prevB = rows[secondIdx - 1]?.[c.b?.field!];
        if (c.operator === "true") {
          result = !!a;
        }
        if (a && b)
          switch (c.operator) {
            case "equals":
              result = a === b;
              break;
            case "greater":
              result = a > b;
              break;
            case "greaterOrEqual":
              result = a >= b;
              break;
            case "less":
              result = a < b;
              break;
            case "lessOrEqual":
              result = a <= b;
              break;
            case "notEqual":
              result = a !== b;

            case "crossesUp":
              result = !!prevA && !!prevB && prevA < prevB && a > b;
              break;
            case "crossesDown":
              result = !!prevA && !!prevB && prevA > prevB && a < b;
              break;

            default:
              result = false;
          }
        return +result;
      });
      return {
        conds,
        next: c.next,
        offset: c.offset,
      };
    })
    .reduce(
      (cond1, { conds, offset = 0, next }) => ({
        conds: conds.map((c, i) => {
          return cond1.next === "OR"
            ? c ||
                +cond1.conds
                  .filter?.((_, j) => j >= i - offset && j <= i)
                  .some((v) => !!v)
            : c &&
                +cond1.conds
                  .filter?.((_, j) => j >= i - offset && j <= i)
                  .some((v) => !!v);
        }),
        next: next as "AND" | "OR",
        offset: offset as number,
      }),
      {
        conds: Array(rows.length).fill(1),
        next: "AND",
        offset: 0,
      }
    );
  return {
    data: rows.filter((v, i) => matches.conds[i]),
    signal,
    bars: matches.conds.reduce(
      (a, v, i) => (v ? [...a, matches.conds.length - i - 1] : a),
      []
    ),
  };
};

export const applyStrategy =
  (rows: IChartData[]) =>
  (strategy: IStrategy): IBaseTradePack => ({
    open: applySignal(rows)(strategy.openSignal!).data.map((r) => ({
      strategy,
      open: true,
      long: strategy.direction === "long",
      short: strategy.direction === "short",
      time: r.time,
      action: "open",
    })),
    close: applySignal(rows)(strategy.closeSignal!).data.map((r) => ({
      strategy,
      close: true,
      long: strategy.direction === "long",
      short: strategy.direction === "short",
      time: r.time,
      action: "close",
    })),
  });

export const calculateStrategy =
  (source: IChartData[], target: IChartData[]) =>
  (strategy: IStrategy): ITrade[] => {
    const signals = {
      open: applySignal(source)(strategy.openSignal!).data.map((r) => ({
        time: r.time,
        action: "open",
      })),
      close: applySignal(source)(strategy.closeSignal!).data.map((r) => ({
        time: r.time,
        action: "close",
      })),
    };
    let trades = signals.open
      .map((o) => ({
        strategy: strategy,
        opened: o.time,
        closed: signals.close.find((c) => c.time > o.time)?.time,
      }))
      .map((t) => ({
        ...t,
        highest:
          t.closed &&
          target
            .filter(
              (r) => r.time >= t.opened && r.time <= (t.closed || Infinity)
            )
            .map((r) => {
              return r;
            })
            .reduce((a, b) => (a.high > b.high ? a : b), { high: 0, time: 0 })
            ?.time,

        lowest: target
          .filter((r) => r.time >= t.opened && r.time <= (t.closed || Infinity))
          .reduce((a, b) => (a.low < b.low ? a : b), {
            low: Infinity,
            time: 0,
          })?.time,
      }))

      .map((t) => ({
        ...t,
        count: strategy.entry,
        short: strategy.direction === "short",
        duration: t.closed ? t.closed - t.opened : undefined,
        openPrice: target.find((r) => r.time > t.opened)?.close!,
        closePrice: target.find((r) => r.time > (t.closed || Infinity))?.close,
        highestPrice: target.find((r) => r.time > (t.highest || Infinity))
          ?.high,
        lowestPrice: target.find((r) => r.time > (t.lowest || Infinity))?.low,
      }))
      .map((v) => ({
        ...v,
        pnl:
          v.closePrice && v.openPrice
            ? +((v.closePrice - v.openPrice) * (v.short ? -1 : 1)).toFixed(2)
            : 0,
        runup:
          v.highestPrice && v.openPrice
            ? +((v.highestPrice - v.openPrice) * (v.short ? -1 : 1)).toFixed(2)
            : 0,
        drawdown:
          v.lowestPrice && v.openPrice
            ? +((v.lowestPrice - v.openPrice) * (v.short ? -1 : 1)).toFixed(2)
            : 0,
      }))
      .map((v) => ({
        ...v,
        color: v.pnl
          ? v.pnl > 0
            ? colors.green[500]
            : colors.red[500]
          : "grey",

        pnlRate: +(
          (v.pnl && v.openPrice ? v.pnl / v.openPrice : 0) * 100
        ).toFixed(2),

        drawdownRate: +(
          (v.drawdown && v.openPrice ? v.drawdown / v.openPrice : 0) * 100
        ).toFixed(2),

        runupRate: +(
          (v.runup && v.openPrice ? v.runup / v.openPrice : 0) * 100
        ).toFixed(2),
        totalIn: v.openPrice * (v?.count || 1),
        totalOut: v.closePrice ? v.closePrice * (v?.count || 1) : 0,
      }));
    return trades;
  };

export const withRunningTotal = (rows: ITrade[]): ITradeWithTotals[] => {
  let totalPnl = 0;
  return rows.map((r) => ({
    ...r,
    totalPnl: +(totalPnl += r.pnl || 0).toFixed(2),
  }));
};

const getTotalN = (key: string) =>
  R.pipe<ITrade[][], number[], number>(
    R.map<ITrade, number>(R.propOr(0, key)),
    R.sum
  );

const getTotal = (key: string) => R.pipe(getTotalN(key), cur);

const countBy = (pred: (val: ITrade[keyof ITrade]) => boolean, key: string) =>
  R.pipe<ITrade[][], ITrade[], number>(
    R.filter<ITrade>(R.propSatisfies(pred, key)),
    R.length
  );

const toInterval = (t: ITrade) => ({
  start: t.opened,
  end: t.closed === Infinity || !t.closed ? new Date() : t.closed,
});

const isOverlapping = (a: ITrade, b: ITrade) =>
  D.areIntervalsOverlapping(toInterval(a), toInterval(b));

const getIntersection = (a: ITrade, b: ITrade) => ({
  ...a,
  opened: Math.max(a.opened, b.opened),
  closed: Math.min(a.closed || Infinity, b.closed || Infinity),
  openPrice: a.openPrice + b.openPrice,
});

const getMaxIn = (v: ITrade[]): number =>
  v
    .map((t, i) =>
      v
        .slice(i + 1)
        .reduce(
          (acc, b) => (isOverlapping(acc, b) ? getIntersection(acc, b) : acc),
          t
        )
    )
    .map((v) => v.openPrice * (v.count || 1))
    .reduce(R.max, 0);

export const getRoi = (v: ITrade[]) =>
  R.converge<number, [(t: ITrade[]) => number, (t: ITrade[]) => number]>(
    R.divide,
    [getTotalN("pnl"), getMaxIn]
  )(v);

export const strategyStats: (t: ITrade[]) => ITVStats = R.applySpec({
  totalTrades: R.length,
  winningTrades: countBy((pnl) => +pnl! > 0, "pnl"),
  losingTrades: countBy((pnl) => +pnl! < 0, "pnl"),
  openTrades: countBy((closed) => !closed, "closed"),
  totalPnl: getTotal("pnl"),
  totalIn: getTotal("totalIn"),
  totalOut: getTotal("totalOut"),
  maxIn: R.pipe(getMaxIn, cur),
  roi: R.pipe<ITrade[][], number, string>(getRoi, per),
});

export const applyTakeProfit = (takeProfit: number) => {};
