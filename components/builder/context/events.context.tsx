import useEventEmitter, { EventEmitter } from "ahooks/lib/useEventEmitter";
import { createContext, useContext } from "react";

export type ChartEvent = {
  points?: Highcharts.Point[] | null;
};
export const ChartEventContext = createContext<EventEmitter<ChartEvent>>(
  new EventEmitter<ChartEvent>()
);

export const ChartEventWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const emitter = useEventEmitter<ChartEvent>();
  return (
    <ChartEventContext.Provider value={emitter}>
      {children}
    </ChartEventContext.Provider>
  );
};

export const useChartEvents = () => {
  return useContext(ChartEventContext);
};
