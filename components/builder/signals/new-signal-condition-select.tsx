import { StopIcon } from "@heroicons/react/24/solid";
import {
  Input,
  Link,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  Modal,
  ModalDialog,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { Collapse, ListItemSecondaryAction } from "@mui/material";
import { capitalCase, sentenceCase } from "change-case";
import { useEffect, useMemo, useState } from "react";
import { useRows } from "../../../hooks/data.hook";
import { ICondition, IConditionEntry } from "../../../types/app.types";
import { applySignal } from "../../../utils/calculations";
import { conditionOptions, getIdFromPoint } from "../utils/builder.utils";
import * as R from "ramda";
import { ColorSelect } from "../../data/selects/color-select";
import { Space } from "../../utils/row";
type Props = {
  points: Highcharts.Point[];
  setPoints: (points: Highcharts.Point[]) => void;
  addCondition: (cond: ICondition) => void;
  setOperator: (operator: ICondition["operator"] | null) => void;
  setA: (a: IConditionEntry | null) => void;
  setB: (b: IConditionEntry | null) => void;
  a: IConditionEntry | null;
  b: IConditionEntry | null;
  operator: ICondition["operator"] | null;
  conditions: ICondition[];
  offset?: number;
  setOffset?: (offset: number) => void;
  opened?: boolean;
};
export const NewSignalConditionSelect = ({
  points,
  setPoints,
  a,
  b,
  offset,
  operator,
  addCondition,
  setOperator,
  setA,
  setB,
  conditions,
  setOffset,
  opened,
}: Props) => {
  const [expand, setExpand] = useState(false);
  const { rows } = useRows("source");
  const { palette } = useTheme();
  const [value, setValue] = useState<number>(0);
  const times = useMemo(
    () =>
      points
        ?.map((p) => {
          const f = {
            field: getIdFromPoint(p),
            type: "field" as const,
          };
          if (operator)
            return applySignal(rows)({
              condition: [
                ...conditions,
                {
                  a: R.or(a, f),
                  b: f,
                  operator,
                },
              ],
            });

          if ((p?.options as { isSignal: boolean }).isSignal) {
            return applySignal(rows)({
              condition: [...conditions, { a: f, operator: "true" }],
            });
          }
        })
        .map((v) => v?.data?.length || 0),
    [points, rows, a, operator, conditions]
  );
  const add = (c: ICondition) =>
    addCondition({ ...c, color: ColorSelect.random(), offset });
  useEffect(() => {
    const val = points.find((v) => getIdFromPoint(v) === a?.field)?.y;
    if (val) setValue(Math.round(val));
  }, [a, points]);
  return (
    <Modal
      open={!!opened}
      onClose={() => {
        setA(null);
        setPoints([]);
        setB(null);
        setOperator(null);
        setValue(0);
      }}
    >
      <ModalDialog>
        <List>
          {a && !operator ? (
            conditionOptions?.map((o) => (
              <ListItem key={o}>
                <ListItemButton
                  onClick={() => {
                    if (o === "true" && a) {
                      add({ a, operator: o });
                    } else {
                      setOperator(o as ICondition["operator"]);
                      // setPoints([]);
                    }
                  }}
                >
                  {o === "true" ? "Alert Triggered (true)" : sentenceCase(o)}
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <>
              {points?.map((p, i) => (
                <ListItem key={p.series?.options?.id!}>
                  <ListItemButton
                    onClick={() => {
                      const field = getIdFromPoint(p);
                      const f = {
                        field,
                        type: "field" as const,
                        offset: 0,
                      };
                      if ((p?.options as { isSignal: boolean })?.isSignal) {
                        add({ a: f, operator: "true" });
                      } else if (a && operator) {
                        setB(f);
                        add({ a, b: f, operator });
                      } else {
                        setA(f);
                      }
                    }}
                  >
                    <Stack direction="row" spacing={1} ml={-1}>
                      <StopIcon
                        width={16}
                        height={16}
                        style={{
                          color:
                            (p.color as string) ||
                            (p.series?.color as string) ||
                            palette?.neutral?.[50],
                        }}
                      />
                      <Stack>
                        <Typography lineHeight={1}>
                          {p.series?.options?.name!}
                        </Typography>
                        <Typography level="body3">
                          {/* @ts-ignore */}
                          {p.series?.options?.title!}
                        </Typography>
                      </Stack>
                    </Stack>
                    {!!times[i] && (
                      <Typography textAlign="right" level="body2" ml="auto">
                        {times[i]}
                      </Typography>
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
              {a && operator && !b && (
                <ListItem>
                  <ListItemButton
                    onClick={() => {
                      const b = {
                        value,
                        type: "number" as const,
                        offset: 0,
                      };
                      add({ a, b, operator });
                    }}
                  >
                    Static Value
                  </ListItemButton>
                  <ListItemSecondaryAction>
                    <Input
                      variant="soft"
                      size="sm"
                      type="number"
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      sx={{ width: 100 }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              )}

              <ListDivider />
              {
                <Collapse in={expand}>
                  {["open", "high", "low", "close"].map((o) => (
                    <ListItem key={o}>
                      <ListItemButton
                        onClick={() => {
                          const f = {
                            field: o,
                            type: "field" as const,
                            offset: 0,
                          };
                          if (a && operator) {
                            setB(f);
                            add({ a, b: f, operator });
                          } else {
                            setA(f);
                          }
                        }}
                      >
                        {capitalCase(o)}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </Collapse>
              }
            </>
          )}
        </List>
        <Space sb c>
          <Link fontSize={12} onClick={() => setExpand((v) => !v)}>
            {expand ? "Cancel" : "Use OHLA values"}
          </Link>
          {conditions?.length > 0 && (
            <Space g={1} c>
              <Typography level="body2">Within</Typography>
              <Input
                value={offset}
                sx={{ width: 100 }}
                endDecorator={<Typography level="body2">bars</Typography>}
                type="number"
                slotProps={{ input: { min: 0 } }}
                onChange={(e) => setOffset?.(+e.target.value)}
              />
            </Space>
          )}
        </Space>
      </ModalDialog>
    </Modal>
  );
};
