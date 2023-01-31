import { Palette } from "@mui/material";
import { useMemo } from "react";

import { ITVStudy, ITVStudyConfig } from "../../../tv-components/types";
import { PlotTypes } from "../../configs";
import { colorerToZone } from "../../utils/builder.utils";
import { ITVPlot } from "./plots";

const isGoodLine = (p: ITVPlot) =>
  p.styles?.plottype === PlotTypes.Line &&
  !p?.data?.some((v) => v[1] > 1000000000000);

export const useStudyChartLines = (
  study?: ITVStudy,
  plots?: ITVPlot[],
  config?: ITVStudyConfig
): Highcharts.SeriesLineOptions[] => {
  return useMemo(
    () =>
      plots?.filter(isGoodLine)?.map(({ data, id, styles, title }) => ({
        data,
        type: "line" as const,
        yAxis: study?.meta?.is_price_study ? "source" : "main",
        name: title,
        zoneAxis: "x",
        lineWidth: styles?.linewidth,
        color: styles?.color,
        marker: {
          enabled: false,
        },
        zones: plots
          ?.filter(({ plot }) => plot.target === id)
          .flatMap(colorerToZone),
      })) || [],
    [plots, study?.meta?.is_price_study]
  );
};
