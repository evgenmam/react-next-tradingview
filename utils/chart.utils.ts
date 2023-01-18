import Highcharts from "highcharts";

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
