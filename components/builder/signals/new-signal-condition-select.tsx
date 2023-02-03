import { StopIcon } from "@heroicons/react/24/solid";
import {
  Link,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  Modal,
  ModalDialog,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { Collapse } from "@mui/material";
import { capitalCase, sentenceCase } from "change-case";
import { useState } from "react";
import { ICondition, IConditionEntry } from "../../../types/app.types";
import { conditionOptions, getIdFromPoint } from "../utils/builder.utils";

type Props = {
  points: Highcharts.Point[];
  setPoints: (points: Highcharts.Point[]) => void;
  addCondition: (cond: ICondition) => void;
  setOperator: (operator: ICondition["operator"]) => void;
  setA: (a: IConditionEntry) => void;
  setB: (b: IConditionEntry) => void;
  a: IConditionEntry | null;
  b: IConditionEntry | null;
  operator: ICondition["operator"] | null;
};
export const NewSignalConditionSelect = ({
  points,
  setPoints,
  a,
  b,
  operator,
  addCondition,
  setOperator,
  setA,
  setB,
}: Props) => {
  const [expand, setExpand] = useState(false);
  const { palette } = useTheme();
  return (
    <Modal
      open={!!points?.length}
      onClose={() => {
        setPoints([]);
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
                      addCondition({ a, operator: o });
                    } else {
                      setOperator(o as ICondition["operator"]);
                      setPoints([]);
                    }
                  }}
                >
                  {o === "true" ? "Alert Triggered (true)" : sentenceCase(o)}
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <>
              {points?.map((p) => (
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
                  </ListItemButton>
                </ListItem>
              ))}

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
                            addCondition({ a, b: f, operator });
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
        <Link fontSize={12} onClick={() => setExpand((v) => !v)}>
          {expand ? "Cancel" : "Use OHLA values"}
        </Link>
      </ModalDialog>
    </Modal>
  );
};
