import { createContext, useCallback, useContext, useState } from "react";

type T = {
  event: Highcharts.AxisSetExtremesEventObject | null;
  key: string;
};
export const RangeSetContext = createContext<(v: T) => void>((v: T) => v);

export const RangeGetContext = createContext<T>({ event: null, key: "" });

export const RangeWrapper = ({ children }: { children: React.ReactNode }) => {
  const [active, setActive] = useState<T>({ event: null, key: "" });
  return (
    <RangeSetContext.Provider value={setActive}>
      <RangeGetContext.Provider value={active}>
        {children}
      </RangeGetContext.Provider>
    </RangeSetContext.Provider>
  );
};

export const useRangeSet = () => {
  const get = useContext(RangeSetContext);
  return useCallback(get, []);
};

export const useRangeGet = (key?: string) => {
  const { event, key: k } = useContext(RangeGetContext);
  // const [v] = useDebounce(event, 100);
  if (key === k) return null;
  return event;
};

export const useRangeControls = () => {
  const set = useRangeSet();
  const get = useRangeGet();

  return {
    set,
    get,
  };
};
