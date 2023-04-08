import { TrashIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  ButtonProps,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/joy";
import { ButtonBase, ButtonBaseProps } from "@mui/material";
import { Stack } from "@mui/system";
import { sentenceCase } from "change-case";
import noop from "lodash.noop";
import { FC, useState } from "react";
import { ICondition } from "../../../types/app.types";
import { ColorSelect } from "../../data/selects/color-select";
import { XJson } from "../../json";
import SignalRowDistanceSelect from "./signal-row-distance-select";
import { SelectDialog } from "../../dialogs/select-dialog";
import OperatorSelectDialog from "./operator-select-dialog";
import SignalListSelectDialog from "./signal-list-select-dialog";
import { Space } from "../../utils/row";

const CondTitle = ({ cond, offset }: { cond?: string; offset?: number }) => {
  const v = cond?.split("----")[0]?.split(":");
  return cond ? (
    <Stack>
      <Space c s={0.5} justifyContent="center">
        <Typography level="body2">{v?.[1]}</Typography>
        {offset && (
          <Box py={0.25} px={1} bgcolor="primary.solidBg" borderRadius={1.5}>
            -{offset}
          </Box>
        )}
      </Space>
      <Typography level="body3">{v?.[0]}</Typography>
    </Stack>
  ) : (
    <Typography>Select</Typography>
  );
};
type Props = {
  condition: ICondition;
  removeCondition?: (cond: ICondition) => void;
  updateCondition?: (cond: ICondition) => void;
  disabled?: boolean;
  isFirst?: boolean;
  matches?: number;
};
export const NewSignalCondition: FC<Props> = ({
  condition,
  removeCondition = noop,
  updateCondition = noop,
  disabled,
  isFirst,
  matches,
}) => {
  const BB: FC<ButtonBaseProps & { fg?: boolean }> = ({
    fg = true,
    ...props
  }) => {
    return (
      <ButtonBase
        {...props}
        onClick={props?.onClick}
        sx={(theme) => ({
          flexGrow: +fg,
          px: 2,
          "&:hover": { bgcolor: theme?.palette?.action?.hover },
          ...(props?.sx as any),
        })}
      />
    );
  };
  const BN: FC<ButtonProps & { k: string }> = ({ k, ...props }) => (
    <Button
      {...props}
      variant={condition?.next === k ? "solid" : "plain"}
      size="sm"
      onClick={() => {
        updateCondition({
          ...condition,
          next: k === condition?.next ? null : k,
        });
      }}
      disabled={disabled}
    >
      {k}
    </Button>
  );
  const [listOpen, setListOpen] = useState(false);
  const [opOpen, setOpOpen] = useState(false);
  const [signalListOpen, setSignalListOpen] = useState<string | null>(null);
  return (
    <Stack
      direction="row"
      justifyContent="stretch"
      spacing={1}
      sx={{
        width: "100%",
      }}
    >
      <ColorSelect
        variant="square"
        value={condition?.color}
        onChange={(v) => updateCondition({ ...condition, color: v })}
      />
      <BB onClick={() => setSignalListOpen("a")}>
        <CondTitle cond={condition?.a?.field} />
      </BB>
      {!isFirst && (
        <>
          <BB
            sx={{ flexGrow: 0, flexShrink: 0 }}
            onClick={() => setListOpen(true)}
            disabled={listOpen}
          >
            {condition?.offset === 0
              ? "Same bar"
              : `Within ${condition?.offset || 0} bars`}
          </BB>
        </>
      )}
      <BB fg={false} onClick={() => setOpOpen(true)}>
        {condition?.operator === "true"
          ? "Triggered"
          : sentenceCase(condition?.operator)}
      </BB>
      {condition?.operator !== "true" && (
        <BB onClick={() => setSignalListOpen("b")}>
          <CondTitle
            cond={condition?.b?.field}
            offset={condition?.a?.field === condition?.b?.field ? 1 : 0}
          />
        </BB>
      )}
      <Box>
        <SignalRowDistanceSelect
          value={condition?.offset ?? 0}
          onChange={(offset: number) =>
            updateCondition({ ...condition, offset })
          }
          open={listOpen}
          setOpen={setListOpen}
          matches={matches}
        />
      </Box>
      {/* <BN k="AND" />
      <BN k="OR" /> */}
      <IconButton
        size="sm"
        color="danger"
        onClick={removeCondition}
        sx={{ flexGrow: 0, flexShrink: 0 }}
      >
        <TrashIcon width={16} />
      </IconButton>
      <OperatorSelectDialog
        open={opOpen}
        onClose={() => setOpOpen(false)}
        onSelect={(operator) => {
          updateCondition({ ...condition, operator });
          setOpOpen(false);
        }}
      />
      <SignalListSelectDialog
        open={!!signalListOpen}
        onClose={() => setSignalListOpen(null)}
        onChange={(f, c) =>
          signalListOpen &&
          updateCondition({ ...condition, [signalListOpen]: c })
        }
      />
    </Stack>
  );
};
