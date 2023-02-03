import {
  Avatar,
  Checkbox,
  Divider,
  IconButton,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { Box } from "@mui/system";
import { useState } from "react";
import { V2ChartConfig } from "../v2/chart-config";
import { useV2ChartConfigs } from "../v2/hooks/v2-data.hook";

import { Button, ButtonProps } from "@mui/joy";
import { V2ChartPresets } from "./chart-presets";
import { useV2MarketData } from "./hooks/v2-market-data.hook";
import { V2PeriodSelect } from "./period-select";
import { Drawer } from "@mui/material";
import { useSettings } from "../../hooks/data.hook";
import { TVChartTypeSelect } from "../tv-components/helpers/chart-type-select";
import { V2BarCountInput } from "./bar-count-input";
type Props = {} & ButtonProps;

const getLogo = (path: string) =>
  `https://s3-symbol-logo.tradingview.com/${path}.svg`;

export const ChartConfigButton = ({ onClick }: Props) => {
  const { configs } = useV2ChartConfigs();
  const { period } = useSettings();
  return (
    <Button onClick={onClick} variant="soft" size="lg" sx={{ px: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {configs.map((c) => (
          <Avatar size="sm" key={c.name} src={getLogo(c.symbol?.logoid)}>
            {c.symbol?.symbol?.[0]}
          </Avatar>
        ))}
        <Typography level="h5">{period}</Typography>
      </Stack>
    </Button>
  );
};

export const ChartConfigDrawer = () => {
  const [open, setOpen] = useState(false);
  const { configs } = useV2ChartConfigs();
  const { polling, setPolling } = useV2MarketData(open);
  return (
    <Box>
      <Box position="absolute" right={0} top={0}>
        <Sheet variant="outlined">
          <Box p={1}>
            <ChartConfigButton onClick={() => setOpen(true)} />
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
          <Stack divider={<Divider />} width={400} maxWidth="100vw" spacing={1}>
            <Stack
              px={2}
              pt={2}
              pb={1}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography level="h6">Symbols</Typography>
              <Stack direction="row" spacing={1}>
                <TVChartTypeSelect />
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <V2PeriodSelect />
              <V2BarCountInput />
              <Checkbox
                size="sm"
                label="Polling"
                checked={polling}
                onChange={() => setPolling((v) => !v)}
              />
            </Stack>
            {configs.map((c) => (
              <V2ChartConfig key={c.name} config={c} />
            ))}
            <V2ChartPresets />
          </Stack>
        </Sheet>
      </Drawer>
    </Box>
  );
};
