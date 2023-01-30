import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { IChartData, IIndicator, ISignal, IStrategy } from "../types/app.types";
import * as R from "ramda";
import IDB from "../db/db";
import { ITVSymbol } from "../components/tv-components/types";
import { useState } from "react";

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

const getFirstRow = async (dataset: string) => {
  const ds = (await IDB.settings.get(dataset))?.value;
  if (!ds) return 0;
  return (
    (await IDB.rows.where("dataset").equals(ds).limit(1).sortBy("time"))[0]
      ?.time || 0
  );
};

const getMinRow = async () => {
  const source = await getFirstRow("source");
  const target = await getFirstRow("target");
  const target2 = await getFirstRow("target2");
  return Math.max(source, target, target2);
};

export const useRows = (datasetName: string) => {
  const [loading, setLoading] = useState(false);
  const rows =
    useLiveQuery(async () => {
      setLoading(true);
      const minRow = await getMinRow();
      const dataset = (await IDB.settings.get(datasetName))?.value;
      if (!dataset) return [];
      const maxDigits = (await IDB.settings.get("maxDigits"))?.value;
      const data = (
        await IDB.rows
          .where("dataset")
          .equals(dataset)
          .and((v) => v.time >= minRow)
          .toArray()
      ).map(
        R.pipe(
          R.dissoc("dataset"),
          R.mapObjIndexed((v, k) => (k === "time" ? v : +v.toFixed(maxDigits)))
        )
      );
      setLoading(false);
      return data;
    }) || [];
  const count = useLiveQuery(async () => {
    const dataset = (await IDB.settings.get(datasetName))?.value;
    if (!dataset) return 0;

    return await IDB.rows.where("dataset").equals(dataset).count();
  });
  const dataset =
    useLiveQuery(async () => {
      return (await IDB.settings.get(datasetName))?.value;
    }) || [];

  const indexed = R.indexBy<IChartData, number>(R.prop("time"))(
    rows as IChartData[]
  );

  const setRows = async (rows: IChartData[]) => {
    IDB.rows.where("dataset").equals(dataset).delete();
    await IDB.rows.bulkAdd(rows);
  };
  const clearRows = async () => {
    await IDB.rows.clear();
  };

  return {
    rows: rows as IChartData[],
    setRows,
    clearRows,
    indexed,
    dataset,
    count,
    loading,
  };
};

export const useDatasets = () => {
  const datasets =
    useLiveQuery(async () => {
      return await IDB.rows.orderBy("dataset").uniqueKeys();
    }) || [];

  const remove = async (dataset: string) => {
    await IDB.rows.where("dataset").equals(dataset).delete();
  };

  return { datasets: datasets as string[], remove };
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
  const fields =
    useLiveQuery(async () => {
      const dataset = (await IDB.settings.get(datasetName))?.value;
      const hideEmpty = (await IDB.settings.get("hideEmpty"))?.value;
      if (!dataset) return [];
      const rows = (
        await IDB.rows.where("dataset").equals(dataset).toArray()
      ).reduce(R.mergeWith(R.or), {} as Record<string, any[]>);
      return R.pipe(
        R.keys,
        R.reject((v: string) => hideEmpty && R.isNil(rows[v]))
      )(rows);
    }) || [];
  // const setFields = async (fields: IField[]) => {
  //   await IDB.fields.bulkAdd(fields);
  // };
  // const clearFields = async () => {
  //   await IDB.fields.clear();
  // };

  return { fields };
};

export const useSignals = () => {
  const signals =
    useLiveQuery(async () => {
      return await IDB.signals.toArray();
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

export const useStrategies = () => {
  const [loading, setLoading] = useState(false);
  const strategies =
    useLiveQuery(async () => {
      setLoading(true);
      const data = await IDB.strategies.toArray();
      setLoading(false);
      return data;
    }) || [];

  const addStrategy = async (strategy: Omit<IStrategy, "id">) => {
    await IDB.strategies.add(strategy);
  };
  const removeStrategy = async (id?: number) => {
    if (id) {
      await IDB.strategies.delete(id);
    }
  };
  const updateStrategy = async (strategy: IStrategy) => {
    if (strategy.id) {
      await IDB.strategies.update(strategy.id, strategy);
    }
  };
  return { strategies, addStrategy, removeStrategy, updateStrategy, loading };
};

export const useSettings = () => {
  const [hideEmpty, setHideEmpty] = useSetting("hideEmpty", true);
  const [maxDigits, setMaxDigits] = useSetting("maxDigits", 4);
  const [source, setSource] = useSetting("source", "");
  const [target, setTarget] = useSetting("target", "");
  const [target2, setTarget2] = useSetting("target2", "");
  const [fetching, setFetching] = useSetting("fetching", false);
  const [showSignals, setShowSignals] = useSetting("signals", true);
  const [showStrategies, setShowStrategies] = useSetting("strategies", true);
  const [period, setPeriod] = useSetting("period", "1W");
  const [theme, setTheme] = useSetting("theme", "dark") as [
    theme: "dark" | "light",
    setTheme: (theme: "dark" | "light") => void
  ];
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
    showStrategies,
    setShowStrategies,
    theme,
    setTheme,
    target2,
    setTarget2,
    fetching,
    setFetching,
    period,
    setPeriod,
  };
};

export const useActiveList = () => {
  const list = useLiveQuery(async () => {
    let l = await IDB.lists?.filter((v) => !!v.selected).first();
    return l;
  });
  const setActive = async (id: number) => {
    await IDB.lists.filter((v) => !!v.selected).modify({ selected: false });
    await IDB.lists.update(id, { selected: true });
  };
  const addSymbol = async (symbol: ITVSymbol) => {
    if (!list) return;
    await IDB.lists.update(list.id!, { symbols: [...list.symbols, symbol] });
  };
  const removeSymbol = async (symbol: ITVSymbol) => {
    if (!list) return;
    await IDB.lists.update(list.id!, {
      symbols: R.reject(R.equals(symbol), list.symbols),
    });
  };
  return { list, setActive, addSymbol, removeSymbol };
};

export const useLists = () => {
  const lists =
    useLiveQuery(async () => {
      return await IDB.lists.toArray();
    }) || [];
  const createList = async (name: string) => {
    return await IDB.lists.add({ name, selected: false, symbols: [] });
  };
  const deleteList = async (id: number) => {
    if (id === 1) return;
    await IDB.lists.delete(id);
    await IDB.lists.filter((v) => !!v.selected).modify({ selected: false });
    await IDB.lists.update(1, { selected: true });
  };
  return { lists, createList, deleteList };
};
