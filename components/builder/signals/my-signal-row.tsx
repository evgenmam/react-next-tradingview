import { TrashIcon, LinkIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  Badge,
  Box,
  Chip,
  IconButton,
  ListItem,
  Sheet,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { sentenceCase } from "change-case";
import noop from "lodash.noop";
import { FC, useState } from "react";
import { useDrag } from "react-dnd";
import { ICondition, IConditionEntry, ISignal } from "../../../types/app.types";
import { Space } from "../../utils/row";
import LinkSignalModal from "./link-signal-modal";
import MySignalPopper from "./my-signal-popper";

type Props = {
  signal: ISignal;
  onDelete?: (signal: number) => void;
  full?: boolean;
  draggable?: boolean;
  showName?: boolean;
  light?: boolean;
  onLink?: (signal: ISignal) => void;
  onView?: (signal: ISignal) => void;
  viewing?: boolean;
};
const splitField = (c?: IConditionEntry) => {
  const f = c?.field?.split?.(":") || [];
  if (f.length === 1) {
    return { field: f[0], series: null };
  }
  return { field: f[1]?.replace(/\-\-\-(.+)/, ""), series: f[0] };
};

export const MySignalRow: FC<Props> = ({
  signal,
  onDelete,
  full,
  draggable,
  showName,
  light,
  onLink,
  onView,
  viewing,
}) => {
  const [collected, drag] = useDrag(() => ({
    type: "signal",
    item: signal,
  }));
  const [linking, setLinking] = useState(false);
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
      variant={light ? "soft" : "outlined"}
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
        <Stack spacing={0.5}>
          <Space s={1}>
            {showName && (
              <Typography>{signal?.name || `Signal ${signal?.id}`}</Typography>
            )}
            {signal?.link && (
              <>
                <MySignalPopper signal={signal.link.signal} link />
                <Typography variant="plain" level="body3">
                  {signal?.link?.range
                    ? `${signal?.link?.range} bars`
                    : "Same bar"}{" "}
                  ({signal?.link?.operator})
                </Typography>
              </>
            )}
          </Space>
          <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
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
                {!!c?.offset && (
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
        </Stack>
        <Space ml="auto" justifySelf="flex-end" s={0.5}>
          {onView && (
            <Tooltip title="View on chart">
              <IconButton
                color="primary"
                size="sm"
                variant={viewing ? "solid" : "plain"}
                onClick={(e) => {
                  e.stopPropagation();
                  onView(signal);
                }}
              >
                <EyeIcon width={16} />
              </IconButton>
            </Tooltip>
          )}
          {onLink && (
            <Tooltip title="Link Signals">
              <IconButton
                color="primary"
                size="sm"
                variant={signal?.link ? "solid" : "plain"}
                onClick={(e) => {
                  e.stopPropagation();
                  setLinking(true);
                }}
              >
                <LinkIcon width={16} />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete signal">
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
            </Tooltip>
          )}
        </Space>
        <LinkSignalModal
          open={!!linking}
          onClose={() => setLinking(false)}
          signal={signal}
        />
      </Stack>
    </Sheet>
  );
};
