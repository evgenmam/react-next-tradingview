import axios, { AxiosError, Canceler } from "axios";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { CLOSING } from "ws";
import { useRows, useSetting, useSettings } from "../../../hooks/data.hook";
import { periodDiff } from "../../configs/period.config";
import { getSymbolKey } from "../../tv-components/utils/symbol.utils";
import { useV2ChartConfigs, useV2Presets, useV2Studies } from "./v2-data.hook";

export const useV2MarketData = (active: boolean) => {
  const { configs } = useV2ChartConfigs();
  const [polling, setPolling] = useState(false);
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
  const { sett, period, count } = useSettings();
  const snack = useSnackbar();
  const { putStudies } = useV2Studies();
  const getData = useDebouncedCallback(
    async (lastFetched: string, cancel?: Canceler) => {
      try {
        sett("fetching")(true);
        const { data } = await axios.post(
          "/api/market-data",
          {
            numerator,
            denominator,
            indicators: selected?.indicators,
            period,
            count,
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
        putStudies(data?.studies || []);
        window.localStorage.setItem("last-fetched", lastFetched);
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
        return cancel;
      }
    },
    200,
    { leading: false, trailing: true }
  );

  useEffect(() => {
    let cancel: Canceler | undefined = undefined;
    const lastFetched = JSON.stringify({
      numerator,
      denominator,
      studies: selected?.indicators?.map((v) => v.scriptIdPart),
      period,
      count,
    });
    if (numerator && denominator && period && count && selected) {
      if (window.localStorage.getItem("last-fetched") !== lastFetched) {
        getData(lastFetched, cancel);
      }
    }
    return () => {
      cancel?.();
    };
  }, [numerator, denominator, selected?.indicators, period, count, getData]);

  // useEffect(() => {
  //   if (polling) {
  //     const interval = setInterval(() => {
  //       getData();
  //     }, periodDiff[period as keyof typeof periodDiff]);
  //     return () => {
  //       clearInterval(interval);
  //     };
  //   }
  // }, [polling, period]);

  return { polling, setPolling };
};
