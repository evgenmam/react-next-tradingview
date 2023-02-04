import { Stack, StackProps } from "@mui/joy";
import { FC, ReactNode } from "react";

type Props = {
  c?: boolean;
  sb?: boolean;
  s?: StackProps["spacing"];
};

export const Space: FC<Partial<StackProps> & Props> = ({
  c,
  sb,
  s,
  ...props
}) => (
  <Stack
    direction="row"
    {...(sb ? { justifyContent: "space-between" } : {})}
    {...(c ? { alignItems: "center" } : {})}
    {...(s ? { spacing: s } : {})}
    {...props}
  />
);
