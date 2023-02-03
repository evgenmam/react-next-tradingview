import { Box, Input, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { useSettings } from "../../hooks/settings.hook";

export const V2BarCountInput = () => {
  const { count, setCount } = useSettings();
  const [value, setValue] = useState(count || 0);
  useEffect(() => {
    setValue(count);
  }, [count]);
  return (
    <Box flexShrink={0}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setCount(value)}
        sx={{ width: 100 }}
        endDecorator={<Typography level="body2">Bars</Typography>}
      />
    </Box>
  );
};
