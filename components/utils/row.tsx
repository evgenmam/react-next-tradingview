import { Stack, StackProps } from "@mui/joy";
import { FC, ReactNode } from "react";

type Props = {
  c?: boolean;
  sb?: boolean;
};

export const Space: FC<Partial<StackProps> & Props> = ({ c, sb, ...props }) => (
  <Stack
    direction="row"
    {...(sb ? { justifyContent: "space-between" } : {})}
    {...(c ? { alignItems: "center" } : {})}
    {...props}
  />
);
