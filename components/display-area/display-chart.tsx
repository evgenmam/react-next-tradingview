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
import PerfectScrollbar from "perfect-scrollbar";
import { useV2Studies } from "../v2/hooks/v2-data.hook";
import { useV2StudyData } from "../v2/hooks/v2-study-data.hook";

const signalsHeight = 10;
const sourceHeight = 500;

export const DisplayChart = () => {
  const ref = useRef<HighchartsReact.RefObject | null>(null);
  const signals = useSignalsData({ height: signalsHeight });
  const indicators = useIndicatorsData({
    sourceHeight: sourceHeight + signalsHeight,
  });
  const studies = useV2StudyData({
    top: sourceHeight + signalsHeight,
    height: 200,
  });
  const { target2 } = useSettings();
  const hoverSet = useHoverSet();

  const source = useSourceData({
    height: sourceHeight,
    top: signalsHeight,
    next: [...indicators.yAxis.map<string>(R.propOr("", "id")), "target"],
  });
  const sourceChart = R.reduce<
    Partial<Highcharts.Options>,
    Partial<Highcharts.Options>
  >(
    R.mergeDeepWith(R.concat),
    {}
  )([source, indicators]);
  const firstChartHeight = [sourceChart?.yAxis, ...studies?.map((v) => v.yAxis)]
    ?.flat()
    ?.filter((v) => v?.opposite !== false)
    ?.reduce(
      (acc, v) => acc + (typeof v?.height === "number" ? v?.height : 0),
      0
    );

  const tooltip: Highcharts.TooltipOptions = {
    outside: true,
    split: true,
    formatter: function (tooltip) {
      // console.log(this);
      if (typeof this.x === "number") {
        hoverSet(this.x);
        return [
          new Date(this.x).toUTCString(),
          ...(this.points?.map((v) => v?.point?.options?.label || "") || []),
        ];
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
    height: theight,
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
    // @ts-ignore
  )([sourceChart, targetData, targetData2, trades, trades2, ...studies]);

  const height = [chartData?.yAxis]
    ?.flat()
    ?.filter((v) => {
      return v?.opposite !== false;
    })
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

  const h = stackRef?.current?.querySelector(
    ".highcharts-scrolling"
  )?.clientHeight;
  useEffect(() => {
    const el = stackRef?.current?.querySelector(".highcharts-scrolling");
    let ps: PerfectScrollbar;
    if (el) {
      ps = new PerfectScrollbar(el);
    }
    return () => {
      ps?.destroy();
    };
  }, [h]);

  return (
    <Stack
      height="100%"
      ref={stackRef}
      flexGrow={1}
      sx={{ ".highcharts-scrollable-mask": { display: "none" } }}
    >
      <HStock options={options} ref={ref} />
      {ref?.current?.chart && <HoverWatcher chart={ref?.current?.chart} />}
      {ref?.current?.chart && <DataWatcher chart={ref?.current?.chart} />}
    </Stack>
  );
};
