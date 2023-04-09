import { memo, useEffect, useMemo, useState } from "react";
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

export const useSignalHover = (chart: Highcharts.Chart, active: number) => {
  const hoverPoint = chart.hoverPoints?.find((v) =>
    v.series.name.startsWith("signal")
  );
  const { signals } = useSignals();
  const signalIndex = hoverPoint?.series.name?.split("-")[1] || -1;
  const signal = signals.find((v) => v.id === +signalIndex);

  useEffect(() => {
    if (hoverPoint && signal) {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverPoint?.x]);
};

export const useStrategyHover = (chart: Highcharts.Chart, active: number) => {
  useEffect(() => {
    const series = chart?.series
      ?.filter((v) => v.name?.startsWith?.("strategy"))
      .filter(
        (v) =>
          v?.points[0]?.x <= active &&
          v?.points[v?.points.length - 1]?.x >= active
      );
    if (series?.length) {
      series.forEach((v) => {
        v.setState("hover");
        v?.yAxis?.series
          ?.filter((v) => v.type === "candlestick")
          ?.forEach((v) => {
            v.setState("inactive");
          });
        v.data?.forEach((v) => {
          v.setState("inactive");
        });
      });
      return () => {
        series.forEach((v) => {
          v?.yAxis?.series
            ?.filter((v) => v.type === "candlestick")
            ?.forEach((v) => {
              v.setState("normal");
            });
          v.setState("normal");
          v.points.forEach((v) => v.setState("normal"));
        });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
};

export const useAlertConditionHover = (
  chart: Highcharts.Chart,
  active: number
) => {
  useEffect(() => {
    const alerts = chart?.series?.filter((v) => v.name?.startsWith?.("alert"));
    alerts.forEach((a) => {
      const idx = findClosestIndexByX(active, 1)(a?.points || []);
      const p = a?.points?.[idx];
      a?.points?.forEach((v) => v.setState("inactive"));
      if (p) {
        a?.setState?.("hover");
        p?.setState?.("hover");
      }
    });
    return () => {
      alerts.forEach((a) => {
        a?.setState?.("normal");
        a?.points?.forEach((v) => v.setState("normal"));
      });
    };

    const series = chart?.series
      ?.filter((v) => v.name?.startsWith?.("strategy"))
      .filter(
        (v) =>
          v?.points[0]?.x <= active &&
          v?.points[v?.points.length - 1]?.x >= active
      );
    if (series?.length) {
      series.forEach((v) => {
        v.setState("hover");
        v?.yAxis?.series
          ?.filter((v) => v.type === "candlestick")
          ?.forEach((v) => {
            v.setState("inactive");
          });
        v.data?.forEach((v) => {
          v.setState("inactive");
        });
      });
      return () => {
        series.forEach((v) => {
          v?.yAxis?.series
            ?.filter((v) => v.type === "candlestick")
            ?.forEach((v) => {
              v.setState("normal");
            });
          v.setState("normal");
          v.points.forEach((v) => v.setState("normal"));
        });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
};

Highcharts.Pointer.prototype.reset = function () {
  return undefined;
};
export const HoverWatcher1 = ({ chart }: { chart: Highcharts.Chart }) => {
  const active = useHoverGet();

  useSignalHover(chart, active);
  useStrategyHover(chart, active);
  return null;
};

export const HoverWatcher = memo(HoverWatcher1);
