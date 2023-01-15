/* eslint-disable react/display-name */
import Highcharts from "highcharts";

import HighchartsStock from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import { forwardRef, useEffect } from "react";
import dragPanes from "highcharts/modules/drag-panes";
import { useSettings } from "../hooks/data.hook";
import DarkTheme from "highcharts/themes/dark-blue";
import LightTheme from "highcharts/themes/brand-light";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
  HighchartsExporting(HighchartsStock);
  dragPanes(HighchartsStock);
  if (localStorage.getItem("joy-mode") === "dark") {
    DarkTheme(HighchartsStock);
  } else {
    LightTheme(HighchartsStock);
  }
}

export const HChart = (props: HighchartsReact.Props) => {
  return <HighchartsReact highcharts={Highcharts} {...props} />;
};

export const HStock = forwardRef<
  HighchartsReact.RefObject,
  HighchartsReact.Props
>((props, ref) => {
  return (
    <HighchartsReact
      ref={ref}
      highcharts={HighchartsStock}
      constructorType={"stockChart"}
      {...props}
    />
  );
});
