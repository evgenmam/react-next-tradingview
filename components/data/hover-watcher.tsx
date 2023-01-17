import { useEffect, useState } from "react";
import { useHoverGet } from "../../hooks/hover.hook";
import Highcharts, { PlotLineOrBand } from "highcharts";
import { useZoomGet } from "../../hooks/zoom.hook";
import { findClosestIndexByX } from "../../utils/data.utils";
import { useSignals } from "../../hooks/data.hook";
import { ISignal } from "../../types/app.types";
import { capitalCase, sentenceCase } from "change-case";

const ohlc = ["open", "high", "low", "close"];
const findSignalAxis = (signal: ISignal, series: Highcharts.Series[]) => {
  const s = signal?.condition?.map(({ a, b }) => ({
    a: ohlc?.includes(a?.field!) ? "source" : a?.field,
    b: ohlc?.includes(b?.field!) ? "source" : b?.field,
  }));
  return s.map((v) => ({
    a: series.find((s) => s.name === v.a),
    b: series.find((s) => s.name === v.b),
  }));
};

Highcharts.Pointer.prototype.reset = function () {
  return undefined;
};
export const HoverWatcher = ({ chart }: { chart: Highcharts.Chart }) => {
  const active = useHoverGet();

  const hoverPoint = chart.hoverPoints?.find((v) =>
    v.series.name.startsWith("signal")
  );

  console.log(hoverPoint);

  const signalIndex = hoverPoint?.series.name?.split("-")[1] || -1;
  const { signals } = useSignals();
  const signal = signals.find((v) => v.id === +signalIndex);
  useEffect(() => {
    if (hoverPoint) {
      const pl = chart?.xAxis[0].addPlotLine({
        value: active,
        color: signal?.color,
        width: 1,
        dashStyle: "Dash",
        zIndex: 1,
        label: {
          text: "",
          useHTML: true,
          rotation: 0,
          align: "right",
        },
      });

      const seriesPairs = findSignalAxis(signal!, chart.series);
      seriesPairs.forEach(({ a, b }, idx) => {
        a?.setState("normal");
        b?.setState("normal");
        a?.points?.forEach((v) => v.setState("inactive"));
        b?.points?.forEach((v) => v.setState("inactive"));
        const p1 = a?.points?.[findClosestIndexByX(active, 1)(a?.points || [])];
        const p2 = b?.points?.[findClosestIndexByX(active, 1)(b?.points || [])];
        p1?.setState("hover");
        p2?.setState("hover");
        pl?.label?.attr({
          // @ts-ignore
          y: p1?.plotY + (p1?.series?.yAxis?.top! || 0) - 50,
          translateX: -20,
          text: `<div style="padding-right: 30px; text-align: right; font-weight: 600;">
          ${signal?.condition
            ?.map((v) =>
              [
                capitalCase(v.a?.field!),
                sentenceCase(v.operator),
                v.b?.field,
              ].join("<br />")
            )
            .join("<br />")}
            </div>`,
        });
      });
      return () => {
        pl?.destroy();
        seriesPairs.forEach(({ a, b }) => {
          a?.setState("normal");
          b?.setState("normal");
          a?.points?.forEach((v) => v.setState("normal"));
          b?.points?.forEach((v) => v.setState("normal"));
        });
      };
    }
  }, [hoverPoint?.x]);

  return null;
};
