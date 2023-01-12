import { useEffect, useState } from "react";
import { useHoverGet } from "../../hooks/hover.hook";
import Highcharts from "highcharts";
import { useZoomGet } from "../../hooks/zoom.hook";
Highcharts.Pointer.prototype.reset = function () {
  return undefined;
};
export const HoverWatcher = ({ chart }: { chart: Highcharts.Chart }) => {
  const active = useHoverGet();
  const point = chart?.series?.[0].points?.find?.((p) => {
    return p.x === active});
  useEffect(() => {
    if (point?.x && chart?.series) {
      try {
        point?.onMouseOver?.();
      } catch (error) {}
    }
  }, [point?.x]);

  return null;
};

export const ZoomWatcher = ({ chart }: { chart: Highcharts.Chart }) => {
  const zoom = useZoomGet();
  useEffect(() => {
    chart.xAxis[0].setExtremes(zoom.min, zoom.max);
  }, [zoom]);
  // const point = chart.series[0].points.find((p) => p.x === active);

  // useEffect(() => {
  //   if (point?.x) {
  //     point?.onMouseOver();
  //   }
  // }, [point?.x]);

  return null;
};
