import { useRows } from "../../../hooks/data.hook";
import { IChartData, ISignal, IStrategy } from "../../../types/app.types";
import { applySignal } from "../../../utils/calculations";
import * as R from "ramda";

export type ISEvents = Record<number, true>;

export type ISOpenClose = {
  open?: ISEvents;
  close?: ISEvents;
  openBars: number[];
  closeBars: number[];
};

const toEvents = (v: IChartData[]) =>
  v.reduce<ISEvents>((acc, { time }) => ({ ...acc, [time]: true }), {});

export const useSignalEvents = (strategy?: IStrategy): ISOpenClose => {
  const { rows: source } = useRows("source");
  if (strategy?.openSignal && strategy?.closeSignal) {
    const { data: open, bars: openBars } = applySignal(source)(
      strategy?.openSignal
    );
    const { data: close, bars: closeBars } = applySignal(source)(
      strategy?.closeSignal
    );
    return {
      open: toEvents(open),
      close: toEvents(close),
      openBars,
      closeBars,
    };
  }
  return { open: {}, close: {}, openBars: [], closeBars: [] };
};
