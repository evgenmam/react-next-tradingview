import { useMemo } from "react";
import { ITVStudy, ITVStudyConfig } from "../../../tv-components/types";
import { colorerToZone, isAllSame } from "../../utils/builder.utils";
import { ITVPlot } from "./plots";
import * as R from "ramda";
import { ColorTool } from "../../../../utils/color.utils";
import { GradientColorObject } from "highcharts";
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
  plots?: ITVPlot[]
) => {
  const { meta } = study || {};
  const goodPlots = useMemo(() => plots?.filter(isGooPlot), [plots]);
  const filled = useMemo(
    () =>
      meta?.filledAreas
        ?.map(({ id, objAId, objBId }) => ({
          id: `${study?.meta?.scriptIdPart}:${id}`,
          title: study?.meta?.description,
          data1: goodPlots?.find(({ plot }) => plot.id === objAId)!,
          data2: goodPlots?.find(({ plot }) => plot.id === objBId)!,
          style: meta?.defaults?.filledAreasStyle?.[id],
          colorer: goodPlots?.find((p) => p.plot?.target === id),
        }))
        .filter((v) => v.data1 && v.data2),
    [
      meta?.filledAreas,
      goodPlots,
      meta?.defaults?.filledAreasStyle,
      study?.meta?.scriptIdPart,
      study?.meta?.description,
    ]
  );
  return useMemo(
    () =>
      filled?.map(({ data1, data2, colorer, id }) => {
        const color = colorer?.data
          ? ({
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 1,
                y2: 0,
              },
              stops:
                colorer?.data?.map((v, idx) => [
                  idx / colorer?.data?.length,
                  colorer?.palette?.colors?.[v[1]]?.color ||
                    new ColorTool(v[1]).rgba,
                ]) || [],
            } as Highcharts.GradientColorObject)
          : data1?.styles?.color && data2?.styles?.color
          ? {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, data1?.styles?.color],
                [1, data2?.styles?.color],
              ],
            }
          : undefined;
        return {
          id,
          name: data1?.name + ":" + data2?.name,
          zoneAxis: "x",
          type: "arearange" as const,
          data: data1?.data?.map((v, idx) => {
            let color: string | GradientColorObject = "#fff";
            if (colorer) {
              color =
                colorer?.palette?.colors?.[colorer?.data?.[idx][1]]?.color ||
                new ColorTool(colorer?.data?.[idx]?.[1]).rgba ||
                color;
            } else if (data1?.styles?.color) {
              color = {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                  [0, "#003399"], // start
                  [0.5, "#ffffff"], // middle
                  [1, "#3366AA"], // end
                ],
              };
            }
            return {
              x: v[0],
              low: v[1],
              high: data2?.data?.[idx][1],
              color,
            };
          }),
          yAxis: study?.meta?.is_price_study ? "source" : "main",
          color,
          // zones: colorer ? colorerToZone?.(colorer)?.slice(1) : [],
        } as Highcharts.SeriesArearangeOptions;
      }) || [],
    [filled, study?.meta?.is_price_study]
  );
};
