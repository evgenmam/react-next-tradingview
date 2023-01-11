import { IChartData, ISignal } from "../../types/app.types";

export const applySignal = (rows: IChartData[]) => (signal: ISignal) => ({
  data: rows.filter((r, idx) =>
    signal.condition.every((c) => {
      const a = rows[idx - (c.a.offset || 0)]?.[c.a.field!];
      const b = rows[idx - (c.b.offset || 0)]?.[c.b.field!];
      const prevA = rows[idx - 1 - (c.a.offset || 0)]?.[c.a.field!];
      const prevB = rows[idx - 1 - (c.b.offset || 0)]?.[c.b.field!];
      if (a && b && prevA && prevB)
        switch (c.operator) {
          case "equals":
            return a === b;
          case "greater":
            return a > b;
          case "greaterOrEqual":
            return a >= b;
          case "less":
            return a < b;
          case "lessOrEqual":
            return a <= b;
          case "crossesUp":
            return prevA < prevB && a > b;
          case "crossesDown":
            return prevA > prevB && a < b;
          default:
            return false;
        }
    })
  ),
  signal,
});
