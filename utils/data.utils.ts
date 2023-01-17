import { Point } from "highcharts";
import { IChartData } from "../types/app.types";

export const filterEmpty = (data: IChartData[], fields: string[]) =>
  fields.filter((f) => data.some((d) => !!d[f]));

export const findClosestIndexByTime =
  (time: number) => (data: IChartData[]) => {
    const index = data.findIndex((d) => d.time >= time);
    return Math.abs(time - data[index]?.time || 0) >
      Math.abs(time - data[index - 1]?.time || 0)
      ? index - 1
      : index;
  };

export const findClosestIndexByX =
  (x: number, minDiff = 3) =>
  (data: Partial<Point>[]) => {
    const mind = (data[1]?.x! - data[0]?.x! || 1) * minDiff;
    const diff = (d: number) => Math.abs(x - d);
    const index = data.findIndex((d) => d.x! >= x && diff(d.x!) < mind);
    return Math.abs(x - data[index]?.x! || 0) >
      Math.abs(x - data[index - 1]?.x! || 0)
      ? index - 1
      : index;
  };
