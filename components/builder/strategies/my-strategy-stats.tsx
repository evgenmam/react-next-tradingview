import { useMemo } from "react";
import { useRows } from "../../../hooks/data.hook";
import { useSettings } from "../../../hooks/settings.hook";
import { IChartData, IStrategy } from "../../../types/app.types";
import { calculateStrategy, strategyStats } from "../../../utils/calculations";
import { XStats } from "../../utils/stats";

type Props = {
  strategy: IStrategy;
};

export const MyStrategyStats = ({ strategy }: Props) => {
  const { rows: source } = useRows("source");
  const { rows: target } = useRows(strategy?.dataset);
  const trades = useMemo(
    () => calculateStrategy(source, target)(strategy),
    [source, target, strategy]
  );

  const stats = useMemo(() => strategyStats(trades), [trades]);

  return (
    <XStats
      stats={[
        { label: "Total", value: stats.totalTrades },
        {
          label: "Winning",
          value: stats.winningTrades,
          success: true,
        },
        {
          label: "Losing",
          value: stats.losingTrades,
          failure: true,
        },
        { label: "Open", value: stats.openTrades },

        { label: "Total In", value: stats.totalIn },
        { label: "Total Out", value: stats.totalOut },
        { label: "Max In", value: stats.maxIn },
        { label: "PNL", value: stats.totalPnl, dynamic: true },
        { label: "ROI", value: stats.roi, dynamic: true },
      ]}
    />
  );
};
