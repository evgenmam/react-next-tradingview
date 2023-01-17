import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  Divider,
  Input,
  List,
  ListItem,
  ListItemButton,
  Menu,
  MenuItem,
  Modal,
  ModalClose,
  ModalDialog,
  Select,
} from "@mui/joy";
import { IconButton, ListItemText, Stack } from "@mui/material";
import { RefObject, useEffect, useState } from "react";
import { XJson } from "../json";
import noop from "lodash.noop";

type Props = {
  onClose?: () => void;
  onChange?: (value: string | null | undefined) => void;
  value?: string | null | undefined;
  options: string[];
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
  useEffect(() => {
    if (value) setOpen(false);
  }, [value]);
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
      <Modal open={open} onClose={() => setOpen((v) => !v)}>
        <ModalDialog sx={{ overflowY: "auto", maxHeight: "100vh" }}>
          <Stack spacing={1} divider={<Divider />}>
            {options.length ? (
              <List>
                {options.map((option) => (
                  <ListItem
                    key={option}
                    endAction={
                      onDelete && (
                        <IconButton
                          color="error"
                          onClick={() => {
                            onDelete(option);
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
                        onChange(option);
                      }}
                    >
                      {option}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box p={2}>Nothing here yet</Box>
            )}
            {actions}
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
};
