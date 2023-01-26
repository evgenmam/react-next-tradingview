import { ITVIndicator, ITVSymbol, ITVSymbolList } from "../tv-components/types";

export type IChartConfig = {
  name: string;
  list: number;
  symbol: ITVSymbol;
  populatedList?: ITVSymbolList;
};

export type IPreset = {
  id?: number;
  name: string;
  indicators: ITVIndicator[] & { hidden?: boolean };
  selected?: boolean;
};
