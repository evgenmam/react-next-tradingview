import { IChartData } from "../types/app.types";

export const filterEmpty = (data: IChartData[], fields: string[]) =>
  fields.filter((f) => data.some((d) => !!d[f]));
