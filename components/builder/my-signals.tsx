import { PlusIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { Grid, IconButton, Stack, Tooltip } from "@mui/joy";
import { Collapse } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSignals } from "../../hooks/data.hook";
import { XJson } from "../json";
import { MySignalRow } from "./signals/my-signal-row";
import { NewSignal } from "./signals/new-signal";
import ExportDialog from "../dialogs/export-dialog";
import ImportDialog from "../dialogs/import-dialog";
import SectionHeader from "./secton-header";

export const MySignals = () => {
  const [adding, setAdding] = useState(false);
  const { addSignal, signals, removeSignal } = useSignals();
  const [openExport, setOpenExport] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("My Signals") === "true"
  );
  useEffect(() => {
    if (adding) {
      localStorage.setItem("My Signals", "false");
      setCollapsed(false);
    }
  }, [adding]);
  return (
    <Stack>
      <Stack py={1} alignItems="center" spacing={1} direction="row">
        <SectionHeader
          title="My Signals"
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <IconButton onClick={() => setAdding(true)} size="sm">
          <PlusIcon width={20} />
        </IconButton>
        <Tooltip title="Import data">
          <IconButton onClick={() => setOpenImport(true)} size="sm">
            <FolderPlusIcon width={20} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Export signals">
          <IconButton onClick={() => setOpenExport(true)} size="sm">
            <ArrowDownTrayIcon width={20} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Collapse in={!collapsed}>
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
      </Collapse>
      <ExportDialog
        type="signals"
        open={openExport}
        onClose={() => setOpenExport(false)}
      />
      <ImportDialog open={openImport} onClose={() => setOpenImport(false)} />
    </Stack>
  );
};
