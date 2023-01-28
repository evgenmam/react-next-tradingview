import * as R from "ramda";
import { Palette } from "../api/types";
import { ITVStudy } from "../components/tv-components/types";
import { getLabelAxis } from "./chart.utils";

const PlotTypes = {
  0: "Line",
  1: "Histogram",
  3: "Cross",
  4: "Area",
  5: "Columns",
  6: "Circles",
  7: "LineWithBreaks",
  8: "AreaWithBreaks",
  9: "StepLine",
  10: "StepLineWithDiamonds",
  Area: 4,
  AreaWithBreaks: 8,
  Circles: 6,
  Columns: 5,
  Cross: 3,
  Histogram: 1,
  Line: 0,
  LineWithBreaks: 7,
  StepLine: 9,
  StepLineWithDiamonds: 10,
};

type ITVPlot = {
  id: string;
  info: ITVStudy["meta"]["styles"][string];
  title: string;
  styles: ITVStudy["meta"]["defaults"]["styles"][string];
  data: number[][];
  plot: ITVStudy["meta"]["plots"][number];
  palette: Palette;
};

type SZ = Highcharts.SeriesZonesOptionsObject;
const colorerToZone = (
  colorer: ITVPlot
): Highcharts.SeriesZonesOptionsObject[] =>
  R.pipe<ITVPlot[], number[][], SZ[], SZ[][], SZ[]>(
    R.propOr([] as number[][], "data"),
    R.map<number[], SZ>(([x, y]) => ({
      value: x,
      color: colorer?.palette?.colors?.[y]?.color,
    })),
    R.groupWith((a, b) => a.color === b.color),
    R.map<SZ[], SZ>(R.head)
  )(colorer);

const isGoodLine = (p: ITVPlot) =>
  p.styles?.plottype === PlotTypes.Line &&
  p.data?.some(([, y]) => !isNaN(y) && y !== 1e100);

const getLines = (
  plots: ITVPlot[],
  nodeId: string
): Highcharts.SeriesLineOptions[] => {
  const lines = plots?.filter?.(isGoodLine);
  return lines.map(({ data, id, styles }) => ({
    data,
    type: "line" as const,
    yAxis: `${nodeId}`,
    zoneAxis: "x",
    lineWidth: styles?.linewidth,
    color: styles?.color,
    zones: plots
      ?.filter(({ plot }) => plot.target === id)
      .flatMap(colorerToZone),
  }));
};

type ITVFilled = {
  id: string;
  data1: ITVPlot;
  data2: ITVPlot;
  style: ITVStudy["meta"]["defaults"]["filledAreasStyle"][number];
};

const getFilled = (filled: ITVFilled[], nodeId: string) => {
  return filled.map(({ data1, data2, style }) => ({
    type: "arearange" as const,
    data: data1?.data?.map((v, idx) => [v[0], v[1], data2?.data?.[idx][1]]),
    yAxis: `${nodeId}`,
    color: style?.color,
  }));
};

export const studyToChart = (
  study: ITVStudy,
  height: Highcharts.YAxisOptions["height"] = 300,
  top: Highcharts.YAxisOptions["top"]
) => {
  console.log(study);
  const { data, meta } = study || {};
  const rows = data?.st?.filter?.((v) => v.i >= 0);
  const plots = meta?.plots?.map(({ id, ...s }, idx) => ({
    id,
    info: meta?.styles?.[id],
    title: meta?.styles?.[id]?.title,
    styles: meta?.defaults?.styles?.[id],
    data: rows?.map?.((v) => [v?.v?.[0], v?.v?.[idx + 1]]),
    plot: { id, ...s },
    palette: meta?.defaults?.palettes?.[s?.palette || ""],
  }));
  const filled = meta?.filledAreas
    ?.map(({ id, objAId, objBId }, idx) => ({
      id,
      data1: plots?.find((plot) => plot.id === objAId)!,
      data2: plots?.find((plot) => plot.id === objBId)!,
      style: meta?.defaults?.filledAreasStyle?.[idx],
    }))
    .filter(({ data1, data2 }) => data1 && data2);
  // const bands = meta?.bands?.map(({ id, ...s }, idx) => ({
  //   id,
  //   info: meta?.styles?.[id],
  //   title: meta?.styles?.[id]?.title,
  //   styles: meta?.defaults?.bands?.[idx],
  //   data: rows?.map?.((v) => [v?.v?.[0], v?.v?.[idx + 1]]),
  //   band: { id, ...s },
  // }));
  const lines = getLines(plots, data?.node);
  const arearange = getFilled(filled, data?.node);
  return {
    series: [...lines, ...arearange],
    yAxis: [
      {
        id: `${data?.node}`,
        height,
        top,
      },
      getLabelAxis(data?.node, study?.meta?.description, top),
    ],
  };
  // const data =
};

export const getStudyFields = (study: ITVStudy) =>
  study?.meta?.plots?.map(({ id }) => study?.meta?.styles?.[id]?.title);

export const getKeyedStudyData = (
  study: ITVStudy
): Record<string, number>[] => {
  const keys = ["time", ...getStudyFields(study)];
  // ?.filter((v) => v);
  return study?.data?.st?.map(({ v }) =>
    keys.reduce((acc, key, i) => (key ? { ...acc, [key]: v[i] } : acc), {})
  );
};
