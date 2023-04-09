import { PlusSmallIcon } from "@heroicons/react/24/solid";
import {
  Button,
  ButtonProps,
  FormControl,
  FormLabel,
  Checkbox,
  Input,
} from "@mui/joy";
import { Collapse } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useIndicators } from "../../../hooks/data.hook";

const BTN = (props: ButtonProps) => (
  <Button fullWidth size="sm" variant="plain" {...props} />
);
export const NewIndicator = () => {
  const { addIndicator } = useIndicators();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [main, setMain] = useState(false);
  return (
    <>
      <Collapse in={adding}>
        <Stack spacing={1}>
          <FormControl size="sm">
            <FormLabel>Name</FormLabel>
            <Input
              size="sm"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </FormControl>
          <Checkbox
            checked={main}
            onChange={(e) => {
              setMain(e.target.checked);
            }}
            label="Overlay"
          />
          <Stack direction="row" spacing={0.5}>
            <BTN
              onClick={() => {
                setAdding(false);
              }}
              color="neutral"
            >
              Cancel
            </BTN>
            <BTN
              onClick={() => {
                addIndicator({ name, fields: [], main, dataset: "source" });
                setName("");
                setAdding(false);
              }}
            >
              Save
            </BTN>
          </Stack>
        </Stack>
      </Collapse>
      <Collapse in={!adding}>
        <BTN
          onClick={() => {
            setAdding(true);
          }}
          startDecorator={<PlusSmallIcon width={20} />}
        >
          New
        </BTN>
      </Collapse>
    </>
  );
};
