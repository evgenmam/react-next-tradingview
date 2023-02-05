import { useRows } from "../../../hooks/data.hook";
import { IChartData, ISignal, IStrategy } from "../../../types/app.types";
import { applySignal } from "../../../utils/calculations";
import * as R from "ramda";

export type ISEvents = Record<number, true>;

export type ISOpenClose = { open?: ISEvents; close?: ISEvents };

const toEvents = R.reduce<IChartData, ISEvents>(
  (acc, { time }) => ({ ...acc, [time]: true }),
  {}
);

export const useSignalEvents = (strategy?: IStrategy): ISOpenClose => {
  const { rows: source } = useRows("source");
  if (strategy?.openSignal && strategy?.closeSignal) {
    const { data: open } = applySignal(source)(strategy?.openSignal);
    const { data: close } = applySignal(source)(strategy?.closeSignal);
    return {
      open: toEvents(open),
      close: toEvents(close),
    };
  }
  return { open: {}, close: {} };
};
