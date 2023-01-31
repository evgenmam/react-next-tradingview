import { Box, Sheet, useTheme } from "@mui/joy";
import HighchartsReact from "highcharts-react-official";
import throttle from "lodash.throttle";
import { memo, useMemo, useRef } from "react";
import { useRows, useStrategies } from "../../hooks/data.hook";
import { HStock } from "../hchart";
import { mouseOver, yAxis } from "./configs";
import { usePointerSet } from "./context/pointer.context";
import { useRangeSet } from "./context/range.context";
import { usePointSync, useRangeSync } from "./hooks/sync.hook";
import { useStudyChartConfig } from "./hooks/study-chart-config";
import * as R from "ramda";
import { chartZoomScroll } from "../../utils/chart.utils";
import { ITVStudy } from "../tv-components/types";

type Props = {
  study: ITVStudy;
  chartRef?: React.RefObject<HighchartsReact.RefObject>;
};

export const StudyChartH = ({ study, chartRef }: Props) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const h = boxRef.current?.clientHeight;
  const options = useStudyChartConfig(study);
  const setPoint = usePointerSet();
  const initSetter = (chart: Highcharts.Chart) => {
    chart.container.addEventListener("mousemove", (e) => {
      const event = chart.pointer.normalize(e);
      const point = chart?.series?.[0]?.searchPoint(event, true);
      setPoint({ event, key: study?.id, x: point?.x });
    });
    chart.container.addEventListener("mouseleave", () => {
      setPoint({ event: null, key: study?.id });
    });
    chart.container.addEventListener("mousewheel", (e) =>
      chartZoomScroll(e as WheelEvent, chart)
    );
  };
  return (
    <Box ref={boxRef} height="100%">
      <HStock
        options={options}
        callback={initSetter}
        id={study?.id}
        ref={chartRef}
      />
    </Box>
  );
};

const Chart = memo(StudyChartH);

export const StudyChart = ({ study }: Props) => {
  const ref = useRef<HighchartsReact.RefObject>(null);
  usePointSync(study?.id, ref?.current?.chart);
  useRangeSync(study?.id, ref?.current?.chart);
  return <Chart study={study} chartRef={ref} />;
};
