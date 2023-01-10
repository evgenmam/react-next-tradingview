import { Box, Divider, Typography } from "@mui/joy";
import { Stack } from "@mui/system";
import { useDebounce } from "use-debounce";
import { useFields, useRows, useSettings } from "../../hooks/data.hook";

type Props = {
  active: number;
};

const ChartDataRow = ({ idx = 0, field }: { idx: number; field: string }) => {
  const { rows, indexed } = useRows();
  const row = rows?.findIndex((r) => r.time >= idx);
  const color =
    rows?.[row]?.[field] > rows?.[row - 1]?.[field] ? "success" : "danger";
  return (
    <Stack direction="row" justifyContent="space-between" spacing={1}>
      <Typography fontWeight={600} fontSize={12} whiteSpace="nowrap">
        {field}
      </Typography>
      <Typography
        fontSize={12}
        color={field === "time" ? "neutral" : color}
        fontFamily="monospace"
      >
        {rows?.[row]?.[field]}
      </Typography>
    </Stack>
  );
};

export const ChartData = ({ active = 0 }: Props) => {
  const { fields } = useFields();
  return (
    <Stack>
      <Divider>Chart Data</Divider>
      <Box mt={1}>
        {fields.reverse().map((field) => (
          <ChartDataRow idx={active} key={field} field={field} />
        ))}
      </Box>
    </Stack>
  );
};
