import { TrashIcon } from "@heroicons/react/24/solid";
import {
  Button,
  ButtonProps,
  IconButton,
  List,
  ListItem,
  ListItemButton,
} from "@mui/joy";
import { ButtonBase, ButtonBaseProps } from "@mui/material";
import { Stack } from "@mui/system";
import noop from "lodash.noop";
import { FC } from "react";
import { ICondition } from "../../../types/app.types";
import { XJson } from "../../json";

type Props = {
  condition: ICondition;
  removeCondition?: (cond: ICondition) => void;
  updateCondition?: (cond: ICondition) => void;
  disabled?: boolean;
};
export const NewSignalCondition: FC<Props> = ({
  condition,
  removeCondition = noop,
  updateCondition = noop,
  disabled,
}) => {
  const BB: FC<ButtonBaseProps & { fg?: boolean }> = ({
    fg = true,
    ...props
  }) => (
    <ButtonBase
      {...props}
      sx={(theme) => ({
        flexGrow: +fg,
        px: 2,
        "&:hover": { bgcolor: theme?.palette?.action?.hover },
      })}
    />
  );
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
  return (
    <Stack
      direction="row"
      justifyContent="stretch"
      spacing={1}
      sx={{
        width: "100%",
      }}
    >
      <BB>{condition?.a?.field}</BB>
      <BB fg={false}>
        {condition?.operator === "true" ? "Triggered" : condition?.operator}
      </BB>
      {condition?.operator !== "true" && <BB>{condition?.b?.field}</BB>}
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
