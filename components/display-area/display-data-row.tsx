import { Typography } from "@mui/joy";
import { ButtonBase } from "@mui/material";
import noop from "lodash.noop";
import { useIndicators } from "../../hooks/data.hook";

type Props = {
  field: string;
  value: number;
  prev: number;
  onClick?: () => void;
  hidden?: boolean;
};

export const DisplayDataRow = ({
  field,
  value,
  prev,
  onClick = noop,
  hidden,
}: Props) => {
  return (
    <tr key={field}>
      <td>
        <ButtonBase sx={{ mx: -1, px: 1, textAlign: "left" }} onClick={onClick}>
          <Typography
            fontSize={12}
            textTransform="capitalize"
            lineHeight={1}
            color={hidden ? "neutral" : undefined}
          >
            {field}
          </Typography>
        </ButtonBase>
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
