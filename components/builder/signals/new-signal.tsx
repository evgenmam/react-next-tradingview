import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardContent,
  Stack,
  List,
  Sheet,
  Typography,
  ListItem,
  ListItemButton,
  Alert,
  Modal,
  ModalDialog,
  IconButton,
} from "@mui/joy";
import { useCallback, useState } from "react";
import { ICondition, IConditionEntry } from "../../../types/app.types";
import { useChartEvents } from "../context/events.context";
import { conditionOptions, getIdFromPoint } from "../utils/builder.utils";
import * as R from "ramda";
import { XJson } from "../../json";
import { capitalCase, sentenceCase } from "change-case";

export const NewSignal = () => {
  const [selecting, setSelecting] = useState(false);
  const events = useChartEvents();
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
  }, []);
  const addCondition = useCallback(
    (cond: ICondition) => {
      setConditions(R.append(cond));
      resetCondition();
    },
    [resetCondition]
  );
  events.useSubscription((e) => {
    console.log(e);
    if (e?.points && selecting) {
      setPoints(e.points);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          setSelecting(false);
        }
      });
    }
  });
  console.log(points);
  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography>New Signal</Typography>
          <Typography level="body2">Conditions:</Typography>
          {selecting ? (
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
          ) : (
            <Stack direction="row" spacing={1}>
              <Button size="sm">Add Manually</Button>
              <Button size="sm" onClick={() => setSelecting(true)}>
                Select on chart
              </Button>
            </Stack>
          )}
        </Stack>
        <XJson data={{ a, b, operator }} />
        <XJson data={conditions} />
      </CardContent>
      <Modal
        open={!!points?.length}
        onClose={() => {
          setPoints([]);
        }}
      >
        <ModalDialog>
          <List>
            {a && !operator
              ? conditionOptions?.map((o) => (
                  <ListItem key={o}>
                    <ListItemButton
                      onClick={() => {
                        if (o === "true" && a) {
                          addCondition({ a, operator: o });
                        } else {
                          setOperator(o as ICondition["operator"]);
                          setPoints([]);
                        }
                      }}
                    >
                      {o === "true"
                        ? "Alert Triggered (true)"
                        : sentenceCase(o)}
                    </ListItemButton>
                  </ListItem>
                ))
              : points?.map((p) => (
                  <ListItem key={p.series?.options?.id!}>
                    <ListItemButton
                      onClick={() => {
                        const field = getIdFromPoint(p);
                        const f = {
                          field,
                          type: "field" as const,
                          offset: 0,
                        };
                        if (a && operator) {
                          setB(f);
                          addCondition({ a, b: f, operator });
                        } else {
                          setA(f);
                        }
                      }}
                    >
                      {p.series?.options?.name!}
                    </ListItemButton>
                  </ListItem>
                ))}
          </List>
        </ModalDialog>
      </Modal>
    </Card>
  );
};
