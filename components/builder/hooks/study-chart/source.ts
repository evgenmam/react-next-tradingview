import { useTheme } from "@mui/joy";
import { useMemo } from "react";
import { useRows } from "../../../../hooks/data.hook";
import { ITVStudy } from "../../../tv-components/types";
import { yAxis } from "../../configs";

export const useStudyChartSource = (
  study?: ITVStudy
): Highcharts.SeriesLineOptions[] => {
  const { meta } = study || {};
  const { rows } = useRows("source");
  const theme = useTheme();
  return useMemo(
    () =>
      meta?.is_price_study
        ? [
            {
              type: "line" as const,
              yAxis: "source",
              data: rows.map((v) => [v.time, v.close]),
              color: theme?.palette?.primary?.[600],
              showInLegend: false,
              tooltip: {
                pointFormat: "",
              },
            },
          ]
        : [],
    [meta?.is_price_study, rows, theme?.palette?.primary]
  );
};
