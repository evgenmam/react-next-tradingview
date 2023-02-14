import { useMemo } from "react";
import { useRows } from "../../../hooks/data.hook";
import { useSettings } from "../../../hooks/settings.hook";
import { IChartData, IStrategy } from "../../../types/app.types";
import { calculateStrategy, strategyStats } from "../../../utils/calculations";
import { getReversalStrategy } from "../../../utils/strategy.utils";
import { XJson } from "../../json";
import { useSignalEvents } from "../../strategy-details/hooks/signal-events";
import { useStrategyStats } from "../../strategy-details/hooks/strategy-stats";
import { useStrategyTrades } from "../../strategy-details/hooks/strategy-trades";
import { XStats } from "../../utils/stats";

type Props = {
  strategy: IStrategy;
  reversed?: boolean;
};

export const MyStrategyStats = ({ strategy, reversed }: Props) => {
  const dataset = reversed
    ? strategy?.dataset === "target"
      ? "target2"
      : "target"
    : strategy?.dataset;
  const { rows } = useRows(dataset);

  const events = useSignalEvents(strategy);
  const trades = useStrategyTrades(
    events,
    rows,
    reversed ? getReversalStrategy(strategy) : strategy
  );
  const stats = useStrategyStats(trades);

  return (
    <XStats
      table
      stats={[
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
  );
};
