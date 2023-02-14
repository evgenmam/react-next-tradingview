import { PlotLineOptions } from "highcharts";
import { useMemo, useState } from "react";
import { useRows } from "../../../../hooks/data.hook";
import { applySignal } from "../../../../utils/calculations";
import { useChartEvents } from "../../context/events.context";

export const useStudyChartPlotlines = () => {
  const { conditions } = useChartEvents();
  const { rows } = useRows("source");

  const actual = useMemo(
    () => applySignal(rows)({ condition: conditions }),
    [conditions, rows]
  );
  const plotlines = useMemo(
    () =>
      conditions?.length
        ? [
            ...conditions.flatMap(
              (c) =>
                applySignal(rows)({
                  condition: [{ ...c, offset: 0 }],
                }).data?.map((r) => {
                  const isLast = actual?.data?.find((v) => v.time === r.time);
                  return {
                    dashStyle: "Dash",
                    color: c.color + "cc",
                    id:
                      (isLast ? "last" : "") + "condition" + JSON.stringify(c),
                    value: r.time,
                  };
                }) || []
            ),
            ...(applySignal(rows)({ condition: conditions }).data?.map((r) => ({
              width: 2,
              dashStyle: "Dash",
              color: conditions.at(-1)?.color,
              value: r.time,
            })) || []),
          ]
        : [],
    [rows, conditions, actual]
  );

  return plotlines;
};
