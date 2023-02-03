import useEventEmitter, { EventEmitter } from "ahooks/lib/useEventEmitter";
import noop from "lodash.noop";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type ChartEvent = {
  points?: Highcharts.Point[] | null;
};

export type IChartEventContext = {
  events: EventEmitter<ChartEvent>;
  selecting: boolean;
  setSelecting: Dispatch<SetStateAction<boolean>>;
};

export const ChartEventContext = createContext<IChartEventContext>({
  events: new EventEmitter<ChartEvent>(),
  selecting: false,
  setSelecting: noop,
});

export const ChartEventWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const events = useEventEmitter<ChartEvent>();
  const [selecting, setSelecting] = useState(false);

  return (
    <ChartEventContext.Provider value={{ events, selecting, setSelecting }}>
      {children}
    </ChartEventContext.Provider>
  );
};

export const useChartEvents = () => {
  return useContext(ChartEventContext);
};
