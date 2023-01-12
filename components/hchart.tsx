/* eslint-disable react/display-name */
import Highcharts from "highcharts";
import HighchartsStock from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import { forwardRef } from "react";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
  HighchartsExporting(HighchartsStock);
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
