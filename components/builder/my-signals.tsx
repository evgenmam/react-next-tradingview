import { PlusIcon } from "@heroicons/react/24/solid";
import { FolderArrowDownIcon } from "@heroicons/react/24/outline";
import { Grid, IconButton, Stack, Typography } from "@mui/joy";
import { Collapse } from "@mui/material";
import { useState } from "react";
import { useSignals } from "../../hooks/data.hook";
import { XJson } from "../json";
import { MySignalRow } from "./signals/my-signal-row";
import { NewSignal } from "./signals/new-signal";
import ExportDialog from "../dialogs/export-dialog";

export const MySignals = () => {
  const [adding, setAdding] = useState(false);
  const { addSignal, signals, removeSignal } = useSignals();
  const [openExport, setOpenExport] = useState(false);
  return (
    <Stack>
      <Stack p={1} alignItems="center" spacing={1} direction="row">
        <Typography>My Signals</Typography>
        <IconButton onClick={() => setAdding(true)} size="sm">
          <PlusIcon width={20} />
        </IconButton>
        <IconButton onClick={() => setOpenExport(true)} size="sm">
          <FolderArrowDownIcon width={20} />
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
              <MySignalRow
                signal={signal}
                onDelete={removeSignal}
                draggable
                showName
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
      <ExportDialog
        type="signals"
        open={openExport}
        onClose={() => setOpenExport(false)}
      />
    </Stack>
  );
};
