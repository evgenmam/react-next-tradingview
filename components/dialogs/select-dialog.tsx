import { ChevronDownIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Button,
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
import { ListItemText } from "@mui/material";
import { useState } from "react";
import { XJson } from "../json";

type Props = {
  open: boolean;
  onClose: () => void;
  onChange: (value: string | null | undefined) => void;
  value: string | null | undefined;
  options: string[];
};

export const SelectDialog = ({ value, onChange, options }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="outlined"
        color="neutral"
        size="sm"
        onClick={() => setOpen(true)}
        sx={{ justifyContent: "space-between" }}
      >
        {value}
        <ChevronDownIcon width={12}/>
      </Button>
      <Modal open={open} onClose={() => setOpen((v) => !v)}>
        <ModalDialog sx={{ overflowY: "auto", maxHeight: "100vh" }}>
          <Box>
            <List>
              {options.map((option) => (
                <ListItem key={option}>
                  <ListItemButton
                    onClick={() => {
                      setOpen(false);
                      onChange(option);
                    }}
                  >
                    <ListItemText primary={option} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
};
