import * as R from "ramda";
import { Palette } from "../api/types";
import { ITVStudy } from "../components/tv-components/types";
import { getLabelAxis } from "./chart.utils";
import { ColorTool } from "./color.utils";

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

const isGoodPlot = (p: ITVPlot) =>
  p.data?.some(([, y]) => !isNaN(y) && y !== 1e100);
const isGoodLine = (p: ITVPlot) => p.styles?.plottype === PlotTypes.Line;

const getLines = (
  plots: ITVPlot[],
  study: ITVStudy
): Highcharts.SeriesLineOptions[] => {
  const lines = plots?.filter?.(isGoodLine);
  return lines.map(({ data, id, styles, title }) => ({
    data,
    type: "line" as const,
    yAxis: study.meta?.is_price_study ? "source" : `${study?.data?.node}`,
    name: title,
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

const getFilled = (filled: ITVFilled[], study: ITVStudy) => {
  return (
    filled?.map(({ data1, data2, style }) => ({
      type: "arearange" as const,
      data: data1?.data?.map((v, idx) => [v[0], v[1], data2?.data?.[idx][1]]),
      yAxis: study.meta?.is_price_study ? "source" : `${study?.data?.node}`,
      color: style?.color,
    })) || []
  );
};

export const getCircles = (plots: ITVPlot[], study: ITVStudy) => {
  const circles = plots?.filter?.(
    (p) => p.styles?.plottype === PlotTypes.Circles
  );
  return circles.map(({ data, id, styles, title }) => ({
    data,
    name: title,
    yAxis: study.meta?.is_price_study ? "source" : `${study?.data?.node}`,
    zoneAxis: "x",
    color: styles?.color,
    type: "spline" as string,
    lineWidth: 0,
    marker: {
      enabled: true,
      symbol: "circle",
      radius: 4,
    },
    states: {
      hover: {
        lineWidthPlus: 0,
      },
    },
    zones: plots
      ?.filter(({ plot }) => plot.target === id)
      .flatMap(colorerToZone),
  }));
};

export const getShapes = (plots: ITVPlot[], study: ITVStudy) => {
  // console.log(plots);
};

export const getAlerts = (
  plots: ITVPlot[],
  study: ITVStudy
): Highcharts.SeriesFlagsOptions[] => {
  const alerts = plots?.filter?.(
    (p) => p.plot?.type === "alertcondition" && p.data?.some((v) => v[1])
  );
  return alerts?.map(({ title, id, data }, idx) => {
    return {
      yAxis: "source-left",
      onSeries: "source-ds",
      type: "flags" as const,
      data: data.filter((c) => c[1])?.map((c) => ({ x: c[0], title })),
      style: {
        fontSize: '8px',
      },
      // lineWidth: 0,
      // marker: {
      //   enabled: true,
      //   symbol: "circle",
      //   radius: 4,
      // },
      // states: {
      //   hover: {
      //     lineWidthPlus: 0,
      //   },
      // },
    };
  });
};

export const studyToChart = (
  study: ITVStudy,
  height: Highcharts.YAxisOptions["height"] = 300,
  top: Highcharts.YAxisOptions["top"]
) => {
  const { data, meta } = study || {};
  const rows = data?.st?.filter?.((v) => v.i >= 0);
  const plots = meta?.plots
    ?.map(({ id, ...s }, idx) => ({
      id,
      info: meta?.styles?.[id],
      title: meta?.styles?.[id]?.title,
      styles: meta?.defaults?.styles?.[id],
      data: rows?.map?.((v) => [v?.v?.[0], v?.v?.[idx + 1]]),
      plot: { id, ...s },
      palette: meta?.defaults?.palettes?.[s?.palette || ""],
    }))
    ?.filter((v) => !meta?.styles?.[v?.id]?.isHidden)
    .filter(isGoodPlot);
  const filled = meta?.filledAreas
    ?.map(({ id, objAId, objBId }, idx) => ({
      id,
      data1: plots?.find((plot) => plot.id === objAId)!,
      data2: plots?.find((plot) => plot.id === objBId)!,
      style: meta?.defaults?.filledAreasStyle?.[idx],
    }))
    .filter(({ data1, data2 }) => data1 && data2);

  const lines = getLines(plots, study);
  const arearange = getFilled(filled, study);

  const circles = getCircles(plots, study);
  const shapes = getShapes(plots, study);
  const alerts = getAlerts(plots, study);
  console.log(alerts);
  return {
    series: [...lines, ...arearange, ...circles, ...alerts],
    yAxis: meta?.is_price_study
      ? []
      : [
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
  study?.meta?.plots?.map(({ id }) => ({
    title: study?.meta?.styles?.[id]?.title,
    key: id,
  }));

export const getKeyedStudyData = (
  study: ITVStudy
): Record<string, number>[] => {
  const keys = [{ key: "time", title: "time" }, ...getStudyFields(study)];
  // ?.filter((v) => v);
  return study?.data?.st?.map(({ v }) =>
    keys.reduce((acc, key, i) => (key ? { ...acc, [key.key]: v[i] } : acc), {})
  );
};
