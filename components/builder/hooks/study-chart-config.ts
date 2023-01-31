import { useTheme } from "@mui/joy";
import { useMemo } from "react";
import { useRows } from "../../../hooks/data.hook";
import { ITVStudy } from "../../tv-components/types";
import { useV2Study } from "../../v2/hooks/v2-data.hook";
import { useRangeSet } from "../context/range.context";
import { useStudyChartAlerts } from "./study-chart/alerts";
import { useStudyChartCircles } from "./study-chart/circles";
import { useStudyChartArearanges } from "./study-chart/filled";
import { useStudyChartLines } from "./study-chart/lines";
import { useStudyChartPlots } from "./study-chart/plots";
import { useStudyChartSource } from "./study-chart/source";

export const useStudyChartConfig = (s: ITVStudy) => {
  const { palette } = useTheme();
  const setRange = useRangeSet();
  const { study, config } = useV2Study(s.id);
  const source = useStudyChartSource(study!);
  const plots = useStudyChartPlots(study!, config);
  const filled = useStudyChartArearanges(study!, plots, config);
  const lines = useStudyChartLines(study!, plots, config);
  const circles = useStudyChartCircles(study!, plots);
  const alerts = useStudyChartAlerts(
    study!,
    plots,
    study?.meta?.is_price_study ? source : lines
  );
  const options: Highcharts.Options = useMemo(
    () => ({
      title: {
        text: s?.meta?.description,
        floating: true,
        y: 20,
        align: "left",
        style: {
          fontSize: "12px",
        },
      },
      chart: {
        height: 450,
      },
      plotOptions: {
        spline: {
          tooltip: {
            borderWidth: 0,
            borderColor: "transparent",
            shape: "square",
            pointFormat:
              "<span style='color: {series.color}'>{series.name}</span><br/>",
            backgroundColor: "transparent",

            headerFormat: "",
          },
        },
      },
      legend: {
        enabled: true,
        alignColumns: false,
        // floating: true,
        layout: "horizontal",
        verticalAlign: "bottom",
        // align: "right",
        // verticalAlign: "top",
      },
      series: [source, lines, filled, alerts, circles].flat(),
      xAxis: {
        events: {
          setExtremes: (e) => {
            if (e.trigger !== "sync") setRange({ event: e, key: config?.id! });
          },
        },

        crosshair: {
          dashStyle: "Dash",
          label: {
            enabled: true,
            shape: "square",
            style: {
              textAlign: "right",
            },
            backgroundColor: palette?.background?.level1,
          },
        },
      },
      tooltip: {
        pointFormat: "",
        padding: 2,
        headerFormat: "",
      },
      rangeSelector: {
        enabled: false,
      },
      yAxis: [
        ...(study?.meta?.is_price_study
          ? [{ id: "source", name: "source" }]
          : []),
        {
          id: "main",
        },
      ],

      navigator: {
        enabled: false,
      },
      scrollbar: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
    }),
    [
      study,
      config?.id,
      lines,
      filled,
      source,
      palette,
      s?.meta?.description,
      setRange,
      alerts,
      circles,
    ]
  );
  return options;
};
