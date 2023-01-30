import { PointOptionsObject } from "highcharts";
import { HStock } from "../hchart";

export const TestChart = () => {
  const options: Highcharts.Options = {
    series: [
      {
        data: [
          {
            x: 0,
            y: 2,
            name: "Et excepteur mollit ea quis ad exercitation.",
            label: "1231",
          },
          { x: 1, y: 2, title: "Agnes Dennis" },
          { x: 5, y: 1, title: "Sophia McCarthy" },
          { x: 7, y: 5, title: "Mamie Adams" },
          { x: 8, y: 0, title: "Mable Powers" },
        ],
        type: "spline",
        lineWidth: 0,
        marker: {
          enabled: true,
          radius: 3,
          symbol: "triangle-down",
        },
        states: {
          hover: {
            lineWidthPlus: 0,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (v) {
            return (this.point as PointOptionsObject).title;
          },
        },
      },
      {
        data: [
          {
            x: 0,
            y: 2,
            name: "Et excepteur mollit ea quis ad exercitation.",
            label: "1231",
          },
          { x: 1, y: 2, title: "Agnes Dennis" },
        ],
        type: "spline",
        lineWidth: 0,
        marker: {
          enabled: true,
          radius: 3,
          symbol: "triangle-down",
        },
        states: {
          hover: {
            lineWidthPlus: 0,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (v) {
            return (this.point as PointOptionsObject).title;
          },
        },
      },
    ],
    plotOptions: {
      series: {
        dataLabels: {
          allowOverlap: true
        },
      },
    },
  };
  return <HStock options={options} />;
};
