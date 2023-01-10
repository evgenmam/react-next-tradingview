import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { IChartData, IField, IIndicator, ISettings } from "../types/app.types";
import * as R from "ramda";
import IDB from "../db/db";

export const useIndicators = () => {
  const indicators =
    useLiveQuery(async () => {
      return await IDB.indicators.toArray();
    }) || [];
  const addIndicator = async (indicator: IIndicator) => {
    if (await IDB.indicators.get(indicator.name)) return;
    await IDB.indicators.add(indicator);
  };
  const removeIndicator = async (name: string) => {
    await IDB.indicators.delete(name);
  };
  const updateIndicator = async (indicator: IIndicator) => {
    await IDB.indicators.update(indicator.name, indicator);
  };

  return { indicators, addIndicator, removeIndicator, updateIndicator };
};

export const useRows = () => {
  const rows =
    useLiveQuery(async () => {
      const maxDigits = (await IDB.settings.get("maxDigits"))?.value;

      return (await IDB.rows.toArray()).map(
        R.mapObjIndexed((v, k) => (k === "time" ? v : +v.toFixed(maxDigits)))
      );
    }) || [];

  const indexed = R.indexBy<IChartData, number>(R.prop("time"))(
    rows as IChartData[]
  );

  const setRows = async (rows: IChartData[]) => {
    await IDB.rows.clear();
    await IDB.rows.bulkAdd(rows);
  };
  const clearRows = async () => {
    await IDB.rows.clear();
  };
  return { rows, setRows, clearRows, indexed };
};

const useSetting = (k: string, defaultValue: any) => {
  return [
    useLiveQuery(async () => {
      const value = (await IDB.settings.get(k))?.value;
      if (R.isNil(value)) {
        await IDB.settings.put({ key: k, value: defaultValue });
        return defaultValue;
      }
      return value;
    }),
    async (v: any) => {
      await IDB.settings.put({ key: k, value: v });
    },
  ];
};

export const useFields = () => {
  const fields = (
    useLiveQuery(async () => {
      const hideEmpty = (await IDB.settings.get("hideEmpty"))?.value;
      return await IDB.fields.filter((f) => !hideEmpty || !f.isNull).toArray();
    }) || []
  ).map(R.prop("key"));
  const setFields = async (fields: IField[]) => {
    await IDB.fields.clear();
    await IDB.fields.bulkAdd(fields);
  };
  const clearFields = async () => {
    await IDB.fields.clear();
  };

  return { fields, setFields, clearFields };
};

export const useSettings = () => {
  const [hideEmpty, setHideEmpty] = useSetting("hideEmpty", true);
  const [maxDigits, setMaxDigits] = useSetting("maxDigits", 4);
  return { hideEmpty, setHideEmpty, maxDigits, setMaxDigits };
};
