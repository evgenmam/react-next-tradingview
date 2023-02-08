import { Box, Sheet, useTheme } from "@mui/joy";
import HighchartsReact from "highcharts-react-official";
import throttle from "lodash.throttle";
import { memo, useEffect, useMemo, useRef } from "react";
import { useRows, useStrategies } from "../../hooks/data.hook";
import { HStock } from "../hchart";
import { mouseOver, yAxis } from "./configs";
import { usePointerSet } from "./context/pointer.context";
import { useRangeSet } from "./context/range.context";
import { usePointSync, useRangeSync } from "./hooks/sync.hook";
import { useTargetChartConfig } from "./hooks/target-chart-config";
import * as R from "ramda";
import { chartZoomScroll } from "../../utils/chart.utils";

type Props = {
  set: "target" | "target2" | "source";
  chartRef?: React.RefObject<HighchartsReact.RefObject>;
};

export const TargetChartH = ({ set, chartRef }: Props) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  // const h = boxRef.current?.clientHeight;
  const options = useTargetChartConfig(set, 400);
  const setPoint = usePointerSet();
  const initSetter = (chart: Highcharts.Chart) => {
    chart.container.addEventListener("mousemove", (e) => {
      const event = chart.pointer.normalize(e);
      const point = chart?.series?.[0]?.searchPoint(event, true);
      setPoint({ event, key: set, x: point?.x });
    });
    chart.container.addEventListener("mouseleave", () => {
      setPoint({ event: null, key: set });
    });
    chart.container.addEventListener("mousewheel", (e) =>
      chartZoomScroll(e as WheelEvent, chart)
    );
  };
  const ser = (options?.series?.[0] as Highcharts.SeriesCandlestickOptions)
    ?.data;
  const first = ser?.at?.(1) as Highcharts.PointOptionsObject;
  const last = ser?.at?.(-1) as Highcharts.PointOptionsObject;
  useEffect(() => {
    if (set === "source") {
    }
  }, [first, last, set, chartRef]);
  return (
    <Box ref={boxRef} height="100%">
      <HStock options={options} callback={initSetter} id={set} ref={chartRef} />
    </Box>
  );
};

const Chart = memo(TargetChartH);

export const TargetChart = ({ set }: Props) => {
  const ref = useRef<HighchartsReact.RefObject>(null);
  usePointSync(set, ref?.current?.chart);
  useRangeSync(set, ref?.current?.chart);
  return <Chart set={set} chartRef={ref} />;
};
