import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/joy";
import noop from "lodash.noop";
import { useState } from "react";
import { useSettings } from "../../../hooks/settings.hook";
import { ISignal, IStrategy } from "../../../types/app.types";
import { ColorSelect } from "../../data/selects/color-select";
import { Space } from "../../utils/row";
import { SignalSelect } from "../signals/signal-select";
type Props = {
  onCancel?: () => void;
  onSave?: (conditions: IStrategy) => void;
};
export const NewStrategy = ({ onCancel = noop, onSave }: Props) => {
  const [color, setColor] = useState<string>(ColorSelect.random());
  const [openSignal, setOpenSignal] = useState<ISignal>();
  const [closeSignal, setCloseSignal] = useState<ISignal>();
  const [entry, setEntry] = useState(1);
  const [direction, setDirection] = useState<"long" | "short">("long");
  const { target, target2 } = useSettings();
  const [dataset, setDataset] = useState<"target" | "target2">("target");
  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="top"
          >
            <Space c s={1}>
              <Typography>New Strategy</Typography>
              <ColorSelect value={color} variant="square" onChange={setColor} />
            </Space>
          </Stack>

          <Stack py={1} spacing={2}>
            <SignalSelect
              title="Open"
              value={openSignal}
              onSelect={setOpenSignal}
            />
            <SignalSelect
              title="Close"
              value={closeSignal}
              onSelect={setCloseSignal}
            />
          </Stack>
          <Space pb={1} gap={2} c flexWrap="wrap" >
            <RadioGroup
              defaultValue="long"
              value={direction}
              size="sm"
              onChange={(v) => setDirection(v.target.value as "long" | "short")}
            >
              <Space s={1}>
                <Radio value="long" label="Long" />
                <Radio value="short" label="Short" />
              </Space>
            </RadioGroup>
            <Divider orientation="vertical" />
            <Space c s={1} >
              <Typography level="body2">Count:</Typography>
              <Input
                sx={{ width: 60 }}
                size="sm"
                value={entry}
                onChange={(e) => {
                  setEntry(+e.target.value);
                }}
                inputMode="numeric"
                type="number"
                slotProps={{
                  input: {
                    min: "0",
                  },
                }}
              />
            </Space>
            <Divider orientation="vertical" />
            <RadioGroup
              defaultValue="target"
              value={dataset}
              size="sm"
              onChange={(v) =>
                setDataset(v.target.value as "target" | "target2")
              }
            >
              <Space s={1}>
                <Radio value="target" label={target} />
                <Radio value="target2" label={target2} />
              </Space>
            </RadioGroup>
          </Space>
          <Divider />
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button
              size="sm"
              onClick={() => onCancel()}
              color="neutral"
              variant="plain"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              // disabled={!conditions.length}
              onClick={() => {
                onSave?.({
                  direction,
                  closeSignal,
                  openSignal,
                  color,
                  dataset,
                  entry,
                });
              }}
              variant="plain"
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
