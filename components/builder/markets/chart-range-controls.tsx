import { Box } from "@mui/joy";
import HighchartsReact from "highcharts-react-official";
import { memo, useRef } from "react";
import { useRows } from "../../../hooks/data.hook";
import { HStock } from "../../hchart";
import { useRangeGet, useRangeSet } from "../context/range.context";
import { useRangeSync } from "../hooks/sync.hook";

export const ChartRangeControlsW = ({
  chartRef,
}: {
  chartRef?: React.RefObject<HighchartsReact.RefObject>;
}) => {
  const { rows } = useRows("source");
  const ref = useRef<HTMLDivElement>(null);
  const set = useRangeSet();

  if (!rows.length) return null;
  return (
    <Box position="absolute" bottom={0} right={0} width="100%" ref={ref}>
      <HStock
        ref={chartRef}
        options={
          {
            chart: {
              height: 90,
              events: {},
              margin: [0, 0, 0, 0],
            },
            series: [
              {
                type: "line",
                data: rows.map((r) => [r.time, r.close]),
              },
            ],
            xAxis: {
              visible: false,
              range: 12 * 30 * 24 * 3600 * 1000,
              events: {
                afterSetExtremes: (e) => set({ event: e, key: "scroll" }),
              },
            },
            yAxis: { visible: false, height: 0 },
            rangeSelector: {
              enabled: false,
            },
            navigator: {
              height: 30,
            },
            credits: { enabled: false },
          } as Highcharts.Options
        }
      />
    </Box>
  );
};

const CRC = memo(ChartRangeControlsW);

export const ChartRangeControls = () => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  useRangeSync("scroll", chartRef?.current?.chart);
  return <CRC chartRef={chartRef} />;
};
