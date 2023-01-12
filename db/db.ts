import Dexie from "dexie";
import {
  IChartData,
  IField,
  IIndicator,
  ISignal,
  IStrategy,
} from "../types/app.types";

const DB_VERSION = 2.0;

class DB extends Dexie {
  rows!: Dexie.Table<IChartData, number>;
  fields!: Dexie.Table<IField, string>;
  indicators!: Dexie.Table<IIndicator, string>;
  settings!: Dexie.Table<{ key: string; value: any }, string>;
  signals!: Dexie.Table<ISignal, number>;
  strategies!: Dexie.Table<IStrategy, number>;

  constructor() {
    super("bg-db");
    this.version(DB_VERSION).stores({
      rows: "id++, dataset",
      fields: "id++, dataset",
      indicators: "name",
      settings: "key",
      signals: "id++, dataset",
      strategies: "id++, dataset",
    });
  }
}

const IDB = new DB();
export default IDB;
