import { Typography } from "@mui/joy";
import { useIndicators } from "../../hooks/data.hook";

type Props = {
  field: string;
  value: number;
  prev: number;
};

export const DisplayDataRow = ({ field, value, prev }: Props) => {
  const { indicators } = useIndicators();
  return (
    <tr key={field}>
      <td>
        <Typography fontSize={12} textTransform="capitalize">
          {field}
        </Typography>
      </td>
      <td>
        <Typography
          fontSize={12}
          textAlign="right"
          color={prev < value ? "danger" : "success"}
        >
          {value || "-"}
        </Typography>
      </td>
    </tr>
  );
};
