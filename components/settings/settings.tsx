import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Sheet,
  Stack,
  TextField,
} from "@mui/joy";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useFields, useRows, useSettings } from "../../hooks/data.hook";

const Checkbox = dynamic(() => import("@mui/joy/Checkbox"), { ssr: false });

export const Settings = () => {
  const { hideEmpty, setHideEmpty, maxDigits, setMaxDigits } = useSettings();
  const { clearFields } = useFields("source");
  const { clearRows } = useRows("source");
  const [open, setOpen] = useState(false);
  return (
    <Box position="fixed" bottom="0" right="0" zIndex={4} boxShadow={1}>
      <Sheet variant="outlined">
        <Stack
          spacing={2}
          p={1}
          direction="row"
          justifyContent="center"
          alignItems="end"
          divider={<Divider orientation="vertical" />}
        >
          <FormControl>
            <FormLabel>Hide null</FormLabel>
            <Box py={1} textAlign="center">
              <Checkbox
                checked={!!hideEmpty}
                onChange={(e) => {
                  setHideEmpty(e.target.checked);
                }}
              />
            </Box>
          </FormControl>
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

          <Button
            onClick={() => {
              clearFields();
              clearRows();
            }}
          >
            Reset Data
          </Button>
        </Stack>
      </Sheet>
    </Box>
  );
};
