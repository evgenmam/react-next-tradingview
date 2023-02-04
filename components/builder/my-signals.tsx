import { PlusIcon } from "@heroicons/react/24/solid";
import { Grid, IconButton, Stack, Typography } from "@mui/joy";
import { Collapse } from "@mui/material";
import { useState } from "react";
import { useSignals } from "../../hooks/data.hook";
import { XJson } from "../json";
import { MySignalRow } from "./signals/my-signal-row";
import { NewSignal } from "./signals/new-signal";

export const MySignals = () => {
  const [adding, setAdding] = useState(false);
  const { addSignal, signals, removeSignal } = useSignals();

  return (
    <Stack>
      <Stack p={1} alignItems="center" spacing={1} direction="row">
        <Typography>My Signals</Typography>
        <IconButton onClick={() => setAdding(true)} size="sm">
          <PlusIcon width={20} />
        </IconButton>
      </Stack>
      <Stack spacing={1}>
        <Collapse in={adding}>
          {adding && (
            <NewSignal
              onCancel={() => setAdding(false)}
              onSave={(signal) => {
                addSignal(signal);
                setAdding(false);
              }}
            />
          )}
        </Collapse>
        <Grid container spacing={1} p={0}>
          {signals.map((signal) => (
            <Grid key={signal.id} flexGrow={1}>
              <MySignalRow signal={signal} onDelete={removeSignal} draggable />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};
