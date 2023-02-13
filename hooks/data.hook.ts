import { useLiveQuery } from "dexie-react-hooks";
import { IChartData, IIndicator, ISignal, IStrategy } from "../types/app.types";
import * as R from "ramda";
import IDB from "../db/db";
import { ITVSymbol } from "../components/tv-components/types";
import { useState } from "react";
import { toHeikinAshi } from "../utils/chart.utils";
import { useSettings } from "./settings.hook";
import { startOfYear } from "date-fns";
import { CLOSING } from "ws";

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

export const useMinMax = () => {
  const { source, target, target2 } = useSettings();
  const ds = useLiveQuery(async () => {
    const s = await IDB.rows
      .where("dataset")
      .anyOf([source, target, target2].filter((x) => x))
      .toArray();
    const sorted = R.sortBy(R.prop("time"))(s);
    return { min: sorted.at(1), max: sorted.at(-1) };
  }, [source, target, target2]);
  return {
    min: ds?.min?.time,
    max: ds?.max?.time,
  };
};

const getMinRow = async () => {
  const source = await getFirstRow("source");
  const target = await getFirstRow("target");
  const target2 = await getFirstRow("target2");
  return Math.max(source, target, target2);
};

export const useRows = (datasetName?: string) => {
  const [loading, setLoading] = useState(false);
  const rows =
    useLiveQuery(async () => {
      setLoading(true);
      if (!datasetName) return [];
      const minRow = await getMinRow();
      const dataset = (await IDB.settings.get(datasetName))?.value;
      const chartType = (await IDB.settings.get("chartType"))?.value;
      if (!dataset) return [];
      const maxDigits = (await IDB.settings.get("maxDigits"))?.value;
      let data = (
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
      if (chartType === "heikin-ashi" && data.length > 0)
        data = toHeikinAshi(data as IChartData[]) as IChartData[];
      return R.sortBy(R.prop("time"))(data);
    }, [datasetName]) || [];
  const count = useLiveQuery(async () => {
    if (!datasetName) return 0;
    const dataset = (await IDB.settings.get(datasetName))?.value;
    if (!dataset) return 0;

    return await IDB.rows.where("dataset").equals(dataset).count();
  }, [datasetName]);
  const dataset =
    useLiveQuery(async () => {
      if (!datasetName) return "";
      return (await IDB.settings.get(datasetName))?.value;
    }, [datasetName]) || [];

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
  const { reverseStrategies, setReverseStrategies } = useSettings();
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
  return {
    strategies,
    addStrategy,
    removeStrategy,
    updateStrategy,
    loading,
    reverse: reverseStrategies,
    setReverse: setReverseStrategies,
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

export { useSetting, useSettings } from "./settings.hook";
