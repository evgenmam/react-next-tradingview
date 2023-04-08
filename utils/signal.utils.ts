import * as R from "ramda";
import { ISignal } from "../types/app.types";

export const flattenLinks = (signal: ISignal): ISignal[] => {
  if (signal.link) {
    return [signal, ...flattenLinks(signal.link.signal)];
  }
  return [signal];
};
