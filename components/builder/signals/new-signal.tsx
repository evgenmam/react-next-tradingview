import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Alert,
  IconButton,
  Divider,
} from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import { ICondition, IConditionEntry, ISignal } from "../../../types/app.types";
import { useChartEvents } from "../context/events.context";
import * as R from "ramda";
import { NewSignalConditionSelect } from "./new-signal-condition-select";
import { NewSignalCondition } from "./new-signal-condition";
import noop from "lodash.noop";
import { Space } from "../../utils/row";
import { ColorSelect } from "../../data/selects/color-select";
type Props = {
  onSave?: (conditions: Omit<ISignal, "id">) => void;
  onCancel?: () => void;
};
export const NewSignal = ({ onSave = noop, onCancel = noop }: Props) => {
  const { events, selecting, setSelecting } = useChartEvents();
  const [points, setPoints] = useState<Highcharts.Point[]>([]);
  const [a, setA] = useState<IConditionEntry | null>(null);
  const [b, setB] = useState<IConditionEntry | null>(null);
  const [operator, setOperator] = useState<ICondition["operator"] | null>(null);
  const [conditions, setConditions] = useState<ICondition[]>([]);
  const [color, setColor] = useState<string>(ColorSelect.random());
  useEffect(() => {}, []);
  const resetCondition = useCallback(() => {
    setA(null);
    setB(null);
    setOperator(null);
    setPoints([]);
    setSelecting(false);
  }, [setSelecting]);
  const addCondition = useCallback(
    (cond: ICondition) => {
      setConditions(R.append(cond));
      resetCondition();
    },
    [resetCondition]
  );
  const enabled = !conditions.length || !!conditions.at(-1)?.next;
  events.useSubscription((e) => {
    if (e?.points && selecting) {
      setPoints(e.points);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          setSelecting(false);
        }
      });
    }
  });
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
              <Typography>New Signal</Typography>
              <ColorSelect value={color} variant="square" onChange={setColor} />
            </Space>
            <Button
              size="sm"
              onClick={() => setSelecting(true)}
              disabled={!enabled}
            >
              Select on chart
            </Button>
          </Stack>
          <Typography level="body2">Conditions:</Typography>
          {selecting && (
            <Alert
              endDecorator={
                <IconButton
                  variant="soft"
                  size="sm"
                  onClick={() => setSelecting(false)}
                >
                  <XMarkIcon />
                </IconButton>
              }
            >
              Click on the study chart to select a point
            </Alert>
          )}
          {conditions?.map((c, idx) => (
            <NewSignalCondition
              condition={c}
              removeCondition={() => setConditions(R.remove(idx, 1))}
              key={c.a?.field + c.operator + c.b?.field}
              updateCondition={(v) =>
                setConditions(R.over(R.lensIndex(idx), R.mergeLeft(v)))
              }
            />
          ))}
          <Divider />
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button
              size="sm"
              onClick={() => {
                onCancel();
                resetCondition();
              }}
              color="neutral"
              variant="plain"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!conditions.length}
              onClick={() => {
                onSave({ condition: conditions, color });
                resetCondition();
              }}
              variant="plain"
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </CardContent>

      <NewSignalConditionSelect
        {...{
          a,
          b,
          setA,
          setB,
          addCondition,
          operator,
          points,
          setOperator,
          setPoints,
        }}
      />
    </Card>
  );
};
