import Highcharts, { YAxisOptions } from "highcharts";
import * as R from "ramda";
import { IChartData } from "../types/app.types";
export const syncExtremes = function (
  this: Highcharts.Axis,
  e: Highcharts.AxisSetExtremesEventObject
) {
  const thisChart = this.chart;
  if (e.trigger !== "syncExtremes") {
    // Prevent feedback loop
    Highcharts.each(Highcharts.charts, function (chart: Highcharts.Chart) {
      if (chart !== thisChart) {
        if (chart.xAxis[0].setExtremes!) {
          // It is null while updating
          chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
            trigger: "syncExtremes",
          });
        }
      }
    });
  }
};

export const getNextLabel = (label: string) => ({
  zIndex: 0,
  value: 0,
  label: {
    text: label,
    style: {
      fontSize: "16px",
    },
    useHTML: true,
    y: 20,
  },
  width: 0,
});

export const getLabelAxis = (
  id: string,
  label: string,
  top: YAxisOptions["top"] = 24,
  height = 200
): YAxisOptions => ({
  id: `${id}-left`,
  opposite: false,
  top,
  height,
  width: 0,
  panningEnabled: false,
  gridLineWidth: 0,
  left: 0,
  labels: {
    enabled: false,
  },
  zoomEnabled: false,
  title: {
    textAlign: "left",
    rotation: 0,
    text: label,
    align: "high",
    x: 30,
    y: 24,
    offset: 0,
    margin: 0,
    reserveSpace: false,
    style: {
      fontSize: "16px",
      fontWeight: "300",
    },
  },
});

export const getTVLogo = (path: string) =>
  `https://s3-symbol-logo.tradingview.com/${path}.svg`;

export const chartZoomScroll = (
  scrollEvent: WheelEvent,
  chart: Highcharts.Chart,
  sensitivity = 0.4
) => {
  const ev = scrollEvent;
  ev.stopPropagation();
  ev.preventDefault();
  const pointerEvent = chart.pointer.normalize(ev);
  const point = chart?.series[0]?.searchPoint(pointerEvent, true);
  if (point) {
    const extr = chart?.xAxis[0].getExtremes();
    if (ev.deltaY) {
      const percent = sensitivity * (ev.deltaY > 0 ? 1 : -1);

      const range = extr.max - extr.min;
      const newRange = range + range * percent;
      const diff = (point.x - extr.min) / range;
      const newMin = point.x - newRange * diff;
      const newMax = newMin + newRange;
      const c = R.clamp(extr.dataMin, extr.dataMax);

      chart?.xAxis[0].setExtremes(c(newMin), c(newMax), undefined, false);
    } else if (ev.deltaX) {
      const percent = (sensitivity / 2) * (ev.deltaX > 0 ? 1 : -1);
      const range = extr.max - extr.min;
      const newMin = extr.min + range * percent;
      const newMax = extr.max + range * percent;
      if (newMin <= extr.dataMin) {
        chart?.xAxis[0].setExtremes(
          extr.dataMin,
          extr.dataMin + range,
          undefined,
          false
        );
      } else if (newMax >= extr.dataMax) {
        chart?.xAxis[0].setExtremes(
          extr.dataMax - range,
          extr.dataMax,
          undefined,
          false
        );
      } else {
        chart?.xAxis[0].setExtremes(newMin, newMax, undefined, false);
      }
    }
  }
};

export const toHeikinAshi = (data: IChartData[]) =>
  data
    .map((v, idx) =>
      data[idx - 1]
        ? {
            ...v,
            open: (data[idx - 1].open + data[idx - 1].close) / 2,
            close: (v.close + v.open + v.high + v.low) / 4,
          }
        : v
    )
    .map((v, idx) =>
      data[idx - 1]
        ? {
            ...v,
            high: Math.max(v.high, v.close, v.open),
            close: Math.min(v.low, v.close, v.open),
          }
        : v
    );
