import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";

export const HoverSetContext = createContext<(v: number) => void>(
  (v: number) => v
);

export const HoverGetContext = createContext<number>(0);

export const HoverWrapper = ({ children }: { children: React.ReactNode }) => {
  const [active, setActive] = useState(0);
  return (
    <HoverSetContext.Provider value={setActive}>
      <HoverGetContext.Provider value={active}>
        {children}
      </HoverGetContext.Provider>
    </HoverSetContext.Provider>
  );
};

export const useHoverSet = () => {
  return useContext(HoverSetContext);
};

export const useHoverGet = () => {
  return useContext(HoverGetContext);
};
