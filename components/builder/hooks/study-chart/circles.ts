import { useMemo } from "react";
import { ITVStudy } from "../../../tv-components/types";
import { PlotTypes } from "../../configs";
import { colorerToZone, isAllSame } from "../../utils/builder.utils";
import { ITVPlot } from "./plots";
import * as R from "ramda";
import { useSettings } from "../../../../hooks/settings.hook";

export const useStudyChartCircles = (
  study: ITVStudy,
  plots: ITVPlot[]
): Highcharts.SeriesSplineOptions[] => {
  const circles = useMemo(
    () =>
      plots?.filter?.((p) => {
        return p.styles?.plottype === PlotTypes.Circles && !isAllSame(p.data);
      }),
    [plots]
  );
  const { maxDigits } = useSettings();
  return useMemo(
    () =>
      circles.map(
        ({ data, id, styles, title, name }) =>
          ({
            data,
            name,
            id,
            title,
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
              valueDecimals: maxDigits,
            },
            zones: plots
              ?.filter(({ plot }) => plot.target === id)
              .flatMap(colorerToZone),
          } as Highcharts.SeriesSplineOptions)
      ),
    [circles, plots, study?.meta?.is_price_study, maxDigits]
  );
};
