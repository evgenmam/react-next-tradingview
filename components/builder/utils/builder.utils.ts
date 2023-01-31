import { ITVPlot } from "../hooks/study-chart/plots";
import * as R from "ramda";
import { ColorTool } from "../../../utils/color.utils";

type SZ = Highcharts.SeriesZonesOptionsObject;

export const colorerToZone = (
  colorer: ITVPlot
): Highcharts.SeriesZonesOptionsObject[] =>
  R.pipe<ITVPlot[], number[][], SZ[], SZ[][], SZ[]>(
    R.propOr([] as number[][], "data"),
    R.map<number[], SZ>(([x, y]) => ({
      value: x,
      color: colorer?.palette?.colors?.[y]?.color || new ColorTool(y).rgba,
    })),
    R.groupWith((a, b) => a.color === b.color),
    R.map<SZ[], SZ>(R.head)
  )(colorer);
