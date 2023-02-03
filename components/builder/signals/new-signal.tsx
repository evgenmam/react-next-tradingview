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
import { useCallback, useState } from "react";
import { ICondition, IConditionEntry } from "../../../types/app.types";
import { useChartEvents } from "../context/events.context";
import * as R from "ramda";
import { NewSignalConditionSelect } from "./new-signal-condition-select";
import { NewSignalCondition } from "./new-signal-condition";
import noop from "lodash.noop";
type Props = {
  onSave?: (conditions: ICondition[]) => void;
  onCancel?: () => void;
};
export const NewSignal = ({ onSave = noop, onCancel = noop }: Props) => {
  const { events, selecting, setSelecting } = useChartEvents();
  const [points, setPoints] = useState<Highcharts.Point[]>([]);
  const [a, setA] = useState<IConditionEntry | null>(null);
  const [b, setB] = useState<IConditionEntry | null>(null);
  const [operator, setOperator] = useState<ICondition["operator"] | null>(null);
  const [conditions, setConditions] = useState<ICondition[]>([]);
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
            <Typography>New Signal</Typography>
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
              key={c.a + c.operator + c.b}
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
                onSave(conditions);
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
