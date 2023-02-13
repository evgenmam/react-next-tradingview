import useEventEmitter, { EventEmitter } from "ahooks/lib/useEventEmitter";
import noop from "lodash.noop";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { IChartData, ICondition, ISignal } from "../../../types/app.types";

export type ChartEvent = {
  points?: Highcharts.Point[] | null;
  offset?: number;
};
type SRes = {
  data: IChartData[];
  signal: ISignal;
} | null;

export type IChartEventContext = {
  events: EventEmitter<ChartEvent>;
  selecting: boolean;
  setSelecting: Dispatch<SetStateAction<boolean>>;
  conditions: ICondition[];
  setConditions: Dispatch<SetStateAction<ICondition[]>>;
};

export const ChartEventContext = createContext<IChartEventContext>({
  events: new EventEmitter<ChartEvent>(),
  selecting: false,
  setSelecting: noop,
  conditions: [],
  setConditions: noop,
});

export const ChartEventWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const events = useEventEmitter<ChartEvent>();
  const [selecting, setSelecting] = useState(false);
  const [conditions, setConditions] = useState<ICondition[]>([]);

  return (
    <ChartEventContext.Provider
      value={{
        events,
        selecting,
        setSelecting,
        conditions,
        setConditions,
      }}
    >
      {children}
    </ChartEventContext.Provider>
  );
};

export const useChartEvents = () => {
  return useContext(ChartEventContext);
};
