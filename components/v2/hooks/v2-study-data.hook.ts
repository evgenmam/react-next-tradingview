import { useMemo } from "react";
import { studyToChart } from "../../../utils/study.utils";
import { useActiveStudies } from "./v2-data.hook";

export const useV2StudyData = ({
  top,
  height,
}: {
  top: Highcharts.YAxisOptions["top"];
  height: Highcharts.YAxisOptions["height"];
}) => {
  const { studies } = useActiveStudies();
  const chart = useMemo(
    () => studies.map((v) => studyToChart(v, height, top)),
    [studies, height, top]
  );
  return chart;
};
