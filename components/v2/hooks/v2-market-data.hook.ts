import axios, { AxiosError, Canceler } from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useRows, useSetting, useSettings } from "../../../hooks/data.hook";
import { getSymbolKey } from "../../tv-components/utils/symbol.utils";
import { useV2ChartConfigs, useV2Presets } from "./v2-data.hook";

export const useV2MarketData = (active: boolean) => {
  const { configs } = useV2ChartConfigs();
  const numerator = getSymbolKey(
    configs.find((c) => c.name === "Numerator")?.symbol
  );
  const denominator = getSymbolKey(
    configs.find((c) => c.name === "Denominator")?.symbol
  );
  const { selected } = useV2Presets();
  const spl = useRows("source");
  const target1 = useRows("target");
  const target2 = useRows("target2");
  const { sett } = useSettings();
  const snack = useSnackbar();
  useEffect(() => {
    let cancel: Canceler;
    const getData = async () => {
      try {
        sett("fetching")(true);
        const { data } = await axios.post(
          "/api/market-data",
          {
            numerator,
            denominator,
            indicators: selected?.indicators,
          },
          {
            cancelToken: new axios.CancelToken((c) => {
              cancel = c;
            }),
          }
        );
        sett("source")(`${numerator}/${denominator}`);
        sett("target")(`${numerator}`);
        sett("target2")(`${denominator}`);
        spl.setRows(data?.split || []);
        target1.setRows(data?.numerator || []);
        target2.setRows(data?.denominator || []);
      } catch (error) {
        if (!axios.isCancel(error))
          snack.enqueueSnackbar(
            JSON.stringify((error as AxiosError)?.response?.data, null, 2),
            {
              variant: "error",
              style: {
                whiteSpace: "pre",
              },
            }
          );
      } finally {
        sett("fetching")(false);
      }
    };
    if (active) getData();
    return () => {
      cancel?.();
    };
  }, [numerator, denominator, active]);
};
