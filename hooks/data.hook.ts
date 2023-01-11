import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import {
  IChartData,
  IField,
  IIndicator,
  ISettings,
  ISignal,
} from "../types/app.types";
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

export const useRows = (datasetName: string) => {
  const rows =
    useLiveQuery(async () => {
      const dataset = (await IDB.settings.get(datasetName))?.value;
      if (!dataset) return [];
      const maxDigits = (await IDB.settings.get("maxDigits"))?.value;

      return (await IDB.rows.where("dataset").equals(dataset).toArray()).map(
        R.pipe(
          R.dissoc("dataset"),
          R.mapObjIndexed((v, k) => (k === "time" ? v : +v.toFixed(maxDigits)))
        )
      );
    }) || [];

  const indexed = R.indexBy<IChartData, number>(R.prop("time"))(
    rows as IChartData[]
  );

  const setRows = async (rows: IChartData[]) => {
    await IDB.rows.bulkAdd(rows);
  };
  const clearRows = async () => {
    await IDB.rows.clear();
  };
  return { rows: rows as IChartData[], setRows, clearRows, indexed };
};

export const useDatasets = () => {
  const datasets =
    useLiveQuery(async () => {
      return await IDB.rows.orderBy("dataset").uniqueKeys();
    }) || [];

  return { datasets: datasets as string[] };
};

export const useSetting = (k: string, defaultValue?: any) => {
  const value = useLiveQuery(async () => {
    const value = (await IDB.settings.get(k))?.value;
    if (R.isNil(value)) {
      IDB.settings.put({ key: k, value: defaultValue });
      return defaultValue;
    }
    return value || null;
  });
  const setter = async (v: any) => {
    await IDB.settings.put({ key: k, value: v });
  };
  return [value, setter];
};

export const useFields = (datasetName = "source") => {
  const fields = (
    useLiveQuery(async () => {
      const dataset = (await IDB.settings.get(datasetName))?.value;
      const hideEmpty = (await IDB.settings.get("hideEmpty"))?.value;
      return await IDB.fields
        .where("dataset")
        .equals(dataset)
        .filter((f) => !hideEmpty || !f.isNull)
        .toArray();
    }) || []
  ).map(R.prop("key"));
  const setFields = async (fields: IField[]) => {
    await IDB.fields.bulkAdd(fields);
  };
  const clearFields = async () => {
    await IDB.fields.clear();
  };

  return { fields, setFields, clearFields };
};

export const useSignals = () => {
  const signals =
    useLiveQuery(async () => {
      const dataset = (await IDB.settings.get("source"))?.value;
      if (!dataset) return [];
      return await IDB.signals.where("dataset").equals(dataset).toArray();
    }) || [];

  const addSignal = async (signal: Omit<ISignal, "id">) => {
    await IDB.signals.add(signal);
  };
  const removeSignal = async (id?: number) => {
    if (id) {
      await IDB.signals.delete(id);
    }
  };
  const updateSignal = async (signal: ISignal) => {
    if (signal.id) {
      await IDB.signals.update(signal.id, signal);
    }
  };
  return { signals, addSignal, removeSignal, updateSignal };
};

export const useSettings = () => {
  const [hideEmpty, setHideEmpty] = useSetting("hideEmpty", true);
  const [maxDigits, setMaxDigits] = useSetting("maxDigits", 4);
  const [source, setSource] = useSetting("source", "");
  const [target, setTarget] = useSetting("target", "");
  const [showSignals, setShowSignals] = useSetting("signals", true);
  const sett = (k: string) => async (v: any) => {
    await IDB.settings.put({ key: k, value: v });
  };

  return {
    hideEmpty,
    setHideEmpty,
    maxDigits,
    setMaxDigits,
    source,
    setSource,
    target,
    setTarget,
    sett,
    showSignals,
    setShowSignals,
  };
};
