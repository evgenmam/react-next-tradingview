import { ITVSymbol } from "../types";

export const getSymbolKey = (s?: ITVSymbol) =>
  !s ? "" : (s.prefix || s.exchange) + ":" + s.symbol;
