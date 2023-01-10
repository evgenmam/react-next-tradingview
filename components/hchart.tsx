import Highcharts from "highcharts";
import HighchartsStock from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
  HighchartsExporting(HighchartsStock);
}

export const HChart = (props: HighchartsReact.Props) => {
  console.log("render");
  return <HighchartsReact highcharts={Highcharts} {...props} />;
};

export const HStock = (props: HighchartsReact.Props) => {
  return (
    <HighchartsReact
      highcharts={HighchartsStock}
      constructorType={"stockChart"}
      {...props}
    />
  );
};
