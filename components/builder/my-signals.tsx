import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Divider, Grid, IconButton, Stack, Tooltip } from "@mui/joy";
import { Collapse } from "@mui/material";
import { useEffect, useState } from "react";
import { useSignals } from "../../hooks/data.hook";
import { ISignal } from "../../types/app.types";
import ExportDialog from "../dialogs/export-dialog";
import ImportDialog from "../dialogs/import-dialog";
import SectionHeader from "./secton-header";
import { MySignalRow } from "./signals/my-signal-row";
import { NewSignal } from "./signals/new-signal";
import { useSignalsContext } from "./context/signals.context";
import noop from "lodash.noop";
import * as R from "ramda";
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
  const { setSelected } = useSignalsContext();

  return (
    <Stack>
      <Stack py={1} alignItems="center" spacing={1} direction="row">
        <SectionHeader
          title="My Signals"
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <Tooltip title="New Signal">
          <IconButton onClick={() => setAdding(true)} size="sm" variant="plain">
            <PlusIcon width={20} />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" />
        <Tooltip title="Import data">
          <IconButton
            onClick={() => setOpenImport(true)}
            size="sm"
            variant="plain"
          >
            <FolderPlusIcon width={20} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Export signals">
          <IconButton
            onClick={() => setOpenExport(true)}
            size="sm"
            variant="plain"
          >
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
                  editable
                  signal={signal}
                  onDelete={removeSignal}
                  draggable
                  showName
                  onLink={noop}
                  withView
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
