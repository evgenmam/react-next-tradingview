import { useMemo } from "react";
import { calculateStrategy } from "../../utils/calculations";
import { useRows, useStrategies } from "../data.hook";

export const useTradesData = ({
  dataset,
}: {
  dataset: string;
}): [s: { series: Highcharts.SeriesSplineOptions[] }, l: boolean] => {
  const { rows, loading: dsLoading } = useRows(dataset);
  const { rows: source, loading: sLoading } = useRows("source");
  const { strategies, loading: strLoading } = useStrategies();
  const trades = useMemo(
    () =>
      strategies
        .filter((v) => v.dataset === dataset)
        .filter((v) => !v.hide)
        .map(calculateStrategy(source, rows)),
    [dataset, rows, source, strategies]
  );

  const series: Highcharts.SeriesSplineOptions[] = useMemo(
    () =>
      trades.flatMap((t) =>
        t.map(
          (v): Highcharts.SeriesSplineOptions => ({
            type: "spline",
            data: [
              {
                x: v.opened,
                y: v.openPrice,
                marker: { enabled: true },
                dataLabels: {
                  format: `${v.pnl?.toFixed(2)}%`,
                  color: v.pnl && v.pnl > 0 ? "green" : "red",
                  connectorColor: v.pnl && v.pnl > 0 ? "green" : "red",
                  enabled: true,
                },
              },
              ...[
                { x: v.highest, y: v.highestPrice },
                { x: v.lowest, y: v.lowestPrice },
              ]
                .filter(({ x }) => !!x)
                .sort((a, b) => (a.x! > b.x! ? 1 : -1)),
              { x: v.closed, y: v.closePrice },
            ],

            yAxis: dataset,
            lineWidth: 5,
            color: v.pnl && v.pnl > 0 ? "green" : "red",
            name: `strategy-${v.opened}`,
          })
        )
      ),
    [trades, dataset]
  );

  return [{ series }, dsLoading || sLoading || strLoading];
};
