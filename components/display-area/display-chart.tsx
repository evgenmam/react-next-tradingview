import HighchartsReact from "highcharts-react-official";
import { useEffect, useRef } from "react";
import { useSourceData } from "../../hooks/charts/source-data.hook";
import { HStock } from "../hchart";
import * as R from "ramda";
import { useIndicatorsData } from "../../hooks/charts/indicatiors-data.hook";
import Highcharts from "highcharts";
import { Stack } from "@mui/system";
import { useChartData } from "../../hooks/charts/chart-data.hook";
import { useHoverSet } from "../../hooks/hover.hook";
import { useSignalsData } from "../../hooks/charts/signals-data.hook";
import { HoverWatcher } from "../data/hover-watcher";
import { useRows, useSettings } from "../../hooks/data.hook";
import { useTradesData } from "../../hooks/charts/trades.hook";
import { DataWatcher } from "../data/data-watcher";

const signalsHeight = 10;
const sourceHeight = 500;

export const DisplayChart = () => {
  const ref = useRef<HighchartsReact.RefObject | null>(null);
  const signals = useSignalsData({ height: signalsHeight });
  const indicators = useIndicatorsData({
    sourceHeight: sourceHeight + signalsHeight,
  });
  const { target2 } = useSettings();
  const hoverSet = useHoverSet();

  const source = useSourceData({
    height: sourceHeight,
    next: indicators.yAxis.map<string>(R.propOr("", "id")),
  });
  const sourceChart = R.reduce<
    Partial<Highcharts.Options>,
    Partial<Highcharts.Options>
  >(
    R.mergeDeepWith(R.concat),
    {}
  )([signals, source, indicators]);
  const firstChartHeight = [sourceChart?.yAxis]
    ?.flat()
    ?.reduce(
      (acc, v) => acc + (typeof v?.height === "number" ? v?.height : 0),
      0
    );

  const tooltip: Highcharts.TooltipOptions = {
    outside: true,
    split: true,
    formatter: function () {
      if (typeof this.x === "number") {
        hoverSet(this.x);
        return [new Date(this.x).toUTCString()];
      } else {
        hoverSet(-1);
        return [];
      }
    },
  };

  const theight = 300;
  const targetData = useChartData({
    dataset: "target",
    top: firstChartHeight,
    height: theight,
    next: ["target2"],
    nextLabel: target2,
  });
  const targetData2 = useChartData({
    dataset: "target2",
    top: firstChartHeight + theight,
  });

  const trades = useTradesData({ dataset: "target" });
  const trades2 = useTradesData({ dataset: "target2" });

  let chartData = R.reduce<
    Partial<Highcharts.Options>,
    Partial<Highcharts.Options>
  >(
    R.mergeDeepWith(R.concat),
    {}
  )([sourceChart, targetData, targetData2, trades, trades2]);

  const height = [chartData?.yAxis]
    ?.flat()
    ?.reduce(
      (acc, v) => acc + (typeof v?.height === "number" ? v?.height : 0),
      180
    );
  const stackRef = useRef<HTMLDivElement | null>(null);
  const options: Highcharts.Options = {
    chart: {
      animation: false,
      height: stackRef.current?.clientHeight,
      scrollablePlotArea: {
        minHeight: height,
      },
    },

    tooltip,
    ...chartData,
  };

  return (
    <Stack height="100%" ref={stackRef} flexGrow={1}>
      <HStock options={options} ref={ref} />
      {ref?.current?.chart && <HoverWatcher chart={ref?.current?.chart} />}
      {ref?.current?.chart && <DataWatcher chart={ref?.current?.chart} />}
    </Stack>
  );
};
