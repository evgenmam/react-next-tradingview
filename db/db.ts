import Dexie from "dexie";
import { IChartData, IField, IIndicator, ISignal } from "../types/app.types";

const DB_VERSION = 1.9;

class DB extends Dexie {
  rows!: Dexie.Table<IChartData, number>;
  fields!: Dexie.Table<IField, string>;
  indicators!: Dexie.Table<IIndicator, string>;
  settings!: Dexie.Table<{ key: string; value: any }, string>;
  signals!: Dexie.Table<ISignal, number>;

  constructor() {
    super("bg-db");
    this.version(DB_VERSION).stores({
      rows: "id++, dataset",
      fields: "id++, dataset",
      indicators: "name",
      settings: "key",
      signals: "id++, dataset",
    });
  }
}

const IDB = new DB();
export default IDB;
