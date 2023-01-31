import Highcharts from "highcharts";

export const yAxis: Highcharts.YAxisOptions = {
  crosshair: {
    dashStyle: "Dash",
    label: {
      enabled: true,
      style: {
        textAlign: "right",
        background: "transparent",
      },
      backgroundColor: "transparent",
    },
  },
};

export const mouseOver = function (this: Highcharts.Series) {
  Highcharts.charts?.forEach((chart) => {
    const { title } = this.chart;
    if (chart?.title !== title) {
      // console.log(this.chart);
    }
  });
};

export const PlotTypes = {
  0: "Line",
  1: "Histogram",
  3: "Cross",
  4: "Area",
  5: "Columns",
  6: "Circles",
  7: "LineWithBreaks",
  8: "AreaWithBreaks",
  9: "StepLine",
  10: "StepLineWithDiamonds",
  Area: 4,
  AreaWithBreaks: 8,
  Circles: 6,
  Columns: 5,
  Cross: 3,
  Histogram: 1,
  Line: 0,
  LineWithBreaks: 7,
  StepLine: 9,
  StepLineWithDiamonds: 10,
};
