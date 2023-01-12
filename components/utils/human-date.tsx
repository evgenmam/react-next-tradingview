import { Typography, TypographyProps } from "@mui/joy";
import { format } from "date-fns";
type Props = {
  time?: number;
  f?: string;
} & TypographyProps;
export const HumanDate = ({ time, f = "MM/d/yy", ...props }: Props) => {
  return (
    <Typography {...props}>{time ? format(new Date(time), f) : "-"}</Typography>
  );
};
