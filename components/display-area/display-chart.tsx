import HighchartsReact from "highcharts-react-official";
import { useEffect, useMemo, useRef } from "react";
import { useSourceData } from "../../hooks/charts/source-data.hook";
import { HStock } from "../hchart";
import * as R from "ramda";
import { useIndicatorsData } from "../../hooks/charts/indicatiors-data.hook";
import Highcharts from "highcharts";
import { Stack } from "@mui/system";
import { useChartData } from "../../hooks/charts/chart-data.hook";
import { useHoverSet } from "../../hooks/hover.hook";
import { useSettings } from "../../hooks/data.hook";
import { useTradesData } from "../../hooks/charts/trades.hook";
import PerfectScrollbar from "perfect-scrollbar";
import { useV2StudyData } from "../v2/hooks/v2-study-data.hook";
import { CircularProgress } from "@mui/joy";
import { HoverWatcher } from "../data/hover-watcher";
import { DataWatcher } from "../data/data-watcher";

const signalsHeight = 10;
const sourceHeight = 500;

export const DisplayChart = () => {
  const ref = useRef<HighchartsReact.RefObject | null>(null);
  // const signals = useSignalsData({ height: signalsHeight });
  const indicators = useIndicatorsData({
    sourceHeight: sourceHeight + signalsHeight,
  });
  const [studies, studiesLoading] = useV2StudyData({
    top: sourceHeight + signalsHeight,
    height: 200,
  });
  const { target2 } = useSettings();
  const hoverSet = useHoverSet();

  const [source, sourceLoading] = useSourceData({
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

  const tooltip: Highcharts.TooltipOptions = useMemo(
    () => ({
      outside: true,
      split: true,
      formatter: function (tooltip) {
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
    }),
    [hoverSet]
  );

  const theight = 300;
  const [targetData, tLoading] = useChartData({
    dataset: "target",
    top: firstChartHeight,
    height: theight,
    next: ["target2"],
    nextLabel: target2,
  });
  const [targetData2, t2Loading] = useChartData({
    height: theight,
    dataset: "target2",
    top: firstChartHeight + theight,
  });

  const [trades, trLoading] = useTradesData({ dataset: "target" });
  const [trades2, tr2Loading] = useTradesData({ dataset: "target2" });

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
  const options: Highcharts.Options = useMemo(
    () => ({
      chart: {
        animation: false,
        height: stackRef.current?.clientHeight,
        scrollablePlotArea: {
          minHeight: height,
        },
      },

      tooltip,
      ...chartData,
    }),
    [chartData, height, tooltip]
  );

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
      {sourceLoading || tLoading || t2Loading || trLoading || tr2Loading ? (
        <CircularProgress></CircularProgress>
      ) : (
        <HStock options={options} ref={ref} />
      )}
      {ref?.current?.chart && <HoverWatcher chart={ref?.current?.chart} />}
      {/* {ref?.current?.chart && <DataWatcher chart={ref?.current?.chart} />} */}
    </Stack>
  );
};
