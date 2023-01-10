import Dexie from "dexie";
import { IChartData, IField, IIndicator } from "../types/app.types";

const DB_VERSION = 1.4;

class DB extends Dexie {
  rows!: Dexie.Table<IChartData, number>;
  fields!: Dexie.Table<IField, string>;
  indicators!: Dexie.Table<IIndicator, string>;
  settings!: Dexie.Table<{ key: string; value: any }, string>;

  constructor() {
    super("bg-db");
    this.version(DB_VERSION).stores({
      rows: "time",
      fields: "key",
      indicators: "name",
      settings: "key",
    });
  }
}

const IDB = new DB();
export default IDB;
