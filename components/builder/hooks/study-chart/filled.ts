import { useMemo } from "react";
import { ITVStudy, ITVStudyConfig } from "../../../tv-components/types";
import { colorerToZone, isAllSame } from "../../utils/builder.utils";
import { ITVPlot } from "./plots";
import * as R from "ramda";

export type ITVFilled = {
  id: string;
  data1: ITVPlot;
  data2: ITVPlot;
  style: ITVStudy["meta"]["defaults"]["filledAreasStyle"][number];
  colorer?: ITVPlot;
};

const isGooPlot = (p: ITVPlot) => !isAllSame(p.data);

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
          data1: goodPlots?.find(({ plot }) => plot.id === objAId)!,
          data2: goodPlots?.find(({ plot }) => plot.id === objBId)!,
          style: meta?.defaults?.filledAreasStyle?.[id],
          colorer: goodPlots?.find((p) => p.plot?.target === id),
        }))
        .filter((v) => v.data1 && v.data2),
    [meta?.filledAreas, goodPlots, meta?.defaults?.filledAreasStyle]
  );
  return useMemo(
    () =>
      filled?.map(({ data1, data2, colorer, id }) => ({
        id,
        name: data1?.name + ":" + data2?.name,
        zoneAxis: "x",
        type: "arearange" as const,
        data: data1?.data?.map((v, idx) => [v[0], v[1], data2?.data?.[idx][1]]),
        yAxis: study?.meta?.is_price_study ? "source" : "main",
        zones: colorer ? colorerToZone?.(colorer) : [],
      })) || [],
    [filled, study?.meta?.is_price_study]
  );
};
