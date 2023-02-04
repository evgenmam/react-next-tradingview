import { useTheme } from "@mui/joy";
import { useMemo } from "react";
import IDB from "../../../db/db";
import { useRows, useSetting, useSettings } from "../../../hooks/data.hook";
import { ITVStudy } from "../../tv-components/types";
import { useV2Study } from "../../v2/hooks/v2-data.hook";
import { useChartEvents } from "../context/events.context";
import { useRangeSet } from "../context/range.context";
import { useStudyChartAlerts } from "./study-chart/alerts";
import { useBarColorers } from "./study-chart/bar-colorers";
import { useStudyChartCircles } from "./study-chart/circles";
import { useStudyChartArearanges } from "./study-chart/filled";
import { useStudyChartLines } from "./study-chart/lines";
import { useStudyChartPlots } from "./study-chart/plots";
import { useStudyChartSource } from "./study-chart/source";

export const useStudyChartConfig = (s: ITVStudy) => {
  const { palette } = useTheme();
  const setRange = useRangeSet();
  const { study, config } = useV2Study(s.id);
  const { legends } = useSettings();
  const plots = useStudyChartPlots(study!, config);
  const source = useStudyChartSource(study!, config);
  const filled = useStudyChartArearanges(study!, plots, config);
  const lines = useStudyChartLines(study!, plots, config);
  const circles = useStudyChartCircles(study!, plots);
  const alerts = useStudyChartAlerts(
    study!,
    plots,
    study?.meta?.is_price_study ? source : lines
  );
  console.log(alerts);
  const { events } = useChartEvents();
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
        height: legends ? 450 : 300,
        marginLeft: 0,
        marginRight: 0,
        events: {
          click: function () {
            events.emit({
              points: this.hoverPoints?.filter((p) => !!p?.series?.options?.id),
            });
          },
        },
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
        series: {
          events: {
            legendItemClick: async function () {
              const [studyId, plotId] = this.options.id?.split(":") || [];
              if (plotId) {
                IDB.studyConfigs.update(studyId, {
                  [`hideFields.${plotId}`]: this.visible,
                });
              }
              return false;
            },
          },
        },
      },
      legend: {
        enabled: !!legends,
        alignColumns: false,
        layout: "horizontal",
        verticalAlign: "bottom",
      },

      series: [source, lines, filled, alerts, circles].flat()?.map((s) => ({
        ...s,
        visible: !config?.hideFields?.[s.id?.split?.(":")?.[1]!],
        events: {
          click: function () {},
        },
      })),
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
      study?.meta?.is_price_study,
      config?.id,
      // config?.hideFields,
      lines,
      filled,
      source,
      palette,
      s?.meta?.description,
      setRange,
      alerts,
      circles,
      legends,
      events,
    ]
  );
  console.log(options);

  return options;
};
