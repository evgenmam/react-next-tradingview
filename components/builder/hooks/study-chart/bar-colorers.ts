import { useMemo } from "react";
import { ITVStudy, ITVStudyConfig } from "../../../tv-components/types";
import { useActiveStudies } from "../../../v2/hooks/v2-data.hook";
import * as R from "ramda";

export const useBarColorers = (study?: ITVStudy, config?: ITVStudyConfig) => {
  const { studies } = useActiveStudies();
  const colorers = useMemo(
    () =>
      studies
        ?.filter((s) => !s?.config?.hidden)
        ?.flatMap((s) =>
          s?.meta?.plots
            ?.filter((p) => p?.type === "bar_colorer")
            .map((p) => ({
              id: s.meta?.shortDescription + ":" + p?.id,
              palette: {
                ...s?.meta?.defaults?.palettes?.[p?.palette || ""],
                valToIndex: s?.meta?.palettes?.[p?.palette || ""]?.valToIndex,
              },
              plot: p,
              s,
              data: s?.data?.st
                ?.map((v) => [
                  v?.v?.[0],
                  v?.v?.[R.indexOf(p, s?.meta?.plots) + 1],
                ])
                ?.filter((v) => !!v[1]),
              title: s?.meta?.styles?.[p?.id]?.title,
            }))
            ?.filter(({ data }) => data?.some?.((v) => v[1] !== 0))
            ?.flatMap(({ data, palette, plot, id, title }) =>
              data?.map((v) => ({
                color:
                  palette?.colors?.[
                    palette?.valToIndex ? palette?.valToIndex?.[v[1]] : v[1]
                  ]?.color,
                value: v[0],
                id,
                label: title,
              }))
            )
        ),
    [studies]
  );
  return colorers;
};
