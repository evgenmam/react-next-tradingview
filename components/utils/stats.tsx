import { Stack, Typography } from "@mui/joy";
import { Space } from "./row";

export type XStatsCol = {
  label: string;
  value: string | number;
  success?: boolean;
  failure?: boolean;
  dynamic?: boolean;
};
export type Props = {
  stats: XStatsCol[];
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
        : +value.replace(/%|\$/, '') > 0
        ? "success"
        : "neutral";
  }
  return "neutral";
};
export const XStats = ({ stats }: Props) => {
  return (
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
