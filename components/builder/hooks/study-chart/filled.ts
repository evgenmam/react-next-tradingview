import { useMemo } from "react";
import { ITVStudy, ITVStudyConfig } from "../../../tv-components/types";
import { colorerToZone } from "../../utils/builder.utils";
import { ITVPlot } from "./plots";

export type ITVFilled = {
  id: string;
  data1: ITVPlot;
  data2: ITVPlot;
  style: ITVStudy["meta"]["defaults"]["filledAreasStyle"][number];
  colorer?: ITVPlot;
};

const isGooPlot = (p: ITVPlot) => !p?.data?.some((v) => v[1] > 1000000000000);

export const useStudyChartArearanges = (
  study?: ITVStudy,
  plots?: ITVPlot[],
  config?: ITVStudyConfig
) => {
  const { meta } = study || {};
  const goodPlots = useMemo(() => plots?.filter(isGooPlot), [plots]);
  const filled = useMemo(
    () =>
      meta?.filledAreas
        ?.map(({ id, objAId, objBId }) => ({
          id,
          data1: goodPlots?.find((plot) => plot.id === objAId)!,
          data2: goodPlots?.find((plot) => plot.id === objBId)!,
          style: meta?.defaults?.filledAreasStyle?.[id],
          colorer: goodPlots?.find((p) => p.plot?.target === id),
        }))
        .filter(({ data1, data2 }) => data1 && data2),
    [meta?.filledAreas, goodPlots, meta?.defaults?.filledAreasStyle]
  );
  return useMemo(
    () =>
      filled?.map(({ data1, data2, colorer, id }) => ({
        id,
        name: data1?.title + " - " + data2?.title,
        zoneAxis: "x",
        type: "arearange" as const,
        data: data1?.data?.map((v, idx) => [v[0], v[1], data2?.data?.[idx][1]]),
        yAxis: study?.meta?.is_price_study ? "source" : "main",
        zones: colorer ? colorerToZone?.(colorer) : [],
      })) || [],
    [filled, study?.meta?.is_price_study]
  );
};
