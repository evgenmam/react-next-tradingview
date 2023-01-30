import { useLiveQuery } from "dexie-react-hooks";
import IDB from "../../../db/db";
import { ITVIndicator, ITVStudy, ITVSymbol } from "../../tv-components/types";
import { IChartConfig, IPreset } from "../v2.types";
import * as R from "ramda";
export const useV2ChartConfigs = () => {
  const configs =
    useLiveQuery(async () => {
      return await IDB.charts.orderBy("name").reverse().toArray();
    }) || [];

  return { configs };
};

export const useV2List = (id: number) => {
  const list =
    useLiveQuery(async () => {
      return await IDB.lists.where("id").equals(id).first();
    }, [id]) || null;
  const addSymbol = async (id: number, symbol: ITVSymbol) => {
    const list = await IDB.lists.where("id").equals(id).first();
    if (!list) return;
    await IDB.lists.update(
      id,
      R.over(R.lensProp("symbols"), R.append(symbol), list)
    );
  };
  const removeSymbol = async (id: number, symbol: ITVSymbol) => {
    const list = await IDB.lists.where("id").equals(id).first();
    if (!list) return;
    await IDB.lists.update(
      id,
      R.over(R.lensProp("symbols"), R.without([symbol]), list)
    );
  };
  return { list, addSymbol, removeSymbol };
};

export const useV2Chart = (cfg: IChartConfig) => {
  const config =
    useLiveQuery(async () => {
      return await IDB.charts.where("name").equals(cfg.name).first();
    }, [cfg]) || null;
  const list =
    useLiveQuery(async () => {
      if (!cfg.list) return null;
      return await IDB.lists.where("id").equals(cfg.list).first();
    }, [cfg.list]) || null;
  const setList = async (id: number) => {
    await IDB.charts.update(cfg.name, { list: id });
  };
  const setSymbol = async (symbol: ITVSymbol) => {
    await IDB.charts.update(cfg.name, { symbol });
  };

  return { config, list, setList, setSymbol };
};

export const useV2Presets = () => {
  const presets =
    useLiveQuery(async () => {
      return await IDB.presets.toArray();
    }) || [];
  const addPreset = async (preset: IPreset) => {
    return await IDB.presets.add(preset);
  };
  const removePreset = async (id: number) => {
    await IDB.presets.delete(id);
  };
  const selected = presets.find((p) => p.selected);
  const setSelected = async (id: number) => {
    await IDB.presets.update(id, { selected: true });
    await IDB.presets.where("id").notEqual(id).modify({ selected: false });
  };
  const addIndicator = async (indicator: ITVIndicator) => {
    const s = await IDB.presets.filter((p) => !!p.selected).first();
    if (!s) return;
    await IDB.presets.update(
      s,
      R.over(R.lensProp("indicators"), R.append(indicator), s)
    );
  };
  const removeIndicator = async (indicator: ITVIndicator) => {
    const s = await IDB.presets.filter((p) => !!p.selected).first();
    if (!s) return;
    await IDB.presets.update(
      s,
      R.over(R.lensProp("indicators"), R.without([indicator]), s)
    );
  };
  return {
    presets,
    addPreset,
    removePreset,
    removeIndicator,
    selected,
    setSelected,
    addIndicator,
  };
};

export const useActiveStudies = () => {
  const studies =
    useLiveQuery(async () => {
      const preset = await IDB.presets.filter((p) => !!p.selected).first();
      const dataset = await IDB.settings.where("key").equals("source").first();
      if (!preset || !dataset) return [];
      return await IDB.studies
        .where("id")
        .anyOf(
          preset.indicators?.map?.((v) => `${dataset.value}_${v.scriptName}`)
        )
        .toArray();
    }) || [];

  return { studies };
};

export const useV2Studies = () => {
  const studies =
    useLiveQuery(async () => {
      return await IDB.studies.toArray();
    }) || [];

  const putStudy = async (study: ITVStudy) => {
    await IDB.studies.put(study, study.id);
  };
  const putStudies = async (studies: ITVStudy[]) => {
    for (const study of studies) await IDB.studies.put(study, study.id);
  };
  return { studies, putStudy, putStudies };
};

export const useV2Study = (id: string) => {
  const study =
    useLiveQuery(async () => {
      return await IDB.studies.where("id").equals(id).first();
    }, [id]) || null;
  const updateStudy = async (study: Partial<ITVStudy>) => {
    await IDB.studies.update(id, study);
  };
  return { study, updateStudy };
};
