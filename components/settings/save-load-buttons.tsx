import { Button } from "@mui/material";
import { Stack } from "@mui/system";
import { useRef } from "react";
import { useRows } from "../../hooks/data.hook";

export const SaveLoadButtons = () => {
  const { dataset } = useRows("source");
  const onClick = () => {
    const b = new Blob([JSON.stringify({})], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = `${dataset}-${new Date().toISOString()}-export.json`;
    a.click();
  };
  const ref = useRef<HTMLInputElement>(null);
  const onLoad = () => {
    ref?.current?.click();
  };
  return (
    <Stack>
      <Button onClick={onClick}>Save</Button>
      <Button onClick={onLoad}>Load</Button>
      <input type="file" ref={ref} style={{ display: "none" }} />
    </Stack>
  );
};
