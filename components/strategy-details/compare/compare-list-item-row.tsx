import { TableCell, TableRow } from "@mui/material";
import {
  ForwardedRef,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
} from "react";
import { IChartData, IStrategy } from "../../../types/app.types";
import { XStats } from "../../utils/stats";
import { DetailsTable } from "../details-table";
import { ISOpenClose, useSignalEvents } from "../hooks/signal-events";
import { ISStats, useStrategyStats } from "../hooks/strategy-stats";
import { useStrategyTrades } from "../hooks/strategy-trades";

type CompareListItemRowProps = {
  target: IChartData[];
  strategy?: IStrategy;
  pair: string;
  symbol: string;
  events: ISOpenClose;
};

export const CompareListItemRow = forwardRef(function CompareListItemRow(
  { target, strategy, symbol, pair, events }: CompareListItemRowProps,
  ref: ForwardedRef<ISStats>
) {
  const trades = useStrategyTrades(events, target, strategy);

  const stats = useStrategyStats(trades);

  return (
    <>
      <XStats
        tableRow
        stats={[
          { label: "Pair", value: pair, align: "left" },
          { label: "Dataset", value: symbol, align: "left" },
          { label: "Direction", value: strategy?.direction! },
          { label: "Total", value: stats.totalTrades },

          { label: "Open", value: stats.openTrades },
          {
            label: "Winning",
            value: stats.winningTrades,
            success: true,
            split: true,
          },
          {
            label: "Losing",
            value: stats.losingTrades,
            failure: true,
          },
          { label: "Total In", value: stats.totalIn, split: true, cur: true },
          { label: "Total Out", value: stats.totalOut, cur: true },
          { label: "Max In", value: stats.maxIn, split: true, cur: true },
          { label: "ROI", value: stats.roi, dynamic: true, per: true },
          {
            label: "PNL",
            value: stats.pnl,
            dynamic: true,
            split: true,
            cur: true,
          },
          { label: "PNL % ", value: stats.pnlRate, dynamic: true, per: true },
        ]}
      />
    </>
  );
});

export default CompareListItemRow;
