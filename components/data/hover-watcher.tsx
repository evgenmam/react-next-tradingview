import { useEffect, useState } from "react";
import { useHoverGet } from "../../hooks/hover.hook";
import Highcharts from "highcharts";
import { useZoomGet } from "../../hooks/zoom.hook";
Highcharts.Pointer.prototype.reset = function () {
  return undefined;
};
export const HoverWatcher = ({ chart }: { chart: Highcharts.Chart }) => {
  const active = useHoverGet();
  const [mainchart, ...series] = chart.series;
  const point = mainchart.points?.sort((a, b) =>
    Math.abs(active - a.x) < Math.abs(active - b.x) ? -1 : 1
  )[0];

  useEffect(() => {
    console.log(active);
    if (active !== -1 && point?.x && chart?.series) {
      const pl = chart?.xAxis[0]?.addPlotLine({ value: point.x, width: 3 });
      point?.setState("hover");
      return () => {
        pl?.destroy?.();
        point?.setState?.("normal");
      };
    }
  }, [active]);

  useEffect(() => {
    if (active !== -1 && point?.x) {
      series.forEach((s) => {
        console.log(s.points?.[0]?.x, active);
        if (
          s.points?.[0]?.x <= active &&
          s.points?.[s.points.length - 1]?.x >= active
        ) {
          s.setState("hover");
        } else {
          s.setState("inactive");
        }
      });
    } else {
      series.forEach((s) => s.setState("normal"));
    }
  }, [active]);

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
