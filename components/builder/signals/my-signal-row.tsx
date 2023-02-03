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
import { ICondition, IConditionEntry, ISignal } from "../../../types/app.types";

type Props = {
  signal: ISignal;
  onDelete?: (signal: number) => void;
};
const splitField = (c?: IConditionEntry) => {
  const f = c?.field?.split?.(":") || [];
  if (f.length === 1) {
    return { field: f[0], series: null };
  }
  return { field: f[1].replace(/\-\-\-(.+)/, ""), series: f[0] };
};
export const MySignalRow: FC<Props> = ({ signal, onDelete = noop }) => {
  return (
    <Sheet sx={{ borderRadius: 1 }}>
      <Stack
        p={1}
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        spacing={1}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {signal?.condition?.map((c) => (
            <Stack
              key={c.a + c.operator + c.b}
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
                    <Typography level="body2">
                      {splitField(c.b)?.field}
                    </Typography>
                    <Typography level="body3">
                      {splitField(c.b)?.series}
                    </Typography>
                  </Stack>
                </>
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
          <IconButton
            color="danger"
            size="sm"
            onClick={() => onDelete(signal?.id)}
          >
            <TrashIcon width={16} />
          </IconButton>
        </Box>
      </Stack>
    </Sheet>
  );
};
