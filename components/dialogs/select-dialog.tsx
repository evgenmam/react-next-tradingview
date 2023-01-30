import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import React, { RefObject, useEffect, useState } from "react";
import { XJson } from "../json";
import noop from "lodash.noop";
import * as R from "ramda";
import XScrollbar from "../utils/scrollbars";
export type SOption =
  | {
      label: string;
      value: string;
      group?: string;
    }
  | string;
type Props = {
  onClose?: () => void;
  onChange?: (value: string | null | undefined) => void;
  value?: string | null | undefined;
  options: SOption[];
  placeholder?: string;
  actions?: React.ReactNode;
  onDelete?: (value: string) => void;
};

export const SelectDialog = ({
  value,
  onChange = noop,
  placeholder = "Select",
  options,
  actions,
  onDelete,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const onSearch = (e: React.KeyboardEvent) => {
    if (
      e.code.startsWith("Digit") ||
      e.code.startsWith("Key") ||
      e.code === "Space"
    ) {
      setSearch((v) => v + e.key);
    } else if (e.code === "Backspace") {
      setSearch((v) => v.slice(0, -1));
    }
  };
  useEffect(() => {
    if (value) setOpen(false);
  }, [value]);
  const groupped = R.pipe(
    R.filter(
      R.pipe(
        //@ts-ignore
        R.when(R.has("value"), R.prop("value")),
        R.toLower,
        R.includes(search)
      )
    ),

    R.groupBy(R.propOr("null", "group"))
  )(options);
  return (
    <>
      <Button
        variant="outlined"
        color="neutral"
        size="sm"
        onClick={() => setOpen(true)}
        sx={{ justifyContent: "space-between" }}
      >
        <Box mr={3}>{value || placeholder}</Box>
        <ChevronDownIcon width={12} />
      </Button>
      <Modal
        open={open}
        onClose={() => {
          setSearch("");
          setOpen((v) => !v);
        }}
        onKeyDown={onSearch}
      >
        <ModalDialog sx={{ overflowY: "auto", maxHeight: "100vh" }}>
          <Stack spacing={1}>
            <Typography variant="plain">{search}</Typography>
            <Stack spacing={1} divider={<Divider />} maxHeight="70vh">
              <XScrollbar>
                {options.length ? (
                  <List>
                    {Object.keys(groupped).map((group) => (
                      <React.Fragment key={group}>
                        {group !== "null" && (
                          <ListItem>
                            <Typography color="primary" level="body2">
                              {group}
                            </Typography>
                          </ListItem>
                        )}
                        {groupped[group].map((o) => {
                          const option = o as SOption;
                          const v = R.has("value", option)
                            ? option.value
                            : option;
                          const l = R.has("label", option)
                            ? option.label
                            : option;
                          return (
                            <ListItem
                              key={v}
                              endAction={
                                onDelete && (
                                  <IconButton
                                    color="danger"
                                    onClick={() => {
                                      onDelete(v);
                                      if (option === value) onChange(null);
                                    }}
                                  >
                                    <XMarkIcon width={12} />
                                  </IconButton>
                                )
                              }
                            >
                              <ListItemButton
                                selected={option === value}
                                onClick={() => {
                                  setOpen(false);
                                  onChange(v);
                                }}
                              >
                                {l}
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box p={2}>Nothing here yet</Box>
                )}
              </XScrollbar>
              {actions}
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
};
