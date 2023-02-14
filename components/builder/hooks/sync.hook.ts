import { differenceInDays, differenceInMinutes, isSameMinute } from "date-fns";
import { isSameDay } from "date-fns/fp";
import { difference } from "ramda";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useSettings } from "../../../hooks/settings.hook";
import { findClosestIndexByX } from "../../../utils/data.utils";
import { usePointerGet } from "../context/pointer.context";
import { useRangeGet } from "../context/range.context";
import * as R from "ramda";
import { periodDiff } from "../../configs/period.config";
import {
  PlotLineOrBand,
  PointerEventObject,
  XAxisPlotLinesOptions,
} from "highcharts";
import { useChartEvents } from "../context/events.context";

const matchPoints =
  (period: keyof typeof periodDiff) => (x1: number, x2: number) => {
    return x1 - x2 >= 0 && x1 - x2 < periodDiff[period];
  };

export const usePointSync = (key: string, chart?: Highcharts.Chart) => {
  const { event, x } = usePointerGet(key) || {};
  const [dx] = useDebounce(x, 10);
  const { period, syncLine } = useSettings();
  useEffect(() => {
    if (event && chart && dx && syncLine) {
      const points = chart?.series
        ?.map(
          (v) => v?.points?.find((v) => matchPoints(period)(v?.x, dx))! || null
        )
        .filter((v) => v);

      const point = points?.[0];

      if (point) {
        point?.series?.yAxis?.drawCrosshair?.(event, point);
        point?.series?.xAxis?.drawCrosshair?.(event, point);
        point?.setState?.("hover");

        chart?.tooltip?.refresh?.(points);
      }
      // if (points?.length > 1) {
      //   points?.forEach((v, idx) => v.graphic?.translate(0, idx * 10));
      // }
      return () => {
        points?.forEach((v) => v?.setState?.("normal"));
        chart?.tooltip?.hide(2);
        // if (points?.length > 1) {
        //   points?.forEach((v, ) => v.graphic?.translate(0, 0));
        // }
      };
    }
  }, [event, chart, dx, syncLine, key, period]);
};

export const useRangeSync = (key: string, chart?: Highcharts.Chart) => {
  const range = useRangeGet(key);
  const { syncRange } = useSettings();
  useEffect(() => {
    if (range && chart && syncRange) {
      chart?.xAxis[0]?.setExtremes?.(range.min, range.max, undefined, false, {
        trigger: "sync",
      });
    }
  }, [range, chart, syncRange]);
};

export const usePlotlineSync = (key: string, chart?: Highcharts.Chart) => {
  const { event, x } = usePointerGet(key, true) || {};
  const { selecting } = useChartEvents();
  const [dx] = useDebounce(x, 10);
  const { period } = useSettings();
  useEffect(() => {
    if (selecting) {
      const axs = chart?.xAxis?.[0];
      const pls = axs?.options?.plotLines || [];
      if (pls) {
        axs?.removePlotBand("lastPDB");
        const plot = R.pipe<
          XAxisPlotLinesOptions[][],
          XAxisPlotLinesOptions[],
          XAxisPlotLinesOptions[],
          XAxisPlotLinesOptions | undefined
        >(
          R.filter<XAxisPlotLinesOptions>((v) => !!v.id?.startsWith("last")),
          R.reverse,
          R.find<XAxisPlotLinesOptions>((v) => v?.value! <= dx!)
        )(pls);
        if (plot && dx) {
          const distance = Math.floor(
            (dx! - plot?.value!) /
              (periodDiff[period as keyof typeof periodDiff] || 1)
          );
          const pb = axs?.addPlotBand({
            color: "#444",
            from: plot.value,
            to: dx,
            id: "lastPDB",
            borderColor: plot.color,
            label: distance
              ? {
                  text: `${distance} bars`,
                  align: "left",
                  verticalAlign: "bottom",
                  style: {
                    color: "#fff",
                  },
                  y: -20,
                  x: 2,
                }
              : {},
          });
        }
      }
    }
  }, [selecting, dx, chart, period, key]);
};
