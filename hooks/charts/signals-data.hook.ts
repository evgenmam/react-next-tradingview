import { applySignal } from "../../utils/calculations";
import { getNextLabel } from "../../utils/chart.utils";
import { useSignals } from "../data.hook";
import { useRows } from "../data.hook";

export const useSignalsData = ({ height = 50 }: { height?: number }) => {
  const { signals } = useSignals();
  const { rows, dataset } = useRows("source");
  const series: Highcharts.SeriesOptionsType[] = signals
    .filter((v) => !v.hide)
    .flatMap(applySignal(rows))
    .map(({ signal, data }) => ({
      type: "scatter",
      name: `signal-${signal.id}`,
      color: signal.color,
      marker: {
        symbol: "circle",
        radius: 3,
      },
      data: data.map((v) => ({
        x: v.time,
        y: 1,
      })),
      yAxis: "signals",
    }));

  const yAxis: Highcharts.YAxisOptions[] = [
    {
      id: "signals",
      height,
      labels: {
        enabled: false,
      },
      plotLines: [getNextLabel(dataset)],
    },
  ];

  return { series, yAxis };
};
