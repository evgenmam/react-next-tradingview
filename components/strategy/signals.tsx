import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Typography } from "@mui/joy";
import { ButtonBase } from "@mui/material";
import { Stack } from "@mui/system";
import { useSettings, useSignals } from "../../hooks/data.hook";
import { SignalRow } from "./signal-row";
import { NewSignal } from "./utils/new-signal";

export const Signals = () => {
  const { signals, addSignal } = useSignals();
  const { source, showSignals, setShowSignals } = useSettings();
  const Icon = showSignals ? EyeIcon : EyeSlashIcon;
  return (
    <Stack>
      <Stack direction={"row"} spacing={2} alignItems="center">
        <Typography fontSize={20}>Signals</Typography>
        <ButtonBase
          onClick={() => {
            setShowSignals(!showSignals);
          }}
        >
          <Icon width={16} />
        </ButtonBase>
      </Stack>

      {signals.map((signal) => (
        <SignalRow key={signal.id} signal={signal} />
      ))}
      <NewSignal
        onSave={(condition, color) => {
          addSignal({ condition, color });
        }}
      />
    </Stack>
  );
};
