import { TrashIcon, LinkIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  Chip,
  IconButton,
  Sheet,
  Stack,
  Input,
  Tooltip,
  Typography,
} from "@mui/joy";
import { sentenceCase } from "change-case";
import { FC, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { IConditionEntry, ISignal } from "../../../types/app.types";
import { Space } from "../../utils/row";
import LinkSignalModal from "./link-signal-modal";
import MySignalPopper from "./my-signal-popper";
import { SignalsContext } from "../context/signals.context";
import { useSignals } from "../../../hooks/data.hook";
import { Box } from "@mui/material";
import { ColorSelect } from "../../data/selects/color-select";

type Props = {
  signal: ISignal;
  onDelete?: (signal: number) => void;
  full?: boolean;
  draggable?: boolean;
  showName?: boolean;
  light?: boolean;
  onLink?: (signal: ISignal) => void;
  withView?: boolean;
  editable?: boolean;
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
  editable,
  onLink,
  withView,
}) => {
  const { updateSignal } = useSignals();
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "signal",
    item: signal,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const [editing, setEditing] = useState(false);
  const [{ canDrop, isOver }, drop] = useDrop<
    ISignal,
    ISignal,
    { canDrop: boolean; isOver: boolean }
  >(() => {
    return {
      accept: "signal",
      drop: (item: ISignal) => {
        if (item.id === signal.id) return;
        updateSignal({
          ...signal,
          link: { signal: item, operator: "AND", range: 0 },
        });
        return item;
      },
      canDrop: (item: ISignal) => !signal.link,
      collect: (monitor) => {
        const id = monitor.getItem()?.id;
        return {
          isOver: monitor.isOver() && id !== signal.id,
          canDrop: monitor.canDrop() && id !== signal.id,
        };
      },
    };
  }, [signal]);
  const [linking, setLinking] = useState(false);
  return (
    <Sheet
      {...(draggable && { ref: drag })}
      sx={({ palette }) => ({
        borderRadius: 1,
        overflow: "hidden",
        ...(full && {
          width: "100%",
        }),
        ...(draggable && {
          cursor: "grab",
        }),

        ...(isOver && {
          outlineWidth: 2,
          outlineStyle: "solid",
          //@ts-ignore
          outlineColor: canDrop ? palette.success.main : palette.error.main,
        }),
      })}
      variant={light ? "soft" : "outlined"}
    >
      <Box position="relative">
        <Space
          ref={drop}
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
            <Box
              position="absolute"
              top={0}
              left={0}
              bottom={0}
              width={10}
              bgcolor="transparent"
            >
              <ColorSelect
                value={signal.color}
                onChange={(v) => updateSignal({ ...signal, color: v })}
              >
                <Box width={10} height={50}></Box>
              </ColorSelect>
            </Box>
            <Space s={1}>
              {showName &&
                (editing ? (
                  <Input
                    size="sm"
                    defaultValue={signal?.name || `Signal ${signal?.id}`}
                    onBlur={(e) => {
                      updateSignal({ ...signal, name: e.target.value });
                      setEditing(false);
                    }}
                    autoFocus
                  />
                ) : (
                  <Typography
                    onClick={() => setEditing(true)}
                    sx={
                      editable
                        ? { cursor: "pointer" }
                        : { pointerEvents: "none" }
                    }
                  >
                    {signal?.name || `Signal ${signal?.id}`}
                  </Typography>
                ))}
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
                    <Chip
                      size="sm"
                      color={c.next === "OR" ? "info" : "primary"}
                    >
                      {c.next}
                    </Chip>
                  )}
                </Stack>
              ))}
            </Stack>
          </Stack>
          <Space ml="auto" justifySelf="flex-end" s={0.5}>
            {withView && (
              <SignalsContext.Consumer>
                {({ selected, setSelected }) => {
                  const isSelected = selected.find(
                    ({ id }) => id === signal?.id
                  );
                  return (
                    <Tooltip title="View on chart">
                      <IconButton
                        color="primary"
                        size="sm"
                        variant={isSelected ? "solid" : "plain"}
                        onClick={(e) => {
                          e.stopPropagation();
                          isSelected
                            ? setSelected(
                                selected.filter(({ id }) => id !== signal?.id)
                              )
                            : setSelected([...selected, signal]);
                        }}
                      >
                        <EyeIcon width={16} />
                      </IconButton>
                    </Tooltip>
                  );
                }}
              </SignalsContext.Consumer>
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
        </Space>
      </Box>
    </Sheet>
  );
};
