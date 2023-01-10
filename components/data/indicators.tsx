import { Divider } from "@mui/joy";
import { Stack } from "@mui/system";
import { useIndicators } from "../../hooks/data.hook";
import { IndicatorTable } from "./indicator-table";
import { NewIndicator } from "./indicators/new-indicator";

export const Indicators = () => {
  const { indicators } = useIndicators();
  return (
    <Stack spacing={1}>
      <Divider>Indicators</Divider>
      <Stack divider={<Divider />} spacing={1}>
        {indicators.map((indicator) => (
          <IndicatorTable key={indicator.name} indicator={indicator} />
        ))}
        <NewIndicator />
      </Stack>
    </Stack>
  );
};
