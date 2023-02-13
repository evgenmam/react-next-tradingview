import { TrashIcon } from "@heroicons/react/24/outline";
import {
  Badge,
  Box,
  Chip,
  IconButton,
  ListItem,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { sentenceCase } from "change-case";
import noop from "lodash.noop";
import { FC } from "react";
import { useDrag } from "react-dnd";
import { ICondition, IConditionEntry, ISignal } from "../../../types/app.types";
import { Space } from "../../utils/row";

type Props = {
  signal: ISignal;
  onDelete?: (signal: number) => void;
  full?: boolean;
  draggable?: boolean;
};
const splitField = (c?: IConditionEntry) => {
  const f = c?.field?.split?.(":") || [];
  if (f.length === 1) {
    return { field: f[0], series: null };
  }
  return { field: f[1].replace(/\-\-\-(.+)/, ""), series: f[0] };
};

export const MySignalRow: FC<Props> = ({
  signal,
  onDelete,
  full,
  draggable,
}) => {
  const [collected, drag] = useDrag(() => ({
    type: "signal",
    item: signal,
  }));
  return (
    <Sheet
      {...(draggable && { ref: drag })}
      sx={{
        borderRadius: 1,
        overflow: "hidden",
        ...(full && {
          width: "100%",
        }),
        ...(draggable && {
          cursor: "grab",
        }),
      }}
      variant="outlined"
    >
      <Stack
        p={1}
        justifyContent={full ? "center" : "space-between"}
        alignItems="center"
        direction="row"
        spacing={1}
        sx={{
          borderLeftWidth: 10,
          borderColor: signal?.color,
          borderLeftStyle: "solid",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          {signal?.condition?.map((c) => (
            <Stack
              key={c.a?.field + c.operator + c.b?.field}
              direction="row"
              spacing={0.5}
              alignItems="center"
            >
              {c.a && (
                <Stack>
                  <Typography level="body2">
                    {splitField(c.a)?.field}{" "}
                    {c.operator !== "true" && sentenceCase(c.operator)}
                  </Typography>
                  <Typography level="body3">
                    {splitField(c.a)?.series}
                  </Typography>
                </Stack>
              )}
              {c?.operator !== "true" && (
                <>
                  <Typography level="body2"></Typography>
                  <Stack>
                    <Space g={0.5}>
                      <Typography level="body2">
                        {splitField(c.b)?.field}
                      </Typography>
                    </Space>
                    <Typography level="body3">
                      {splitField(c.b)?.series}
                    </Typography>
                  </Stack>
                </>
              )}
              {c?.offset && (
                <Typography level="body2" color="info">
                  [:{c?.offset}]
                </Typography>
              )}
              {c?.next && (
                <Chip size="sm" color={c.next === "OR" ? "info" : "primary"}>
                  {c.next}
                </Chip>
              )}
            </Stack>
          ))}
        </Stack>
        <Box ml="auto" justifySelf="flex-end">
          {onDelete && (
            <IconButton
              color="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(signal?.id!);
              }}
            >
              <TrashIcon width={16} />
            </IconButton>
          )}
        </Box>
      </Stack>
    </Sheet>
  );
};
