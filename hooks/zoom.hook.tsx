import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { useDebounce } from "use-debounce";

type IChartZoom = { min: number; max: number };
export const ZoomSetContext = createContext<(v: IChartZoom) => void>(
  (v: IChartZoom) => v
);

export const ZoomGetContext = createContext<IChartZoom>({ min: 0, max: 0 });

export const ZoomWrapper = ({ children }: { children: React.ReactNode }) => {
  const [zoom, setZoom] = useState<IChartZoom>({ min: 0, max: 0 });
  return (
    <ZoomSetContext.Provider value={setZoom}>
      <ZoomGetContext.Provider value={zoom}>{children}</ZoomGetContext.Provider>
    </ZoomSetContext.Provider>
  );
};

export const useZoomSet = () => {
  return useContext(ZoomSetContext);
};

export const useZoomGet = () => {
  const zoom = useContext(ZoomGetContext);
  const [debounced] = useDebounce(zoom, 100, { leading: true, trailing: true });
  return debounced;
};
