import { Stack, Typography } from "@mui/joy";
import { Space } from "./row";
import * as R from "ramda";
import { Box } from "@mui/system";
import React from "react";
import { XJson } from "../json";
import { cur, per, val } from "../../utils/number.utils";

export type XStatsCol = {
  label: string;
  value: string | number;
  success?: boolean;
  failure?: boolean;
  dynamic?: boolean;
  split?: boolean;
  cur?: boolean;
  per?: boolean;
  val?: boolean;
};
export type Props = {
  stats: XStatsCol[];
  table?: boolean;
  g?: number;
};

const getColor = ({ success, failure, dynamic, value }: XStatsCol) => {
  if (success) return "success";
  if (failure) return "danger";
  if (dynamic) {
    if (typeof value === "number")
      return value > 0 ? "success" : value < 0 ? "danger" : "neutral";
    if (typeof value === "string")
      return value.startsWith("-")
        ? "danger"
        : +value.replace(/%|\$/, "") > 0
        ? "success"
        : "neutral";
  }
  return "neutral";
};
export const XStats = ({ stats, table, g = 5 }: Props) => {
  return table ? (
    <Space columnGap={3} rowGap={0.5} wrap c>
      {R.pipe<XStatsCol[][], XStatsCol[][]>(R.groupWith((a, b) => !b.split))(
        stats
      ).map((s, i) => (
        <Stack gap={0.5} key={s[0].label}>
          {s.map((v, j) => {
            return (
              <Space c key={v.label} gap={1} sb>
                <Box gridRow={[j + 1]}>
                  <Typography level="body2">{v.label}</Typography>
                </Box>
                <Box gridRow={[j + 1]}>
                  <Typography textAlign="right" color={getColor(v)}>
                    {typeof v.value === "number"
                      ? [cur, per, val].at(
                          [v.cur, v.per, v.val].findIndex((a) => !!a)!
                        )?.(v.value) || "-"
                      : v.value}
                  </Typography>
                </Box>
              </Space>
            );
          })}
        </Stack>
      ))}
    </Space>
  ) : (
    <Space sa gap={2} wrap>
      {stats.map((s) => (
        <Stack spacing={1} key={s.label} alignItems="center">
          <Typography level="body2" lineHeight={1}>
            {s.label}
          </Typography>
          <Typography level="body1" lineHeight={1} color={getColor(s)}>
            {s.value}
          </Typography>
        </Stack>
      ))}
    </Space>
  );
};
