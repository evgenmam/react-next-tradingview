import { Modal, ModalDialog, ModalProps } from "@mui/joy";
import noop from "lodash.noop";
import { TVSearch } from "../search";
import { ITVSymbol } from "../types";

type Props = {
  open: boolean;
  onClose: ModalProps["onClose"];
  onSelect?: (v: ITVSymbol) => void;
};

export const TVSymbolSearchDialog = ({
  open,
  onClose = noop,
  onSelect = noop,
}: Props) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <TVSearch autoSearch onSelect={onSelect} />
      </ModalDialog>
    </Modal>
  );
};
