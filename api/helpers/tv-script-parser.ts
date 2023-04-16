import { ISTrade } from "../../components/strategy-details/hooks/strategy-trades";
import { IStrategy } from "../../types/app.types";
import TVApi from "../tradingview";

export const getTrades = (data: ISTrade[] = []) => {
  const trades = [];
  for (const row of data) {
    trades.push(
      [
        row.strategy?.open,
        row.action === "long",
        row.contracts || 1,
        row?.closed && row?.strategy?.close,
      ]
        .filter((v) => !!v)
        .join(",")
    );
  }
  return trades.map((v) => `s.new(${v})`).join(",");
};

export const script = (
  rows: string,
  { dataset, source, strategy }: ITVScriptParserInput
) => `//@version=5
strategy("BG:${strategy?.id}:${dataset || ""} [${source || ""}][${
  strategy?.direction?.toUpperCase() || ""
}]", overlay=true, margin_long=100, margin_short=100)
type s
    int ot
    bool l
    float n
    int ct

times = array.from(${rows})

for t in times
    n = t.l ? 'LONG' : 'SHORT'
    if (time == t.ot)    
        strategy.entry(n, t.l ? strategy.long : strategy.short, t.n)
    if (time == t.ct)
        strategy.close(n)
`;

export type ITVScriptParserInput = {
  trades?: ISTrade[];
  strategy?: IStrategy;
  dataset?: string;
  source?: string;
  upload?: boolean;
};
export class TVScriptParser {
  trades?: ISTrade[];
  strategy?: IStrategy;
  dataset?: string;
  source?: string;
  constructor({ trades, strategy, dataset, source }: ITVScriptParserInput) {
    this.trades = trades;
    this.strategy = strategy;
    this.dataset = dataset;
    this.source = source;
  }

  scriptFromTrades(): string {
    
    return script(getTrades(this.trades), this);
  }
}
