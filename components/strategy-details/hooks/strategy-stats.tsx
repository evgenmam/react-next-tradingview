import { ISTrade } from "./strategy-trades";
import * as R from "ramda";

export type ISStats = {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  openTrades: number;
  pnl: number;
  pnlRate: number;
  totalIn: number;
  totalOut: number;
  maxIn: number;
  roi: number;
};

const countBy = (fn: (trades: ISTrade) => boolean) =>
  R.pipe<ISTrade[][], ISTrade[], number>(R.filter<ISTrade>(fn), R.length);

const maxBy = (fn: (trades: ISTrade) => number) =>
  R.pipe<ISTrade[][], number[], number>(
    R.map(fn),
    R.reduce<number, number>(R.max, 0)
  );
const sumBy = (fn: (trades: ISTrade) => number) =>
  R.pipe<ISTrade[][], number[], number>(R.map(fn), R.sum);

export const useStrategyStats = R.applySpec<ISStats>({
  totalTrades: R.length,
  winningTrades: countBy((t) => (t.pnl?.value || 0) > 0),
  losingTrades: countBy((t) => (t.pnl?.value || 0) < 0),
  openTrades: countBy((t) => !t.closed),
  totalIn: sumBy((t) => t.openTotal || 0),
  totalOut: sumBy((t) => t.closeTotal || 0),
  maxIn: maxBy((t) => t.invested || 0),
  pnl: sumBy((t) => t.pnl?.value || 0),
  //@ts-ignore
  pnlRate: R.converge((a,b) => +(a / b).toFixed(4), [
    sumBy((t) => t.pnl?.value || 0),
    sumBy((t) => t.openTotal || 0),
  ]),
  //@ts-ignore
  roi: R.converge(R.divide, [
    sumBy((t) => t.pnl?.value || 0),
    maxBy((t) => t.invested || 0),
  ]),
});
