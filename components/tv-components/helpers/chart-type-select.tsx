import { Tab, TabList, Tabs } from "@mui/joy";
import noop from "lodash.noop";
import { useSettings } from "../../../hooks/data.hook";
import BarsIcon from "../../icons/chart/bars";
import CandlestickIcon from "../../icons/chart/candlestick";
import HeikinAshiIcon from "../../icons/chart/heikin-ashi";
import { ChartType } from "../types";

export const TVChartTypeSelect = () => {
  const { chartType, setChartType } = useSettings();
  if (!chartType) return null;
  return (
    <Tabs
      size="sm"
      defaultValue={ChartType.indexOf(chartType)}
      onChange={(v, e) => {
        setChartType(ChartType[e as number]);
      }}
    >
      <TabList>
        <Tab key="candlestick">
          <CandlestickIcon />
        </Tab>
        <Tab key="heikin-ashi">
          <HeikinAshiIcon />
        </Tab>
        <Tab key="bars">
          <BarsIcon />
        </Tab>
      </TabList>
    </Tabs>
  );
};
