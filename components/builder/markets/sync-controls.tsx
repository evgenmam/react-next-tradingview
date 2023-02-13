import { Checkbox } from "@mui/joy";
import { useSettings } from "../../../hooks/settings.hook";
import { Space } from "../../utils/row";

export const SyncControls = () => {
  const { syncLine, setSyncLine, syncRange, setSyncRange } = useSettings();
  return (
    <Space s={1}>
      <Checkbox
        label="Sync Crosshair"
        variant="solid"
        checked={!!syncLine}
        onChange={(v) => setSyncLine(!syncLine)}
      />
      <Checkbox
        label="Sync Time"
        variant="solid"
        checked={!!syncRange}
        onChange={(v) => setSyncRange(!syncRange)}
      />
    </Space>
  );
};

