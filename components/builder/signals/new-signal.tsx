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
  Input,
} from "@mui/joy";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ICondition, IConditionEntry, ISignal } from "../../../types/app.types";
import { useChartEvents } from "../context/events.context";
import * as R from "ramda";
import { NewSignalConditionSelect } from "./new-signal-condition-select";
import { NewSignalCondition } from "./new-signal-condition";
import noop from "lodash.noop";
import { Space } from "../../utils/row";
import { ColorSelect } from "../../data/selects/color-select";
import IndicatorValueSelect from "./indicator-value-select";
import { applySignal } from "../../../utils/calculations";
import { useRows } from "../../../hooks/data.hook";
type Props = {
  onSave?: (conditions: Omit<ISignal, "id">) => void;
  onCancel?: () => void;
};

export const NewSignal = ({ onSave = noop, onCancel = noop }: Props) => {
  const { events, selecting, setSelecting, setConditions, conditions } =
    useChartEvents();
  useEffect(() => setSelecting(true), [setSelecting]);
  const [points, setPoints] = useState<Highcharts.Point[]>([]);
  const [a, setA] = useState<IConditionEntry | null>(null);
  const [b, setB] = useState<IConditionEntry | null>(null);
  const [operator, setOperator] = useState<ICondition["operator"] | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [color, setColor] = useState<string>(ColorSelect.random());
  const [name, setName] = useState<string>("");
  useEffect(() => {}, []);
  const resetCondition = useCallback(() => {
    setA(null);
    setB(null);
    setOperator(null);
    setPoints([]);
    setOffset(0);
    setSelecting(false);
    setColor(ColorSelect.random());
    setName("");
  }, [setSelecting]);
  const addCondition = useCallback(
    (cond: ICondition) => {
      setConditions(R.append(cond));
      resetCondition();
    },
    [resetCondition, setConditions]
  );

  const enabled = !conditions.length || !!conditions.at(-1)?.next;
  useEffect(() => {
    setSelecting(enabled);
  }, [enabled, setSelecting]);
  events.useSubscription((e) => {
    if (e?.points && selecting) {
      setPoints(e.points);
      setOffset(e.offset || 0);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          setSelecting(false);
        }
      });
    }
  });
  const { rows } = useRows("source");
  const matches = useMemo(
    () =>
      conditions.length ? applySignal(rows)({ condition: conditions }) : null,
    [rows, conditions]
  );

  const tooMany = useMemo(
    () => matches && matches.data?.length > rows?.length / 2,
    [matches, rows]
  );
  const noMatches = useMemo(
    () => matches && matches.data?.length === 0,
    [matches]
  );
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
            <Input
              size="sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Signal name"
            />
          </Stack>
          {tooMany ? (
            <Alert color="danger">Bad Signal: Too many matches</Alert>
          ) : !!matches?.data?.length ? (
            <Alert color="success">Triggers {matches.data.length} times</Alert>
          ) : noMatches ? (
            <Alert color="warning">Bad Signal: No matching events</Alert>
          ) : (
            selecting && (
              <Alert
                endDecorator={<Button variant="plain">Select from list</Button>}
              >
                Click on the study chart to select a point
              </Alert>
            )
          )}

          <Typography level="body2">Conditions:</Typography>

          {conditions?.map((c, idx) => (
            <NewSignalCondition
              condition={c}
              removeCondition={() => setConditions(R.remove(idx, 1))}
              key={c.a?.field + c.operator + c.b?.field}
              updateCondition={(v) =>
                setConditions(R.over(R.lensIndex(idx), R.mergeLeft(v)))
              }
              isFirst={idx === 0}
              matches={matches?.data?.length || 0}
            />
          ))}
          <Divider />
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button
              size="sm"
              onClick={() => {
                onCancel();
                setConditions([]);
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
                onSave({ condition: conditions, color, name });
                setConditions([]);
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
          conditions,
          offset,
          setOffset,
        }}
      />
    </Card>
  );
};
