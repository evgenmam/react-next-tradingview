import {
  ModalDialog,
  Modal,
  Sheet,
  Checkbox,
  List,
  ListItem,
  ListItemDecorator,
  ListItemContent,
  Stack,
  Divider,
  Button,
} from "@mui/joy";
import { useSignals } from "../../hooks/data.hook";
import MySignalPopper from "../builder/signals/my-signal-popper";
import { MySignalRow } from "../builder/signals/my-signal-row";
import { useEffect, useState } from "react";
import { Space } from "../utils/row";
import dl from "js-file-download";
import * as R from "ramda";
import { ISignal } from "../../types/app.types";
import * as D from "date-fns";

type ExportDialogProps = {
  onClose?: () => void;
  open?: boolean;
  type: "signals" | "strategies";
};

export const ExportDialog = ({ open, onClose, type }: ExportDialogProps) => {
  const { signals } = useSignals();
  const [selectedSignals, setSelectedSignals] = useState<ISignal[]>([]);

  useEffect(() => {
    setSelectedSignals([]);
  }, [open]);
  const checkSignal = (sgnl: ISignal) => {
    setSelectedSignals(
      //@ts-ignore
      R.ifElse(R.includes(sgnl), R.reject(R.equals(sgnl)), R.append(sgnl))
    );
  };

  const onDownload = () => {
    const data = { signals: selectedSignals };
    dl(
      JSON.stringify(data, null, 2),
      "bg_export_" + new Date().toISOString() + ".json",
      "application/json"
    );
  };

  return (
    <Modal open={!!open} onClose={onClose}>
      <ModalDialog>
        <Stack divider={<Divider />} spacing={2}>
          <List>
            {type === "signals" &&
              signals.map((signal) => (
                <ListItem key={signal.id}>
                  <ListItemDecorator>
                    <Checkbox
                      overlay
                      variant="solid"
                      onChange={() => checkSignal(signal)}
                      checked={R.includes(signal)(selectedSignals)}
                    />
                  </ListItemDecorator>
                  <ListItemContent>
                    <MySignalRow signal={signal} />
                  </ListItemContent>
                </ListItem>
              ))}
          </List>
          <Space s={2} justifyContent="end">
            <Button variant="plain" onClick={() => onClose?.()}>
              Cancel
            </Button>
            <Button onClick={onDownload} disabled={!selectedSignals.length}>
              Download
            </Button>
          </Space>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default ExportDialog;
