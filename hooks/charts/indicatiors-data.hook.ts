import { useIndicators, useRows, useSettings } from "../data.hook";
import * as R from "ramda";
import { IIndicator } from "../../types/app.types";
import { getNextLabel } from "../../utils/chart.utils";
export const useIndicatorsData = ({
  sourceHeight = 500,
  height = 200,
}: {
  sourceHeight?: number;
  height?: number;
}) => {
  const { rows } = useRows("source");
  const { indicators } = useIndicators();

  const { stack = [] } = R.groupBy<IIndicator>((v) =>
    v.main ? "overlay" : "stack"
  )(indicators);

  const series: (Highcharts.SeriesOptions & { type: any })[] =
    indicators.flatMap((v, idx) =>
      v.fields.map((f) => {
        const ff = {
          yAxis: v.main ? "source" : `indicator-${v.name}`,
          type: f.type as any,
          color: f.color,
          data: rows.map((row) => [row.time, row[f.key]]),
          name: f.key,
        };
        switch (f.type) {
          case "scatter":
            return {
              ...ff,
              type: "spline",
              lineWidth: 0,
              marker: {
                enabled: true,
                symbol: "circle",
                radius: 4,
              },
              states: {
                hover: {
                  lineWidthPlus: 0,
                },
              },
            };
          default:
            return {
              ...ff,
              marker: {
                symbol: "circle",
                radius: 2.5,
              },
            };
        }
      })
    );

  const { target } = useSettings();

  const yAxis: Highcharts.YAxisOptions[] = stack.map((v, idx) => ({
    id: `indicator-${v.name}`,
    top: idx * height + sourceHeight,
    height: height,
    resize: {
      enabled: true,
      controlledAxis: {
        next: [stack[idx + 1]?.name || "target"],
      },
    },
    plotLines: [getNextLabel(stack[idx + 1]?.name || target)],
  }));

  return { series, yAxis };
};
