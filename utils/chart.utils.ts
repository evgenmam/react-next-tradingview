import Highcharts, { YAxisOptions } from "highcharts";

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
  top: YAxisOptions["top"] = 24
): YAxisOptions => ({
  id: `${id}-label}`,
  opposite: false,
  top,
  width: 0,
  panningEnabled: false,
  gridLineWidth: 0,
  left: 0,

  zoomEnabled: false,
  title: {
    textAlign: "left",
    rotation: 0,
    text: label,
    align: "high",
    x: 20,
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
