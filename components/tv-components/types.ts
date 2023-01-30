import { MetaInfo, StudyData } from "../../api/types";

export type ITVContract = {
  description: string;
  symbol: string;
  typespecs: string[];
};
export type ITVSearchResult = {
  country: string;
  currency_code: string;
  description: string;
  exchange: string;
  logoid: string;
  provider_id: string;
  symbol: string;
  type: string;
  prefix?: string;
  typespecs: string[];
  contracts?: ITVContract[];
};

export type ITVSearchData = {
  symbols: ITVSearchResult[];
  symbols_remaining: number;
};

export type ITVIndicatorAuthor = {
  id: number;
  username: string;
  is_broker: boolean;
};

export type ITVIndicatorExtra = {
  kind: string;
  sourceInputsCount: number;
};

export type ITVIndicator = {
  imageUrl: string;
  scriptName: string;
  scriptSource: string;
  access: number;
  scriptIdPart: string;
  version: string;
  extra: ITVIndicatorExtra;
  agreeCount: number;
  author: ITVIndicatorAuthor;
  weight?: number;
  hidden?: boolean;
};

export type ITVSymbol = ITVSearchResult & {};

export type ITVSymbolList = {
  id?: number;
  name: string;
  symbols: ITVSymbol[];
  selected?: boolean;
};

export type ITVSeries = {
  dataset: string;
  data: number[];
};

export type ITVStudy = {
  id: string;
  data: StudyData;
  meta: MetaInfo;
  config?: ITVStudyConfig;
};

export type ITVStudyConfig = {
  id: string;
  collapsed?: boolean;
  showFields?: string[];
  hidden?: boolean;
};
