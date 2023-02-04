import axios, { AxiosError, Canceler } from "axios";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
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
  const getData = useCallback(
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
      }
    },
    [
      numerator,
      denominator,
      selected?.indicators,
      period,
      count,
      sett,
      spl,
      target1,
      target2,
      putStudies,
      snack,
    ]
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
    console.log(lastFetched, window.localStorage.getItem("last-fetched"));
    if (numerator && denominator && period && count && selected) {
      if (window.localStorage.getItem("last-fetched") !== lastFetched) {
        console.log(
          window.localStorage.getItem("last-fetched") !== lastFetched
        );

        const a = {
          numerator: "NASDAQ:TSLA",
          denominator: "AMEX:SPY",
          studies: [
            "PUB;8bBrCmCGspE390DLRNWYlXrtDxRIoZYe",
            "PUB;7pIlmOh7nrutyvfmHTPJQEHlK26okwvl",
            "PUB;d2ac68ba96c2432182159828c9928764",
            "PUB;kGJGLu77vLikIl1P4H1OuIWM7m7OA271",
          ],
        };
        const b = {
          numerator: "NASDAQ:TSLA",
          denominator: "AMEX:SPY",
          studies: [
            "PUB;8bBrCmCGspE390DLRNWYlXrtDxRIoZYe",
            "PUB;7pIlmOh7nrutyvfmHTPJQEHlK26okwvl",
            "PUB;d2ac68ba96c2432182159828c9928764",
            "PUB;kGJGLu77vLikIl1P4H1OuIWM7m7OA271",
          ],
          period: "1W",
          count: "1000",
        };

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
