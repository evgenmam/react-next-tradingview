import { Option, Select, Typography, FormControl, Input } from "@mui/joy";
import { Box } from "@mui/system";
import * as R from "ramda";
import React, { ReactNode, useEffect, useState } from "react";
import { Space } from "../utils/row";
import { useSettings } from "../../hooks/settings.hook";

const options = [
  { value: "1", label: "1 minute", group: "Minutes", minutes: 1 },
  { value: "5", label: "5 minutes", group: "Minutes", minutes: 5 },
  { value: "15", label: "15 minutes", group: "Minutes", minutes: 15 },
  { value: "30", label: "30 minutes", group: "Minutes", minutes: 30 },
  { value: "1H", label: "1 hour", group: "Hours", minutes: 60 },
  { value: "2H", label: "2 hours", group: "Hours", minutes: 120 },
  { value: "3H", label: "3 hours", group: "Hours", minutes: 180 },
  { value: "4H", label: "4 hours", group: "Hours", minutes: 240 },
  { value: "1D", label: "1 day", group: "Days", minutes: 1440 },
  { value: "3D", label: "3 days", group: "Days", minutes: 4320 },
  { value: "1W", label: "1 week", group: "Days", minutes: 10080 },
  { value: "1M", label: "1 month", group: "Days", minutes: 43200 },
  { value: "3M", label: "3 months", group: "Days", minutes: 129600 },
  { value: "6M", label: "6 months", group: "Days", minutes: 259200 },
];
type O = typeof options[number];
export const PeriodSelect = () => {
  const { period: p } = useSettings();
  const [period, setPeriod] = useState("1W");
  const [count, setCount] = useState(300);
  const [value, setValue] = useState(count || 0);
  useEffect(() => {
    const o = options.find((o) => o.value === period);
    const g = options.find((o) => o.value === p);
    if (o && g) {
      setCount(Math.round((g.minutes / o.minutes) * 300));
    }
  }, [p, period]);
  useEffect(() => {
    setValue(count);
  }, [count]);
  return (
    <Space>
      <Box flexShrink={0}>
        <FormControl>
          <Select
            value={period || "1W"}
            onChange={(_, v) => {
              setPeriod(v);
            }}
          >
            {R.pipe<
              O[][],
              Record<string, O[]>,
              Record<string, ReactNode>,
              ReactNode[]
            >(
              R.groupBy(R.prop("group")),
              R.mapObjIndexed((options, group) => (
                <React.Fragment key={group}>
                  <Option value={group}>
                    <Typography
                      level="body3"
                      textTransform="uppercase"
                      letterSpacing="md"
                    >
                      {group}
                    </Typography>
                  </Option>
                  {options.map((o) => (
                    <Option key={group + o.label} value={o.value}>
                      {o.label}
                    </Option>
                  ))}
                </React.Fragment>
              )),
              R.values
            )(options)}
          </Select>
        </FormControl>
      </Box>
      <Box flexShrink={0}>
        <Input
          value={value}
          onChange={(e) => setValue(+e.target.value)}
          onBlur={() => setCount(value)}
          sx={{ width: 200 }}
          endDecorator={<Typography level="body2">Bars</Typography>}
        />
      </Box>
    </Space>
  );
};
