import { Box, Divider, Typography } from "@mui/joy";
import { Stack } from "@mui/system";
import { useDebounce } from "use-debounce";
import { useFields, useRows, useSettings } from "../../hooks/data.hook";
import { useHoverGet } from "../../hooks/hover.hook";

type Props = {
  datasource: string;
};

const ChartDataRow = ({
  idx = 0,
  field,
  datasource,
}: {
  idx: number;
  field: string;
  datasource: string;
}) => {
  const { rows } = useRows(datasource);
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

export const ChartData = ({ datasource }: Props) => {
  const { fields } = useFields(datasource);
  const active = useHoverGet();
  return (
    <Stack>
      <Divider>Chart Data</Divider>
      <Box mt={1}>
        {fields.map((field) => (
          <ChartDataRow
            idx={active}
            key={field}
            field={field}
            datasource={datasource}
          />
        ))}
      </Box>
    </Stack>
  );
};
