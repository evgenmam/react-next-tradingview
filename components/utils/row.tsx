import { Stack, StackProps } from "@mui/joy";
import { FC, forwardRef } from "react";

type Props = {
  c?: boolean;
  sb?: boolean;
  g?: StackProps["gap"];
  sa?: boolean;
  wrap?: boolean;
  s?: StackProps["spacing"];
};

// eslint-disable-next-line react/display-name
export const Space: FC<Partial<StackProps> & Props> = forwardRef(
  ({ c, sb, sa, s, g, wrap, ...props }, ref) => (
    <Stack
      ref={ref}
      direction="row"
      {...(sb ? { justifyContent: "space-between" } : {})}
      {...(sa ? { justifyContent: "space-around" } : {})}
      {...(wrap ? { flexWrap: "wrap" } : {})}
      {...(c ? { alignItems: "center" } : {})}
      {...(g ? { gap: g } : {})}
      {...(s ? { spacing: s } : {})}
      {...props}
    />
  )
);
