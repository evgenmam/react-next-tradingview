import { Stack, Typography } from "@mui/joy";
import { Box } from "@mui/system";
import { capitalCase } from "change-case";
import { FC } from "react";
import { Space } from "./row";

type Props = {
  data: Record<string, any>;
  row?: boolean;
  colorize?: string[];
};
export const JSONDetails: FC<Props> = ({ row, data, colorize = [] }) => {
  return (
    <Stack {...(row && { direction: "row", columnGap: 2, flexWrap: "wrap" })}>
      {Object.entries(data).map(([key, value]) => (
        <Space key={key} c s={1}>
          <Typography level="body2">{capitalCase(key)}:</Typography>
          <Typography
            {...(colorize.includes(key) &&
              typeof value === "number" && {
                color: value > 0 ? "success" : value < 0 ? "danger" : "neutral",
              })}
          >
            {value}
          </Typography>
        </Space>
      ))}
    </Stack>
  );
};
