import { Divider, Stack, Typography } from "@mui/joy";
import { Box } from "@mui/system";
import { V2ChartListSelect } from "./chart-list-select";
import { V2ChartSymbolList } from "./chart-symbol-list";
import { useV2List } from "./hooks/v2-data.hook";
import { IChartConfig } from "./v2.types";

type Props = {
  config: IChartConfig;
};

export const V2ChartConfig = ({ config }: Props) => {
  return (
    <Stack flexGrow={1} divider={<Divider />}>
      <Stack
        py={1}
        px={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography>{config.name}</Typography>
        <V2ChartListSelect config={config} />
      </Stack>
      <V2ChartSymbolList config={config} />
    </Stack>
  );
};
