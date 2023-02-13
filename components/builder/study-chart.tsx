import { Box, useTheme } from "@mui/joy";
import HighchartsReact from "highcharts-react-official";
import { memo, useRef } from "react";
import { HStock } from "../hchart";
import { usePointerSet } from "./context/pointer.context";
import { usePointSync, useRangeSync } from "./hooks/sync.hook";
import { useStudyChartConfig } from "./hooks/study-chart-config";
import { chartZoomScroll } from "../../utils/chart.utils";
import { ITVStudy } from "../tv-components/types";
import { useChartEvents } from "./context/events.context";

type Props = {
  study: ITVStudy;
  view?: number;
  chartRef?: React.RefObject<HighchartsReact.RefObject>;
};

export const StudyChartH = ({ study, chartRef, view }: Props) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const { selecting } = useChartEvents();
  const options = useStudyChartConfig(study, view);
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
    chart.container.addEventListener("mousewheel", (e) => {
      chartZoomScroll(e as WheelEvent, chart);
    });
  };
  const theme = useTheme();
  return (
    <Box
      ref={boxRef}
      height="100%"
      position="relative"
      border={2}
      borderColor={selecting ? theme?.palette?.success?.[200] : "transparent"}
      boxSizing="border-box"
    >
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

export const StudyChart = ({ study, view }: Props) => {
  const ref = useRef<HighchartsReact.RefObject>(null);
  usePointSync(study?.id, ref?.current?.chart);
  useRangeSync(study?.id, ref?.current?.chart);
  return <Chart study={study} chartRef={ref} view={view} />;
};
