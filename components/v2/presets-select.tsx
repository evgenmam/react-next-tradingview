import { Button, Input, Stack } from "@mui/joy";
import { useState } from "react";
import { SelectDialog } from "../dialogs/select-dialog";
import { useV2Presets } from "./hooks/v2-data.hook";

type Props = {};

export const V2PresetsSelect = () => {
  const { presets, addPreset, selected, setSelected, removePreset } =
    useV2Presets();
  console.log(presets);
  const [newPreset, setNewPreset] = useState("");
  const onNew = async () => {
    setSelected(await addPreset({ name: newPreset, indicators: [] }));
    setNewPreset("");
  };
  return (
    <SelectDialog
      options={presets?.map((v) => v.name)}
      value={selected?.name}
      onChange={(v) => setSelected(presets?.find((p) => p.name === v)?.id || 0)}
      onDelete={(v) => removePreset(presets?.find((p) => p.name === v)?.id!)}
      actions={
        <Stack spacing={1}>
          <Input
            value={newPreset}
            onChange={(e) => setNewPreset(e.target.value)}
            placeholder="Create new list"
          />
          <Button variant="plain" onClick={onNew} disabled={!newPreset}>
            Save
          </Button>
        </Stack>
      }
    />
  );
};
