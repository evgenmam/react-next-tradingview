import { useMemo } from "react";
import { Palette } from "../../../../api/types";
import { ITVStudy, ITVStudyConfig } from "../../../tv-components/types";
export type ITVPlot = {
  id: string;
  info: ITVStudy["meta"]["styles"][string];
  title: string;
  styles: ITVStudy["meta"]["defaults"]["styles"][string];
  data: number[][];
  plot: ITVStudy["meta"]["plots"][number];
  palette: Palette;
};
export const useStudyChartPlots = (
  study?: ITVStudy,
  config?: ITVStudyConfig
): ITVPlot[] => {
  const { data, meta } = study || {};
  const rows = useMemo(() => data?.st?.filter?.((v) => v.i >= 0), [data?.st]);
  const plots = useMemo(
    () =>
      meta?.plots?.map(({ id, ...s }, idx) => ({
        id,
        info: meta?.styles?.[id],
        title: meta?.styles?.[id]?.title,
        styles: meta?.defaults?.styles?.[id],
        data: rows?.map?.((v) => [v?.v?.[0], v?.v?.[idx + 1]]) || [],
        plot: { id, ...s },
        palette: meta?.defaults?.palettes?.[s?.palette || ""],
      })),
    // ?.filter((v) => !meta?.styles?.[v?.id]?.isHidden)
    // .filter(isGoodPlot)
    // .filter(
    //   (v) =>
    //     study?.config?.showFields?.includes(v.id) ||
    //     v?.plot?.type === "colorer"
    // )
    [
      meta?.styles,
      meta?.plots,
      meta?.defaults?.styles,
      meta?.defaults?.palettes,
      rows,
      study?.config?.showFields,
    ]
  );
  return plots || [];
};
