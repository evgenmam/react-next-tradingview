import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  RadioGroup,
  Radio,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { IStrategy } from "../../../types/app.types";
import { NewCondition } from "./new-condition";
import * as R from "ramda";
import { LockClosedIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { v4 } from "uuid";
import { ColorSelect } from "../../data/selects/color-select";
import { SignalSelect } from "../../data/selects/signal-select";
import { DirectionSelect } from "../../data/selects/direction-select";
import { useSettings } from "../../../hooks/data.hook";

type Props = {
  onSave: (strategy: IStrategy, color?: string) => void;
};

const newStrategy: IStrategy = {
  direction: "long",
  entry: 1,
  color: ColorSelect.random(),
  dataset: "target",
};

export const NewStrategy = ({ onSave }: Props) => {
  const [strategy, setStrategy] = useState<IStrategy>(newStrategy);
  useEffect(() => {
    setStrategy(newStrategy);
  }, []);

  const [open, setOpen] = useState(false);
  return (
    <Stack mt={1}>
      {open ? (
        <Sheet variant="outlined">
          <Stack spacing={1} p={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>New Strategy</Typography>

              <IconButton
                size="sm"
                variant="plain"
                color="neutral"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <XMarkIcon />
              </IconButton>
            </Stack>
            <Grid container spacing={1}>
              <Grid xs={12} sm={12}>
                <SignalSelect
                  label="Open signal"
                  value={strategy.openSignal || null}
                  onChange={(_, e) => {
                    setStrategy(R.assoc("openSignal", e!));
                  }}
                />
              </Grid>
              <Grid xs={12} sm={12}>
                <SignalSelect
                  label="Close signal"
                  value={strategy.closeSignal}
                  onChange={(_, e) => {
                    setStrategy(R.assoc("closeSignal", e!));
                  }}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <DirectionSelect
                  value={strategy.direction}
                  onChange={(_, e) => {
                    setStrategy(R.assoc("direction", e!));
                  }}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl size="sm">
                  <FormLabel>Count</FormLabel>
                  <Input
                    type="number"
                    value={strategy.entry}
                    onChange={(e) => {
                      setStrategy(R.assoc("entry", +e!));
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl size="sm">
                  <FormLabel>Target Chart</FormLabel>
                  <RadioGroup
                    orientation="horizontal"
                    value={strategy.dataset}
                    onChange={(v) =>
                      setStrategy(R.assoc("dataset", v.target.value))
                    }
                  >
                    <Radio value="target" label="Target 1" />
                    <Radio value="target2" label="Target 2" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                asdf
              </Grid>
            </Grid>
            <Stack direction="row" justifyContent="space-between">
              <ColorSelect
                value={strategy.color}
                onChange={(v) => {
                  setStrategy(R.assoc("color", v!));
                }}
              />
              <Button
                variant="plain"
                onClick={() => {
                  onSave({ ...strategy });
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
