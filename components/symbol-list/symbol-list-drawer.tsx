import { Divider, Sheet } from "@mui/joy";
import { Drawer, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { V2ChartConfig } from "../v2/chart-config";
import { useV2ChartConfigs } from "../v2/hooks/v2-data.hook";
import { SymbolList } from "./symbol-list";
import { SymbolListButton } from "./symbol-list-button";

export const SymbolListDrawer = () => {
  const [open, setOpen] = useState(false);
  const { configs } = useV2ChartConfigs();
  return (
    <Box>
      <Box position="absolute" right={0} top={0}>
        <Sheet variant="outlined">
          <Box p={1}>
            <SymbolListButton onClick={() => setOpen(true)} />
          </Box>
        </Sheet>
      </Box>
      <Drawer
        open={open}
        anchor="right"
        onClose={() => {
          setOpen(false);
        }}
      >
        <Sheet sx={{ height: "100%" }}>
          <Stack divider={<Divider />} width={400} maxWidth="100vw">
            {configs.map((c) => (
              <V2ChartConfig key={c.name} config={c} />
            ))}
          </Stack>
        </Sheet>
      </Drawer>
    </Box>
  );
};
