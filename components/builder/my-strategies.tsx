import {
  ArrowDownTrayIcon,
  FolderPlusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Checkbox, IconButton, Stack, Divider, Tooltip } from "@mui/joy";
import { Collapse } from "@mui/material";
import { useState } from "react";
import { useStrategies } from "../../hooks/data.hook";
import { Space } from "../utils/row";
import { MyStrategyRow } from "./strategies/my-strategy-row";
import { NewStrategy } from "./strategies/new-strategy";
import ExportDialog from "../dialogs/export-dialog";
import ImportDialog from "../dialogs/import-dialog";
import SectionHeader from "./secton-header";

type Props = {
  withLink?: boolean;
  selected?: number;
  onSelect?: (id: number) => void;
  useTpLs?: boolean;
};
export const MyStrategies = ({
  withLink,
  useTpLs,
  selected,
  onSelect,
}: Props) => {
  const [openExport, setOpenExport] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [adding, setAdding] = useState(false);
  const { strategies, removeStrategy, addStrategy, reverse, setReverse } =
    useStrategies();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("My Strategies") === "true"
  );

  const open = !collapsed;
  return (
    <Stack mt={1}>
      <Space sb s={1} c>
        <Space s={1} c>
          <SectionHeader
            title="My Strategies"
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
          <Tooltip title="New Strategy">
            <IconButton
              onClick={() => setAdding(true)}
              size="sm"
              variant="plain"
            >
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
        </Space>
        <Checkbox
          variant="solid"
          label="With reverse strategies"
          checked={!!reverse}
          onChange={() => setReverse(!reverse)}
        />
      </Space>
      <Collapse in={open}>
        <Stack spacing={1} mt={1}>
          <Collapse in={adding}>
            {adding && (
              <NewStrategy
                onCancel={() => setAdding(false)}
                onSave={(s) => {
                  addStrategy(s);
                  setAdding(false);
                }}
              />
            )}
          </Collapse>
          {strategies.map((strategy) => (
            <MyStrategyRow
              useTpLs={useTpLs}
              selected={!!selected && strategy.id === +selected}
              withLink={withLink}
              key={strategy.id}
              strategy={strategy}
              onDelete={removeStrategy}
              onSelect={onSelect}
            />
          ))}
        </Stack>
      </Collapse>
      <ExportDialog
        type="strategies"
        open={openExport}
        onClose={() => setOpenExport(false)}
      />
      <ImportDialog open={openImport} onClose={() => setOpenImport(false)} />
    </Stack>
  );
};
