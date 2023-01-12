import { useRows, useStrategies } from "../../../hooks/data.hook";
import * as R from "ramda";
import { applyStrategy } from "../../../utils/calculations";
import { IconButton, Stack, Tooltip, Typography } from "@mui/joy";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { generateScript } from "../../../utils/pinescript.utis";
import copy from "copy-to-clipboard";
import { useState } from "react";

export const PinescriptButton = () => {
  const { strategies } = useStrategies();
  const { rows } = useRows("source");
  const [copied, setCopied] = useState(false);
  const gs = () => {
    const s = R.pipe(R.map(applyStrategy(rows)), generateScript)(strategies);
    copy(s);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Tooltip
        title={copied ? "Copied!" : "Generate PineScript and copy to clipboard"}
        placement="left"
      >
        <IconButton size="sm" onClick={gs}>
          <ClipboardIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
