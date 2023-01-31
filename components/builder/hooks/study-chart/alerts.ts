import { useMemo } from "react";
import { IChartData } from "../../../../types/app.types";
import { ITVStudy } from "../../../tv-components/types";
import { ITVPlot } from "./plots";

export const useStudyChartAlerts = (
  study: ITVStudy,
  plots: ITVPlot[],
  source?: Highcharts.SeriesLineOptions[]
) => {
  const alerts = plots?.filter?.(
    (p) =>
      p.plot?.type === "alertcondition" &&
      p.data?.some((v) => v[1] && !p?.data?.some((v) => v[1] > 1e10))
  );
  return useMemo(
    () =>
      alerts?.map(({ title, id, data, plot }, idx) => {
        const t = title?.toLowerCase();
        const b =
          (t?.includes("buy") && !t?.includes("exit buy")) ||
          t?.includes("long") ||
          t?.includes("exit sell");
        const s =
          (t?.includes("sell") && !t?.includes("exit sell")) ||
          t?.includes("short") ||
          t?.includes("exit buy");
        const isBuy = b && !s;
        const isSell = s && !b;
        const fillColor = isBuy ? "green" : isSell ? "red" : undefined;
        const symbol = isBuy ? "triangle" : isSell ? "triangle-down" : "circle";
        return {
          name: `${title}`,
          id: `alert-${id}`,
          yAxis: study?.meta?.is_price_study ? "source" : "main",
          type: "spline" as const,
          data: data
            .filter((c) => c[1])
            ?.map((c) => ({
              x: c[0],
              y: (
                source?.[0]?.data?.find(
                  (v) => (v as number[])[0] === c[0]
                ) as number[]
              )?.[1],
              label: title,
            })),
          style: {
            fontSize: "8px",
          },
          states: {
            hover: {
              lineWidthPlus: 0,
            },
            inactive: {
              opacity: 1,
            },
          },
          lineWidth: 0,
          marker: {
            enabled: true,
            symbol,
            radius: fillColor ? 10 : 7,
            fillColor,
            style: {
              top: "-200px",
            },
          },
          zIndex: isBuy ? 100 : isSell ? 100 : 90,
        };
      }),
    [alerts, source, study?.meta?.is_price_study]
  );
};
