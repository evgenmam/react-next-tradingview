import Dexie from "dexie";
import {
  ITVSeries,
  ITVStudy,
  ITVSymbolList,
} from "../components/tv-components/types";
import { IChartConfig, IPreset } from "../components/v2/v2.types";
import {
  IChartData,
  IField,
  IIndicator,
  ISignal,
  IStrategy,
} from "../types/app.types";

const DB_VERSION = 2.9;

class DB extends Dexie {
  rows!: Dexie.Table<IChartData, number>;
  fields!: Dexie.Table<IField, string>;
  indicators!: Dexie.Table<IIndicator, string>;
  settings!: Dexie.Table<{ key: string; value: any }, string>;
  signals!: Dexie.Table<ISignal, number>;
  strategies!: Dexie.Table<IStrategy, number>;
  lists!: Dexie.Table<ITVSymbolList, number>;
  charts!: Dexie.Table<IChartConfig, string>;
  presets!: Dexie.Table<IPreset, number>;
  series!: Dexie.Table<ITVSeries, string>;
  studies!: Dexie.Table<ITVStudy, string>;

  constructor() {
    super("bg-db");
    this.version(DB_VERSION).stores({
      rows: "id++, dataset, period",
      fields: "id++, dataset",
      indicators: "name",
      settings: "key",
      signals: "id++",
      strategies: "id++",
      lists: "id++",
      charts: "name",
      presets: "id++",
      series: "dataset",
      studies: "id",
    });
  }
}

const IDB = new DB();

const migrations = async () => {
  const charts = await IDB.charts.toArray();
  const aapl = {
    country: "US",
    currency_code: "USD",
    description: "Apple Inc.",
    exchange: "NASDAQ",
    logoid: "apple",
    provider_id: "ice",
    symbol: "AAPL",
    type: "stock",
    typespecs: ["common"],
  };
  const spy = {
    symbol: "SPY",
    description: "SPDR S&P 500 ETF TRUST",
    type: "fund",
    exchange: "NYSE Arca",
    currency_code: "USD",
    logoid: "spdr-sandp500-etf-tr",
    provider_id: "ice",
    country: "US",
    typespecs: ["etf"],
    prefix: "AMEX",
  };
  if (charts.length === 0) {
    await IDB.lists.bulkAdd([
      {
        name: "Watchlist 1",
        symbols: [aapl],
      },
      {
        name: "Watchlist 2",
        symbols: [spy],
      },
    ]);
    await IDB.charts.bulkAdd([
      {
        name: "Numerator",
        list: 1,
        symbol: aapl,
      },
      {
        name: "Denominator",
        list: 2,
        symbol: spy,
      },
    ]);
  }
  const presets = await IDB.presets.toArray();
  if (presets.length === 0) {
    await IDB.presets.add({
      name: "Preset 1",
      indicators: [],
      selected: true,
    });
  }
};
migrations();
export default IDB;
