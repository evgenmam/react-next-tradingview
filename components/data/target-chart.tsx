import { memo, useRef } from "react";
import { useRows, useStrategies } from "../../hooks/data.hook";
import { HStock } from "../hchart";
import Highcharts from "highcharts/highstock";
import colors from "material-colors";
import { calculateStrategy } from "../../utils/calculations";
import HighchartsReact from "highcharts-react-official";
import { syncExtremes } from "../../utils/chart.utils";
import { HoverWatcher } from "./hover-watcher";

export const TargetChart1 = ({
  setHover,
  target = "target",
}: {
  rows: string;
  setHover: (i: number) => void;
  target?: string;
}) => {
  const { rows } = useRows(target);
  const { strategies } = useStrategies();
  const { rows: source } = useRows("source");
  const chartH = 300;

  const data = strategies.map(calculateStrategy(source, rows));

  const tradeLines =
    data?.[0]?.map(
      ({
        opened,
        color,
        closed,
        openPrice,
        closePrice,
        pnl,
      }): Highcharts.SeriesLineOptions => ({
        type: "line",
        color,
        data: [
          {
            connectorColor: color,
            x: opened,
            y: openPrice,
            marker: {
              enabled: true,
              radius: 10,
              symbol: pnl && pnl > 0 ? "triangle-down" : "triangle",
            },
          },
          { x: closed, y: closePrice },
        ],
      })
    ) || [];
  const options: Highcharts.Options = {
    yAxis: [
      {
        height: chartH + 100 + "px",
        resize: {
          enabled: true,
        },
      },
    ],
    series: [
      {
        type: "candlestick",
        data: rows.map((row) => [
          row.time,
          row.open,
          row.high,
          row.low,
          row.close,
        ]),
        color: colors.red[300],
        upColor: colors.green[300],
        lineColor: colors.red[600],
        upLineColor: colors.green[600],
        name: "Market value",
      },
      ...tradeLines,
    ],
    chart: {
      height: 600,
    },
    accessibility: {
      enabled: false,
    },
    tooltip: {
      formatter: function (tooltip) {
        // if (this.x && typeof this.x === "number") setHover(this.x);
        return [this.x ? new Date(this.x).toLocaleString() : null];
      },
      stickOnContact: true,
      snap: 50,
    },
    xAxis: {
      events: {
        setExtremes: syncExtremes,
      },
    },
  };

  const chartRef = useRef<HighchartsReact.RefObject | null>(null);
  return (
    <>
      <HStock options={options} ref={chartRef} />
      {chartRef.current?.chart && (
        <>
          <HoverWatcher chart={chartRef.current.chart} />
        </>
      )}
    </>
  );
};

export const TargetChart = memo(TargetChart1);
