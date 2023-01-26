import { Box, BoxProps } from "@mui/system";

export const CBox = ({ ...props }: BoxProps) => (
  <Box
    width="100%"
    height="100%"
    display="flex"
    justifyContent="center"
    alignItems="center"
    {...props}
  ></Box>
);
