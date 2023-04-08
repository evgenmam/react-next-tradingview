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
import { useSignals, useStrategies } from "../../hooks/data.hook";
import MySignalPopper from "../builder/signals/my-signal-popper";
import { MySignalRow } from "../builder/signals/my-signal-row";
import { useEffect, useState } from "react";
import { Space } from "../utils/row";
import dl from "js-file-download";
import * as R from "ramda";
import { ISignal, IStrategy } from "../../types/app.types";
import * as D from "date-fns";
import { MyStrategyRow } from "../builder/strategies/my-strategy-row";

type ExportDialogProps = {
  onClose?: () => void;
  open?: boolean;
  type: "signals" | "strategies";
};

export const ExportDialog = ({ open, onClose, type }: ExportDialogProps) => {
  const { signals } = useSignals();
  const { strategies } = useStrategies();
  const [selectedSignals, setSelectedSignals] = useState<ISignal[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<IStrategy[]>([]);
  useEffect(() => {
    setSelectedSignals([]);
  }, [open]);
  const checkSignal = (sgnl: ISignal) => {
    setSelectedSignals(
      //@ts-ignore
      R.ifElse(R.includes(sgnl), R.reject(R.equals(sgnl)), R.append(sgnl))
    );
  };
  const checkStrategy = (str: IStrategy) => {
    setSelectedStrategies(
      //@ts-ignore
      R.ifElse(R.includes(str), R.reject(R.equals(str)), R.append(str))
    );
  };

  const onDownload = () => {
    const data =
      type === "signals"
        ? { signals: selectedSignals.map(R.dissoc("id")) }
        : {
            strategies: selectedStrategies.map(R.dissoc("id")),
            signals: R.uniq(
              selectedStrategies
                .flatMap((s) => [s.openSignal, s.closeSignal])
                .filter((s) => s)
                .map<ISignal>((s) => R.dissoc("id")(s!))
            ),
          };
    dl(
      JSON.stringify(data, null, 2),
      "bg_export_" + new Date().toISOString() + ".json",
      "application/json"
    );
    onClose?.();
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
            {type === "strategies" &&
              strategies.map((strategy) => (
                <ListItem key={strategy.id}>
                  <ListItemDecorator>
                    <Checkbox
                      overlay
                      variant="solid"
                      onChange={() => checkStrategy(strategy)}
                      checked={R.includes(strategy)(selectedStrategies)}
                    />
                  </ListItemDecorator>
                  <ListItemContent>
                    <MyStrategyRow small strategy={strategy} />
                  </ListItemContent>
                </ListItem>
              ))}
          </List>
          <Space s={2} justifyContent="end">
            <Button variant="plain" onClick={() => onClose?.()}>
              Cancel
            </Button>
            <Button
              onClick={onDownload}
              disabled={!selectedSignals.length && !selectedStrategies.length}
            >
              Download
            </Button>
          </Space>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default ExportDialog;
