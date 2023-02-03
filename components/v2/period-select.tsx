import { Option, Select, Typography, FormControl } from "@mui/joy";
import { Box } from "@mui/system";
import * as R from "ramda";
import React, { ReactNode } from "react";
import { useSettings } from "../../hooks/data.hook";

const options = [
  { value: "1", label: "1 minute", group: "Minutes" },
  { value: "5", label: "5 minutes", group: "Minutes" },
  { value: "15", label: "15 minutes", group: "Minutes" },
  { value: "30", label: "30 minutes", group: "Minutes" },
  { value: "1H", label: "1 hour", group: "Hours" },
  { value: "2H", label: "2 hours", group: "Hours" },
  { value: "3H", label: "3 hours", group: "Hours" },
  { value: "4H", label: "4 hours", group: "Hours" },
  { value: "1D", label: "1 day", group: "Days" },
  { value: "3D", label: "3 days", group: "Days" },
  { value: "1W", label: "1 week", group: "Days" },
  { value: "1M", label: "1 month", group: "Days" },
  { value: "3M", label: "3 months", group: "Days" },
  { value: "6M", label: "6 months", group: "Days" },
];
type O = typeof options[number];
export const V2PeriodSelect = () => {
  const { period, setPeriod } = useSettings();
  return (
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
  );
};
