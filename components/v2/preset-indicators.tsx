import { List, ListItem } from "@mui/joy";
import { Stack } from "@mui/system";
import { useV2Presets } from "./hooks/v2-data.hook";

type Props = {};

export const V2PresetIndicators = ({}: Props) => {
  const { selected } = useV2Presets();
  return (
    <Stack>
      <List>
        {selected?.indicators.map((i) => (
          <ListItem key={i.scriptIdPart}>{i.scriptName}</ListItem>
        ))}
      </List>
    </Stack>
  );
};
