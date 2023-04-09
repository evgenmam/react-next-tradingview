import { Cog6ToothIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Sheet,
  Stack,
  Input,
} from "@mui/joy";
import { Collapse } from "@mui/material";
import { useCallback, useState } from "react";
import { useSettings } from "../../hooks/data.hook";
import * as R from "ramda";
import { SaveLoadButtons } from "./save-load-buttons";
import IDB from "../../db/db";
import { StatusButton } from "./status-button";

export const Settings = () => {
  const { maxDigits, setMaxDigits, setTheme, theme } = useSettings();
  const [open, setOpen] = useState(false);
  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
    setTimeout(() => {
      window.location.reload();
    }, 400);
  }, [setTheme, theme]);
  return (
    <Stack
      position="fixed"
      bottom="0"
      right="0"
      zIndex={2000}
      alignItems="end"
    >
      <Sheet variant="plain">
        <Stack direction="row" justifyContent="end" spacing={1} p={1}>
          <StatusButton />

          <IconButton onClick={() => setOpen(R.not)}>
            <Cog6ToothIcon />
          </IconButton>
          <IconButton onClick={toggleTheme}>
            {theme === "dark" ? <MoonIcon /> : <SunIcon />}
          </IconButton>
        </Stack>
      </Sheet>
      <Sheet variant="outlined">
        <Collapse in={open}>
          <Stack
            spacing={2}
            p={1}
            direction="row"
            justifyContent="center"
            alignItems="end"
            divider={<Divider orientation="vertical" />}
            sx={{ ">*": { flexShrink: 0 } }}
          >
            <FormControl>
              <FormLabel>Max Digits</FormLabel>
              <Input
                sx={{ maxWidth: 70 }}
                type="number"
                value={maxDigits || ""}
                onChange={(e) => {
                  if (+e.target.value >= 0) setMaxDigits(+e.target.value);
                }}
              />
            </FormControl>

            <SaveLoadButtons />
            <Button
              onClick={() => {
                IDB.delete();
                setTheme("dark");
                window.localStorage.clear();
                window.location.reload();
              }}
            >
              Reset Data
            </Button>
          </Stack>
        </Collapse>
      </Sheet>
    </Stack>
  );
};
