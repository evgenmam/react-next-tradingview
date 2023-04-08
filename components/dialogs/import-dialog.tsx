import { ModalDialog, Modal, Stack, Divider, Button } from "@mui/joy";
import { useSignals, useStrategies } from "../../hooks/data.hook";
import { useState } from "react";
import { Space } from "../utils/row";
import { FileDropArea } from "../utils/drop-area";
import * as R from "ramda";
import { ISignal, IStrategy } from "../../types/app.types";

type ExportDialogProps = {
  onClose?: () => void;
  open?: boolean;
};

export const ExportDialog = ({ open, onClose }: ExportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const { addSignal, signals: sgnls } = useSignals();
  const { addStrategy } = useStrategies();
  const onImport = async () => {
    if (file) {
      try {
        const { signals = [], strategies = [] } = JSON.parse(
          await file?.text()
        ) as { signals: ISignal[]; strategies: IStrategy[] };
        for (const signal of signals) {
          if (!R.find(R.eqBy(R.prop("condition"), signal), sgnls))
            addSignal(signal);
        }
        for (const strategy of strategies) {
          const openSignal =
            R.find(R.eqBy(R.prop("condition"), strategy.openSignal), sgnls) ||
            strategy.openSignal;
          const closeSignal =
            R.find(R.eqBy(R.prop("condition"), strategy.closeSignal), sgnls) ||
            strategy.closeSignal;
          addStrategy({ ...strategy, openSignal, closeSignal });
        }
      } catch (error) {}
    }
    onClose?.();
  };
  return (
    <Modal open={!!open} onClose={onClose}>
      <ModalDialog>
        <Stack divider={<Divider />} spacing={2}>
          <FileDropArea open={!!open} onChange={setFile} />
          <Space s={2} justifyContent="end">
            <Button variant="plain" onClick={() => onClose?.()}>
              Cancel
            </Button>
            <Button onClick={onImport} disabled={!file}>
              Download
            </Button>
          </Space>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default ExportDialog;
