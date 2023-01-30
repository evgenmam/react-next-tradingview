import { Box, Divider, List, Typography } from "@mui/joy";
import { Stack } from "@mui/system";
import { TVScriptsDialog } from "../tv-components/dialogs/scripts-dialog";
import { TVIndicatorSearch } from "../tv-components/indicator-search";
import { useV2Presets } from "./hooks/v2-data.hook";
import { V2PresetIndicatorListItem } from "./preset-indicator-list-item";
import { V2PresetsSelect } from "./presets-select";

type Props = {};
export const V2ChartPresets = ({}: Props) => {
  const { addIndicator, selected, removeIndicator } = useV2Presets();
  return (
    <Stack flexGrow={1} divider={<Divider />}>
      <Stack
        py={1}
        px={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography>Presets</Typography>
        <V2PresetsSelect />
      </Stack>
      <Stack p={1} direction="row" justifyContent="space-between">
        <TVIndicatorSearch onSelect={addIndicator} />
        <TVScriptsDialog onSelect={addIndicator} />
      </Stack>
      <List>
        {selected?.indicators?.map((i) => (
          <V2PresetIndicatorListItem
            key={i.scriptIdPart}
            indicator={i}
            onRemove={removeIndicator}
          />
        ))}
      </List>
    </Stack>
  );
};
