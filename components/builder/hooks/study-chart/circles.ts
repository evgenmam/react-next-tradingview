import { useMemo } from "react";
import { ITVStudy } from "../../../tv-components/types";
import { PlotTypes } from "../../configs";
import { colorerToZone } from "../../utils/builder.utils";
import { ITVPlot } from "./plots";

export const useStudyChartCircles = (
  study: ITVStudy,
  plots: ITVPlot[]
): Highcharts.SeriesSplineOptions[] => {
  const circles = plots?.filter?.(
    (p) =>
      p.styles?.plottype === PlotTypes.Circles &&
      !p?.data?.some((v) => v[1] > 1e10)
  );
  return useMemo(
    () =>
      circles.map(({ data, id, styles, title }) => ({
        data,
        name: title,
        yAxis: study.meta?.is_price_study ? "source" : "main",
        zoneAxis: "x",
        color: styles?.color,
        type: "spline" as const,
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
        tooltip: {
          pointFormat: `<span style="color: {series.color};">{series.name}: <b>{point.y}</b></span><br/>`,
        },
        zones: plots
          ?.filter(({ plot }) => plot.target === id)
          .flatMap(colorerToZone),
      })),
    [circles, plots, study?.meta?.is_price_study]
  );
};
