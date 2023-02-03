import { useMemo } from "react";
import { IChartData } from "../../../../types/app.types";
import { ITVStudy } from "../../../tv-components/types";
import { isAllSame } from "../../utils/builder.utils";
import { ITVPlot } from "./plots";

export const useStudyChartAlerts = (
  study: ITVStudy,
  plots: ITVPlot[],
  source?: Highcharts.SeriesLineOptions[]
) => {
  const alerts = plots?.filter?.(
    (p) => p.plot?.type === "alertcondition" && !isAllSame(p.data)
  );
  return useMemo(
    () =>
      alerts?.map(({ title, id, data, name }, idx) => {
        const t = name?.toLowerCase();
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
        const symbol = isBuy ? "triangle" : isSell ? "triangle-down" : "circle";
        return {
          id,
          name,
          title,
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
            radius: isBuy || isSell ? 10 : 7,
            // fillColor,
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
