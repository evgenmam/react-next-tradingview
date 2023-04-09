import { AxisSetExtremesEventObject, XAxisPlotLinesOptions } from "highcharts";
import { useRows, useSetting } from "../../../hooks/data.hook";
import { useSignalsContext } from "../context/signals.context";
import { useRangeSet } from "../context/range.context";
import { useEffect, useMemo } from "react";
import * as R from "ramda";
import { PointerAxisCoordinateObject } from "highcharts";
import { IPeriod, periodDiff } from "../../configs/period.config";
import { useTheme } from "@mui/joy";
import { colord } from "colord";
import { IChartData, ISignal } from "../../../types/app.types";
import { applySignal } from "../../../utils/calculations";

export const useStudyChartSignals = () => {
  const [period] = useSetting<IPeriod>("period");
  const { palette } = useTheme();

  const { selected } = useSignalsContext();
  const setRange = useRangeSet();
  const { rows } = useRows("source");
  const events = selected.map(applySignal(rows));
  const lines: XAxisPlotLinesOptions[] = events.flatMap((event, idx) =>
    event.data.map((data) => ({
      value: data.time,
      color: colord(event.signal.color || "#fff")
        .alpha(0.5)
        .toHex(),
      width: 3,
      label: {
        enabled: true,
        rotation: 0,
        verticalAlign: "bottom",
        style: {
          color: palette.text.primary,
        },
        y: -5 - idx * 15,
        text: event.signal.name || `Signal ${event.signal.id}`,
      },
    }))
  );

  const [min, max] = useMemo(
    () =>
      R.pipe(
        R.sortBy(R.prop("value")),
        R.juxt([R.head, R.last])
      )(lines) as PointerAxisCoordinateObject[],
    [lines]
  );
  // useEffect(() => {
  //   if (min && max && period) {
  //     setRange({
  //       event: {
  //         min: min.value - periodDiff[period] * 2,
  //         max: max.value + periodDiff[period] * 2,
  //       } as AxisSetExtremesEventObject,
  //       key: "signal",
  //     });
  //   }
  // }, [min, max, period, setRange]);
  return lines;
};
