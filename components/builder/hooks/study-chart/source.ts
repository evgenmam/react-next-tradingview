import { useTheme } from "@mui/joy";
import { rmdir } from "fs";
import { useMemo } from "react";
import { useRows, useSettings } from "../../../../hooks/data.hook";
import { ITVStudy, ITVStudyConfig } from "../../../tv-components/types";
import { yAxis } from "../../configs";
import { ITVBarColorer } from "./bar-colorers";
import * as R from "ramda";
import { CLOSING } from "ws";
import {
  barColorersToSeries,
  studyToBarColorers,
} from "../../utils/builder.utils";

export const useStudyChartSource = (
  study?: ITVStudy,
  config?: ITVStudyConfig
): Highcharts.SeriesLineOptions[] => {
  const { meta } = study || {};
  const { rows } = useRows("source");
  const theme = useTheme();
  const { maxDigits } = useSettings();
  const barColorers = useMemo(
    () => studyToBarColorers(study, config),
    [study, config]
  );
  const colorSeries = useMemo<Highcharts.SeriesLineOptions[]>(
    () => barColorersToSeries(rows, maxDigits)(barColorers),
    [barColorers, rows, maxDigits]
  );

  return useMemo<Highcharts.SeriesLineOptions[]>(
    () =>
      meta?.is_price_study
        ? [
            {
              type: "line" as const,
              yAxis: "source",
              data: rows.map((v) => {
                return {
                  x: v?.time,
                  y: v?.close,
                };
              }),
              color: theme?.palette?.primary?.[600],
              showInLegend: false,
            },
            ...colorSeries,
          ]
        : [],
    [meta?.is_price_study, rows, theme?.palette?.primary, colorSeries]
  );
};
