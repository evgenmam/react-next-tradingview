import { Palette } from "@mui/material";
import { useMemo } from "react";

import { ITVStudy, ITVStudyConfig } from "../../../tv-components/types";
import { PlotTypes } from "../../configs";
import { colorerToZone, isAllSame } from "../../utils/builder.utils";
import { ITVPlot } from "./plots";
import * as R from "ramda";
import { useTheme } from "@mui/joy";

const isGoodLine = (p: ITVPlot) =>
  p.styles?.plottype === PlotTypes.Line && !isAllSame(p.data);

export const useStudyChartLines = (
  study?: ITVStudy,
  plots?: ITVPlot[],
  config?: ITVStudyConfig
): Highcharts.SeriesLineOptions[] => {
  const { palette } = useTheme();
  return useMemo(
    () =>
      plots?.filter(isGoodLine)?.map(({ data, id, styles, title, name }) => ({
        data,
        type: "line" as const,
        yAxis: study?.meta?.is_price_study ? "source" : "main",
        name,
        title,
        id,
        zoneAxis: "x",
        lineWidth: styles?.linewidth,
        color: R.pipe(
          R.prop("color"),
          R.when(R.equals("rgba(0,0,0,0)"), R.always(palette.info[500]))
        )(styles),
        marker: {
          enabled: false,
        },
        zones: plots
          ?.filter(({ plot }) => plot.target === id)
          .flatMap(colorerToZone),
      })) || [],
    [plots, study?.meta?.is_price_study, palette.info]
  );
};
