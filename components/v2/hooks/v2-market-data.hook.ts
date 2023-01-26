import axios from "axios";
import { useEffect, useState } from "react";
import { useRows, useSetting, useSettings } from "../../../hooks/data.hook";
import { getSymbolKey } from "../../tv-components/utils/symbol.utils";
import { useV2ChartConfigs, useV2Presets } from "./v2-data.hook";

export const useV2MarketData = () => {
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
  useEffect(() => {
    const getData = async () => {
      try {
        sett("fetching")(true);
        const { data } = await axios.post("/api/market-data", {
          numerator,
          denominator,
          indicators: selected?.indicators,
        });
        sett("source")(`${numerator}/${denominator}`);
        sett("target")(`${numerator}`);
        sett("target2")(`${denominator}`);
        spl.setRows(data?.splits || []);
        target1.setRows(data?.num || []);
        target2.setRows(data?.denum || []);
        sett("fetching")(false);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [numerator, denominator]);
};
