import { TrashIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  ButtonProps,
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

const CondTitle = ({ cond }: { cond?: string }) => {
  const v = cond?.split("----")[0]?.split(":");
  return cond ? (
    <Stack>
      <Typography level="body2">{v?.[1]}</Typography>
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
      <BB sx={{ justifyContent: "flex-start" }}>
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
      <BB fg={false}>
        {condition?.operator === "true"
          ? "Triggered"
          : sentenceCase(condition?.operator)}
      </BB>
      {condition?.operator !== "true" && (
        <BB>
          <CondTitle cond={condition?.b?.field} />
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
      <BN k="AND" />
      <BN k="OR" />
      <IconButton
        size="sm"
        color="danger"
        onClick={removeCondition}
        sx={{ flexGrow: 0, flexShrink: 0 }}
      >
        <TrashIcon width={16} />
      </IconButton>
    </Stack>
  );
};
