import { IBaseTrade, IBaseTradePack, ITrade } from "../types/app.types";
import * as R from "ramda";

export const getTrades = (data: IBaseTrade[]) => {
  const trades = [];
  for (const row of data) {
    if (row.open && row.long) {
      trades.push(`${+row.time},true,true`);
    }
    if (row.open && row.short) {
      trades.push(`${+row.time},true,false`);
    }
    if (row.close && row.long) {
      trades.push(`${+row.time},false,true`);
    }
    if (row.close && row.short) {
      trades.push(`${+row.time},false,false`);
    }
  }
  return trades.map((v) => `s.new(${v})`).join(",");
};

export const script = (rows: string) => `//@version=5
strategy("My strategy", overlay=true, margin_long=100, margin_short=100)
type s
    int t
    bool o
    bool l

times = array.from(${rows})

for t in times
    if (time[1] == t.t)
        n = t.l ? 'LONG' : 'SHORT'
        if (t.o) 
            strategy.entry(n, t.l ? strategy.long : strategy.short)
        else
            strategy.close(n)
`;

export const generateScript = R.pipe<
  IBaseTradePack[][],
  IBaseTrade[][][],
  IBaseTrade[],
  string,
  string
>(R.map(R.values), R.flatten, getTrades, script);
