import { List, Modal, ListItem, ModalDialog, ListItemButton } from "@mui/joy";
import { conditionOptions } from "../utils/builder.utils";
import { sentenceCase } from "change-case";

type OperatorSelectDialogProps = {
  open?: boolean;
  onClose?: () => void;
  onSelect?: (operator: string) => void;
};

export const OperatorSelectDialog = ({
  onClose,
  onSelect,
  open,
}: OperatorSelectDialogProps) => {
  return (
    <Modal open={!!open} onClose={onClose}>
      <ModalDialog>
        <List>
          {conditionOptions.map((o) => (
            <ListItem key={o}>
              <ListItemButton onClick={() => onSelect?.(o)}>
                {sentenceCase(o)}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ModalDialog>
    </Modal>
  );
};

export default OperatorSelectDialog;
