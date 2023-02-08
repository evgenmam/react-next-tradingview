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
import { cur } from "./number.utils";

export type ITVStats = {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  openTrades: number;
  totalPnl: string;
};
export const applySignal = (rows: IChartData[]) => (signal: ISignal) => {
  const data = rows.filter(
    (r, idx) =>
      signal.condition
        .map((c) => {
          const a = rows[idx - (c.a.offset || 0)]?.[c.a.field!];
          const b = rows[idx - (c.b?.offset || 0)]?.[c.b?.field!];
          const prevA = rows[idx - 1 - (c.a.offset || 0)]?.[c.a.field!];
          const prevB = rows[idx - 1 - (c.b?.offset || 0)]?.[c.b?.field!];
          let result = false;
          if (c.operator === "true") {
            result = !!a;
          }
          if (a && b && prevA && prevB)
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
              case "crossesUp":
                result = prevA < prevB && a > b;
                break;
              case "crossesDown":
                result = prevA > prevB && a < b;
                break;

              default:
                result = false;
            }
          return { result, next: c.next };
        })
        .reduce(
          (v, { result, next }) => ({
            result: v.next === "OR" ? v.result || result : v.result && result,
            next,
          }),
          { result: true, next: "AND" }
        ).result
  );

  return {
    data,
    signal,
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

export const strategyStats: (t: ITrade[]) => ITVStats = R.applySpec({
  totalTrades: R.length,
  winningTrades: countBy((pnl) => pnl! > 0, "pnl"),
  losingTrades: countBy((pnl) => pnl! < 0, "pnl"),
  openTrades: countBy((closed) => !closed, "closed"),
  totalPnl: getTotal("pnl"),
  totalIn: getTotal("totalIn"),
  totalOut: getTotal("totalOut"),
});
