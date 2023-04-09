import { useLiveQuery } from "dexie-react-hooks";
import * as R from "ramda";
import IDB from "../db/db";

export const useSetting = <T = any>(
  k: string,
  defaultValue?: any
): [T, (v: T) => void] => {
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
  const [chartType, setChartType] = useSetting("chartType", "candlestick");
  const [count, setCount] = useSetting("barCount", 300);
  const [theme, setTheme] = useSetting("theme", "dark") as [
    theme: "dark" | "light",
    setTheme: (theme: "dark" | "light") => void
  ];
  const [legends, setLegends] = useSetting("legends", true);
  const [syncLine, setSyncLine] = useSetting("syncLine", true);
  const [syncRange, setSyncRange] = useSetting("syncRange", true);
  const [takeProfit, setTakeProfit] = useSetting("takeProfit", 0);
  const [stopLoss, setStopLoss] = useSetting("stopLoss", 0);
  const [reverseStrategies, setReverseStrategies] = useSetting(
    "syncRange",
    true
  );
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
    chartType,
    setChartType,
    legends,
    setLegends,
    count,
    setCount,
    syncLine,
    setSyncLine,
    syncRange,
    setSyncRange,
    reverseStrategies,
    setReverseStrategies,
    takeProfit,
    setTakeProfit,
    stopLoss,
    setStopLoss,
  };
};
