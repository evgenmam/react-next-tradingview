import { EventEmitter } from "ahooks/lib/useEventEmitter";
import { useState } from "react";
import { IStrategy } from "../../types/app.types";
import { HumanDate } from "../utils/human-date";
import { XTable } from "../utils/table";
import { ISTrade } from "./hooks/strategy-trades";
import { CheckIcon } from "@heroicons/react/24/outline";
type Props = {
  strategy?: IStrategy;
  trades?: ISTrade[];
  emitter?: EventEmitter<string[]>;
  clicker?: EventEmitter<string>;
};
export const DetailsTable = ({ emitter, clicker, trades = [] }: Props) => {
  const onRowClick = (row: any) => clicker?.emit(row.id);
  const [highlight, setHighlight] = useState<string[]>([]);
  emitter?.useSubscription((v) => setHighlight(v));
  const onRowHover = (row: any) => emitter?.emit(row ? [row.id] : []);
  return (
    <XTable
      rowClick={onRowClick}
      rowHover={onRowHover}
      highlight={highlight}
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
          render: (v, d) => {
            if (!d?.closed) return "-";
            return <HumanDate time={v} fontSize={12} fontFamily="monospace" />;
          },
          thin: true,
        },
        {
          key: "sl",
          label: "SL",
          render: (v, d) => d.stopLossTriggered && <CheckIcon width={10} />,
        },
        {
          key: "tp",
          label: "TP",
          render: (v, d) => d.takeProfitTriggered && <CheckIcon width={10} />,
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
