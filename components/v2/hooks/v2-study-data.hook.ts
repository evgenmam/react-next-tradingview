import {
  SeriesArearangeOptions,
  SeriesLineOptions,
  SeriesSplineOptions,
  SeriesZonesOptionsObject,
  YAxisOptions,
} from "highcharts";
import { useMemo } from "react";
import { studyToChart } from "../../../utils/study.utils";
import { useActiveStudies } from "./v2-data.hook";

export const useV2StudyData = ({
  top,
  height,
}: {
  top: Highcharts.YAxisOptions["top"];
  height: Highcharts.YAxisOptions["height"];
}): [
  s: {
    series: (
      | SeriesLineOptions
      | SeriesSplineOptions
      | SeriesArearangeOptions
    )[];
    yAxis: YAxisOptions[];
  }[],
  l: boolean
] => {
  const { studies, loading } = useActiveStudies();
  const chart = useMemo(
    () =>
      studies
        ?.filter((v) => !v.config?.hidden)
        .map((v) => studyToChart(v, height, top)),
    [studies, height, top]
  );
  return [chart, loading];
};
