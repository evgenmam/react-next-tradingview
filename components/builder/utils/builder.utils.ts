import { ITVPlot } from "../hooks/study-chart/plots";
import * as R from "ramda";
import { ColorTool } from "../../../utils/color.utils";
import { ITVBarColorer } from "../hooks/study-chart/bar-colorers";
import { IChartData } from "../../../types/app.types";
import { CLOSING } from "ws";
import { ITVStudy, ITVStudyConfig } from "../../tv-components/types";

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

export const isAllSame = R.pipe(R.pluck(1), R.uniq, R.length, R.equals(1));

export const getIdFromPoint = (point: Highcharts.Point): string => {
  const { name, id, title } = point?.series?.options as any;
  return `${title}:${name}----${id?.split(":")[1]}`;
};

export const conditionOptions = [
  "true",
  "crossesUp",
  "crossesDown",
  "equals",
  "greater",
  "less",
  "greaterOrEqual",
  "lessOrEqual",
] as const;

export const barColorersToSeries = (data: IChartData[] = [], maxDigits = 4) =>
  R.pipe<
    ITVBarColorer[][],
    Record<string, ITVBarColorer[]>,
    ITVBarColorer[][],
    Highcharts.SeriesSplineOptions[],
    Highcharts.SeriesSplineOptions[]
  >(
    R.groupBy((v) => v?.color + "|" + v?.name),
    R.values,
    R.addIndex<ITVBarColorer[], Highcharts.SeriesSplineOptions>(R.map)(
      (v, i) => ({
        type: "spline" as const,
        color: v?.[0].color,
        name: v[0].name,
        id: `${v[0].id}:${v?.[0].color}`,
        title: v[0].title,
        data: data.map(({ time, close }) => ({
          x: time,
          y: v?.find((d) => d.value === time) ? close : null,
        })),
        connectNulls: false,
        yAxis: "source",
        zIndex: 1000,
        states: {
          inactive: {
            opacity: 1,
          },
        },
        tooltip: {
          pointFormat: `<span style="color: {series.color};">{series.name}: <b>{point.y}</b></span><br/>`,
          decimals: maxDigits,
        },
      })
    ),
    R.map((v) => ({
      ...v,
      data: (v.data as Highcharts.PointOptionsObject[])?.map(
        (d: Highcharts.PointOptionsObject, idx) => {
          return {
            ...d,
            marker: {
              // @ts-ignore
              enabled: !v?.data?.[idx - 1]?.y && !v?.data?.[idx + 1]?.y,
              symbol: "circle",
              radius: 3,
            },
          };
        }
      ),
    }))
  );

export const studyToBarColorers = (
  s?: ITVStudy,
  c?: ITVStudyConfig
): ITVBarColorer[] => {
  return (
    s?.meta?.plots
      ?.filter((p) => p?.type === "bar_colorer")
      .map((p) => ({
        id: `${s?.meta?.scriptIdPart}:${p?.id}`,
        name: s?.meta?.styles?.[p?.id]?.title,
        title: `${s?.meta?.description}`,
        palette: {
          ...s?.meta?.defaults?.palettes?.[p?.palette || ""],
          valToIndex: s?.meta?.palettes?.[p?.palette || ""]?.valToIndex,
        },
        plot: p,
        s,
        data: s?.data?.st
          ?.map((v) => [v?.v?.[0], v?.v?.[R.indexOf(p, s?.meta?.plots) + 1]])
          ?.filter((v) => !!v[1]),
        hidden: c?.hideFields?.[p?.id],
      }))
      ?.filter(({ data }) => data?.some?.((v) => v[1] !== 0))
      ?.flatMap(({ data, palette, ...d }) =>
        data?.map((v) => ({
          color:
            palette?.colors?.[
              palette?.valToIndex ? palette?.valToIndex?.[v[1]] : v[1]
            ]?.color,
          value: v[0],
          label: d?.name,
          ...d,
        }))
      ) || []
  );
};
