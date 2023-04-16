import { useDebugValue } from "react";
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

export const useSignalEvents = (
  strategy?: IStrategy,
  r?: IChartData[]
): ISOpenClose => {
  const { rows: source } = useRows("source");
  useDebugValue(strategy);

  if (strategy?.openSignal && strategy?.closeSignal) {
    const { data: open, bars: openBars } = applySignal(r || source)(
      strategy?.openSignal
    );
    const { data: close, bars: closeBars } = applySignal(r || source)(
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
