import { Cog6ToothIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Sheet,
  Stack,
  TextField,
} from "@mui/joy";
import { Collapse } from "@mui/material";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { useRows, useSettings } from "../../hooks/data.hook";
import * as R from "ramda";
import { SaveLoadButtons } from "./save-load-buttons";
import IDB from "../../db/db";

const Checkbox = dynamic(() => import("@mui/joy/Checkbox"), { ssr: false });

export const Settings = () => {
  const { hideEmpty, setHideEmpty, maxDigits, setMaxDigits, setTheme, theme } =
    useSettings();
  const { clearRows } = useRows("source");
  const [open, setOpen] = useState(false);
  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
    setTimeout(() => {
      window.location.reload();
    }, 400);
  }, [setTheme, theme]);
  return (
    <Stack position="fixed" bottom="0" right="0" zIndex={4} alignItems="end">
      <Sheet variant="plain">
        <Stack direction="row" justifyContent="end" spacing={1} p={1}>
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
              <TextField
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
