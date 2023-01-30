import { StarIcon } from "@heroicons/react/24/solid";
import { Button, IconButton, Modal, ModalDialog } from "@mui/joy";
import { Box, Stack } from "@mui/system";
import noop from "lodash.noop";
import { useState } from "react";
import { TVFavScripts } from "../fav-scripts";
import { ITVIndicator } from "../types";

type Props = {
  onSelect?: (i: ITVIndicator) => void;
};

export const TVScriptsDialog = ({ onSelect = noop }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <IconButton onClick={() => setOpen(true)}>
        <StarIcon width={20} />
      </IconButton>
      <Modal
        open={open}
        onClose={() => {
          setOpen((v) => !v);
        }}
      >
        <ModalDialog sx={{ overflowY: "auto", maxHeight: "100vh" }}>
          <Stack>
            <TVFavScripts
              onSelect={(v) => {
                onSelect(v);
                setOpen(false);
              }}
            />
          </Stack>
        </ModalDialog>
      </Modal>
    </Box>
  );
};
