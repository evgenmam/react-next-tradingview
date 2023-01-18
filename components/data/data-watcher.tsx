import { useEffect } from "react";
import { useIndicators, useRows } from "../../hooks/data.hook";

export const DataWatcher = ({ chart }: { chart: Highcharts.Chart }) => {
  const { rows } = useRows("source");
  useEffect(() => {
    const last = rows[rows.length - 1]?.time || new Date().getMilliseconds();
    if (rows.length > 0) {
      chart?.xAxis[0]?.setExtremes(last - 365 * 24 * 60 * 60 * 1000, last);
    }
  }, [rows.length]);
  const { indicators } = useIndicators();

  return null;
};
