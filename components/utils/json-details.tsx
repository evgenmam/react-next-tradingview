import { Stack, Typography } from "@mui/joy";
import { Box } from "@mui/system";
import { capitalCase } from "change-case";
import { FC } from "react";
import { Space } from "./row";

type Props = {
  data: Record<string, any>;
};
export const JSONDetails: FC<Props> = ({ data }) => {
  return (
    <Stack>
      {Object.entries(data).map(([key, value]) => (
        <Space key={key} c s={1}>
          <Typography level="body2">{capitalCase(key)}:</Typography>
          <Typography>{value}</Typography>
        </Space>
      ))}
    </Stack>
  );
};
