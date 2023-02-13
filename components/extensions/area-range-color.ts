import * as Highcharts from "highcharts";
import { Series } from "highcharts";
import * as R from "ramda";

import HighchartsStock from "highcharts/highstock";
import dynamic from "next/dynamic";
import { v4 } from "uuid";
const line = Series.types.line;
const AreaRangeColor = function (H: typeof HighchartsStock) {
  // H.wrap(H.Series.prototype, "redraw", function (this: Series, proceed) {
  //   if (this.userOptions?.type === "arearange") {
  //     proceed.apply(this, Array.prototype.slice.call(arguments, 1));

  //     const startIndex = R.findIndex((v) => v >= this.processedXData.at(0))(
  //       this.xData
  //     );
  //     const endIndex = R.findIndex((v) => v >= this.processedXData?.at(-1))(
  //       this.xData
  //     );
  //     console.log(startIndex, endIndex);
  //     const gradient = this.graph?.element
  //       ?.closest("svg")
  //       ?.getElementById(
  //         this.graph?.attr("stroke")?.match(/url\(#(.*)\)/)?.[1]
  //       );
  //     const stop1 = gradient?.querySelector(`stop:nth-child(${startIndex})`);
  //     const stop2 = gradient?.querySelector(`stop:nth-child(${endIndex})`);
  //     gradient?.setAttribute("x0", stop1?.getAttribute("offset"));
  //     gradient?.setAttribute("x1", stop2?.getAttribute("offset"));
  //     // this.points.map((p, idx) => )
  //     // this.graph.
  //     // console.log(this.graph?.attr({ fill: "rgba(123,123,123,0.5)" }));
  //   } else {
  //     proceed.apply(this, Array.prototype.slice.call(arguments, 1));
  //   }
  // });
};

export default AreaRangeColor;
