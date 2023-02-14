import { IStrategy } from "../types/app.types";

export const getReverseDataset = (dataset?: string): string =>
  dataset === "target" ? "target2" : "target";

export const getReversalStrategy = (
  strategy?: IStrategy
): IStrategy | undefined =>
  strategy
    ? {
        ...strategy,
        dataset: getReverseDataset(strategy?.dataset),
        direction: strategy?.direction === "short" ? "long" : "short",
        openSignal: strategy?.closeSignal,
        closeSignal: strategy?.openSignal,
      }
    : undefined;
