import {
  Button,
  Divider,
  IconButton,
  Link,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { Box } from "@mui/system";
import { useState } from "react";
import { ICondition, IConditionEntry } from "../../../types/app.types";
import { NewCondition } from "./new-condition";
import * as R from "ramda";
import { LockClosedIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { v4 } from "uuid";
import { ColorSelect } from "../../data/selects/color-select";

type Props = {
  onSave: (conditions: ICondition[], color?: string) => void;
};
const newCondition = (): ICondition & { key?: string } => ({
  a: { field: "open", type: "field", offset: 0 },
  operator: "crossesUp",
  b: { field: "close", type: "field", offset: 0 },
  key: v4(),
});

export const NewSignal = ({ onSave }: Props) => {
  const [conditions, setConditions] = useState<
    (ICondition & { key?: string })[]
  >([newCondition()]);
  const [color, setColor] = useState(ColorSelect.random());
  const [open, setOpen] = useState(false);
  return (
    <Stack mt={1}>
      {open ? (
        <Sheet variant="outlined">
          <Stack spacing={1} p={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>New Signal</Typography>
              <IconButton
                size="sm"
                variant="plain"
                color="neutral"
                onClick={() => {
                  setConditions([newCondition()]);
                  setOpen(false);
                }}
              >
                <XMarkIcon />
              </IconButton>
            </Stack>
            <Stack spacing={1} divider={<Divider>and</Divider>}>
              {conditions.map((c, i) => (
                <NewCondition
                  value={c}
                  setCondition={(v) => {
                    setConditions(R.update(i, v));
                  }}
                  key={c.key}
                />
              ))}
            </Stack>
            <Stack spacing={2} px={2} direction="row">
              <Link
                onClick={() => setConditions([...conditions, newCondition()])}
              >
                Add condition
              </Link>
              {conditions.length > 1 && (
                <Link color="danger" onClick={() => setConditions(R.tail)}>
                  Remove
                </Link>
              )}
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <ColorSelect value={color} onChange={setColor} />
              <Button
                variant="plain"
                onClick={() => {
                  onSave(conditions, color);
                  setOpen(false);
                }}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        </Sheet>
      ) : (
        <>
          <Button
            variant="plain"
            size="sm"
            onClick={() => {
              setOpen(true);
            }}
            startDecorator={<PlusIcon width={16} />}
          >
            New
          </Button>
        </>
      )}
    </Stack>
  );
};
