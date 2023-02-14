import { IStrategy } from "../../types/app.types";
import { HumanDate } from "../utils/human-date";
import { XTable } from "../utils/table";
import { ISTrade } from "./hooks/strategy-trades";
type Props = {
  strategy?: IStrategy;
  trades?: ISTrade[];
};
export const DetailsTable = ({ strategy, trades = [] }: Props) => {
  return (
    <XTable
      cols={[
        {
          key: "symbol",
          label: "Symbol",
        },
        {
          key: "open.time",
          label: "Open",
          render: (v) => (
            <HumanDate time={v} fontSize={12} fontFamily="monospace" />
          ),
          thin: true,
        },
        {
          key: "close.time",
          label: "Closed",
          render: (v) => (
            <HumanDate time={v} fontSize={12} fontFamily="monospace" />
          ),
          thin: true,
        },
        {
          key: "diff",
          label: "Length",
        },

        {
          key: "volume",
          label: "Volume",
          align: "right",
          thin: true,
        },
        {
          key: "openPrice",
          label: "Open Price",
          cur: true,
          align: "right",
        },
        {
          key: "openTotal",
          label: "Open Total",
          thin: true,
          cur: true,
          align: "right",
        },
        {
          key: "closePrice",
          label: "Close Price",
          cur: true,
          align: "right",
        },
        {
          key: "closeTotal",
          label: "Close Total",
          thin: true,
          cur: true,
          align: "right",
        },
        {
          key: "openTrades",
          label: "Open Trades",
          align: "right",
        },
        {
          key: "invested",
          label: "Invested",
          align: "right",
          thin: true,
          cur: true,
        },

        {
          key: "pnl.value",
          label: "PnL",
          align: "right",
          dynamic: true,
          cur: true,
        },
        {
          key: "pnl.percent",
          label: "PnL %",
          align: "right",
          thin: true,
          dynamic: true,
          per: true,
        },
        {
          key: "pnl.cumulative",
          label: "Cumulative",
          align: "right",
          thin: true,
          dynamic: true,
          cur: true,
        },
      ]}
      data={trades}
    />
  );
};
