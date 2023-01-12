import {
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  ModalProps,
  FormLabel,
  FormControl,
  TextField,
  Button,
} from "@mui/joy";
import { Stack } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { ModalContext, useModalContext } from "../../hooks/modal.hook";

type Props = {};

export const PromptDialog = ({}: Props) => {
  const [modal, setModal] = useModalContext();
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(modal?.value || "");
  }, [modal?.value]);


  return (
    <Modal
      open={!!modal}
      onClose={() => {
        modal?.onCancel?.();
        setModal(null);
      }}
    >
      <ModalDialog>
        <ModalClose />
        <FormControl>
          <FormLabel>{modal?.label}</FormLabel>
          <TextField
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </FormControl>
        <Stack direction={"row"} spacing={2} mt={2}>
          <Button
            variant="plain"
            color="neutral"
            size="lg"
            fullWidth
            onClick={() => {
              setModal(null);
              modal?.onCancel?.();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="plain"
            color="primary"
            size="lg"
            fullWidth
            onClick={() => {
              setModal(null);
              modal?.onSubmit?.(value);
            }}
          >
            Save
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};
