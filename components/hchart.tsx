/* eslint-disable react/display-name */
import Highcharts, { Chart } from "highcharts";

import HighchartsStock from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsAnnotations from "highcharts/modules/annotations";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import { forwardRef } from "react";
import dragPanes from "highcharts/modules/drag-panes";
import { useSettings } from "../hooks/data.hook";
import DarkMLTheme from "./themes/hc-dark";
import LightTheme from "highcharts/themes/brand-light";
import { deepmerge } from "@mui/utils";
import * as R from "ramda";
if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
  HighchartsMore(HighchartsStock);
  HighchartsAnnotations(HighchartsStock);
  dragPanes(HighchartsStock);
  if (localStorage.getItem("joy-mode") === "dark") {
    DarkMLTheme.apply(HighchartsStock);
  } else {
    LightTheme(HighchartsStock);
  }
}

const rangeButtons: Array<Highcharts.RangeSelectorButtonsOptions> = R.range(
  1,
  5
).map((_, i) => ({
  count: i + 1,
  type: "year",
  text: `${i + 1}Y`,
}));
export const defaults: HighchartsReact.Props["options"] = {
  chart: {
    animation: false,
  },
  plotOptions: {
    series: {
      animation: false,
    },
  },
  accessibility: {
    enabled: false,
  },
  xAxis: {
    range: 12 * 30 * 24 * 3600 * 1000,
  },
};
export const HChart = (props: HighchartsReact.Props) => {
  return <HighchartsReact highcharts={Highcharts} {...props} />;
};

export const HStock = forwardRef<
  HighchartsReact.RefObject,
  HighchartsReact.Props
>(({ children, ...props }: HighchartsReact.Props, ref) => {
  const options = { ...props.options };
  return (
    <HighchartsReact
      ref={ref}
      highcharts={HighchartsStock}
      constructorType={"stockChart"}
      {...props}
      options={deepmerge(defaults, options)}
    />
  );
});
