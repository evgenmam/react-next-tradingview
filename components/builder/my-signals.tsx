import { PlusIcon } from "@heroicons/react/24/solid";
import { Grid, IconButton, Stack, Typography } from "@mui/joy";
import { Collapse } from "@mui/material";
import { useState } from "react";
import { useChartEvents } from "./hooks/chart-events.config";
import { NewSignal } from "./signals/new-signal";

export const MySignals = () => {
  const [adding, setAdding] = useState(false);
  return (
    <Grid xs={12} sm={6}>
      <Stack p={1} alignItems="center" spacing={1} direction="row">
        <Typography>My Signals</Typography>
        <IconButton onClick={() => setAdding(true)} size="sm">
          <PlusIcon width={20} />
        </IconButton>
      </Stack>
      <Collapse in={adding}>
        <NewSignal />
      </Collapse>
    </Grid>
  );
};
