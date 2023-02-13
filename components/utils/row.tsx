import { Stack, StackProps } from "@mui/joy";
import { FC } from "react";

type Props = {
  c?: boolean;
  sb?: boolean;
  g?: StackProps["gap"];
  sa?: boolean;
  wrap?: boolean;
  s?: StackProps["spacing"];
};

export const Space: FC<Partial<StackProps> & Props> = ({
  c,
  sb,
  sa,
  s,
  g,
  wrap,
  ...props
}) => (
  <Stack
    direction="row"
    {...(sb ? { justifyContent: "space-between" } : {})}
    {...(sa ? { justifyContent: "space-around" } : {})}
    {...(wrap ? { flexWrap: "wrap" } : {})}
    {...(c ? { alignItems: "center" } : {})}
    {...(g ? { gap: g } : {})}
    {...(s ? { spacing: s } : {})}
    {...props}
  />
);
