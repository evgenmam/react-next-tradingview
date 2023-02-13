import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useDebounce } from "use-debounce";
import * as R from "ramda";
type T = {
  event: Highcharts.PointerEventObject | null;
  x?: number;
  key: string;
};
export const PointerSetContext = createContext<(v: T) => void>((v: T) => v);

export const PointerGetContext = createContext<T>({
  event: null,
  key: "",
  x: 0,
});

export const PointerWrapper = ({ children }: { children: React.ReactNode }) => {
  const [active, setActive] = useState<T>({ event: null, key: "", x: 0 });
  return (
    <PointerSetContext.Provider value={setActive}>
      <PointerGetContext.Provider value={active}>
        {children}
      </PointerGetContext.Provider>
    </PointerSetContext.Provider>
  );
};

export const usePointerSet = () => {
  const get = useContext(PointerSetContext);
  return useCallback(get, []);
};

export const usePointerGet = (key?: string, same = false) => {
  const { event, key: k, x } = useContext(PointerGetContext);
  return R[same ? "not" : "identity"](key === k) ? null : { event, x };
};
