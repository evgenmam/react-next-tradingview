import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { ISignal } from "../../../types/app.types";
import noop from "lodash.noop";
import * as R from "ramda";
export type SignalsContext = {
  selected: ISignal[];
  setSelected: Dispatch<SetStateAction<ISignal[]>>;
};

export const SignalsContext = createContext<SignalsContext>({
  selected: [],
  setSelected: noop,
});

export const useSignalsContext = () => useContext(SignalsContext);

export const SignalsWrapper = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<ISignal[]>([]);

  return (
    <SignalsContext.Provider value={{ selected, setSelected }}>
      {children}
    </SignalsContext.Provider>
  );
};
