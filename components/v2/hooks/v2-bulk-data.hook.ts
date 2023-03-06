import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import IDB from "../../../db/db";
import {
  useCompareRows,
  useLists,
  useSettings,
} from "../../../hooks/data.hook";
import { getSymbolKey } from "../../tv-components/utils/symbol.utils";
import { useV2Presets, useV2Studies } from "./v2-data.hook";
import * as R from "ramda";

export const useV2BulkData = (w1?: number, w2?: number) => {
  const { lists } = useLists();
  const l1 = lists.find((l) => l.id === w1);
  const l2 = lists.find((l) => l.id === w2);
  const nums = useMemo(() => l1?.symbols.map(getSymbolKey), [l1]);
  const dens = useMemo(() => l2?.symbols.map(getSymbolKey), [l2]);
  const { selected } = useV2Presets();
  const { period, count, chartType } = useSettings();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const get = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post("/api/bulk-market-data", {
          nums,
          dens,
          indicators: selected?.indicators,
          period,
          count,
          chartType,
        });

        IDB.rows.where("dataset").anyOf(data?.datasets).delete();
        IDB.rows.bulkAdd(data?.data);
        for (const study of data?.studies || []) {
          await IDB.studies.put({ ...study }, study.id);
          const id = study.meta?.scriptIdPart;
          if (!(await IDB.studyConfigs.where("id").equals(id).first()))
            await IDB.studyConfigs.put({
              id: id,
              collapsed: true,
              showFields: [],
            });
        }
      } catch (error) {}
      setLoading(false);
    };
    if (nums && dens && selected && period && count && chartType) {
      get();
    }
  }, [nums, dens, selected, period, count, chartType]);
  return { loading };
};
