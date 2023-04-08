import { useSignals } from "../../../hooks/data.hook";
import { ISignal, ISignalLink } from "../../../types/app.types";
import * as R from "ramda";
import { flattenLinks } from "../../../utils/signal.utils";
import {
  List,
  ListItem,
  ModalDialog,
  ListItemButton,
  Modal,
  Tabs,
  Tab,
  TabList,
  ListItemDecorator,
  Divider,
  Input,
  Button,
} from "@mui/joy";
import MySignalPopper from "./my-signal-popper";
import { SyntheticEvent, useEffect, useState } from "react";
import { LinkIcon, StopIcon } from "@heroicons/react/24/solid";
import { Stack, Typography } from "@mui/material";
import { Space } from "../../utils/row";

type LinkSignalModalProps = {
  signal: ISignal;
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (signal: ISignalLink) => void;
};

export const LinkSignalModal = ({
  signal,
  open,
  onClose,
  onSubmit,
}: LinkSignalModalProps) => {
  const [selected, setSelected] = useState<ISignal | null>(null);
  const [range, setRange] = useState(0);
  const [operator, setOperator] = useState<"AND" | "OR">("AND");
  const { signals, updateSignal } = useSignals();
  const list = R.without(flattenLinks(signal), signals);
  const close = () => {
    onClose?.();
    setSelected(null);
    setRange(0);
    setOperator("AND");
  };
  const save = () => {
    if (!selected) return;
    const link = { signal: selected, operator, range };
    updateSignal({ ...signal, link });
    onSubmit?.(link);
    close();
  };
  const unlink = () => {
    updateSignal({ ...signal, link: undefined });
    close();
  };
  useEffect(() => {
    if (open) {
      console.log(signal);
      setSelected(signal?.link?.signal || null);
      setRange(signal?.link?.range || 0);
      setOperator(signal?.link?.operator || "AND");
    }
  }, [open]);
  console.log(selected);
  return (
    <Modal open={!!open} onClose={onClose}>
      <ModalDialog>
        <Stack spacing={2} divider={<Divider />}>
          <Stack>
            {signal.link ? (
              <Space s={1} sb>
                <MySignalPopper signal={signal} />
                <LinkIcon width={20} />
                <MySignalPopper signal={signal.link.signal} />
              </Space>
            ) : (
              <>
                <Typography variant="overline">
                  Link signal {signal.name || signal.id} to
                </Typography>
                <List>
                  {list.map((s) => (
                    <ListItem key={s.id} variant="plain">
                      <ListItemButton
                        onClick={() => setSelected(s)}
                        selected={
                          !!selected && R.eqBy(R.prop("id"))(selected, s)
                        }
                      >
                        <ListItemDecorator>
                          <StopIcon width={20} color={s.color} />
                        </ListItemDecorator>
                        {s.name || `Signal ${s.id}`}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="overline">Operator:</Typography>
            <Tabs
              defaultValue={operator === "AND" ? 0 : 1}
              value={operator === "AND" ? 0 : 1}
              onChange={(v, e) => setOperator(e === 1 ? "OR" : "AND")}
            >
              <TabList>
                <Tab key="AND">AND</Tab>
                <Tab key="OR">OR</Tab>
              </TabList>
            </Tabs>
          </Stack>
          <Stack>
            <Typography variant="overline">Range:</Typography>
            <Input
              type="number"
              endDecorator={<Typography>bars</Typography>}
              value={range}
              onChange={(e) => setRange(+e.target?.value)}
            />
            <Typography variant="caption" pl={1}>
              Max distance between triggers
            </Typography>
          </Stack>
          <Space sb>
            {signal.link && (
              <Button
                variant="plain"
                onClick={unlink}
                color="danger"
                size="sm"
                sx={{ ml: -1 }}
              >
                Unlink
              </Button>
            )}
            <Button variant="plain" onClick={close} sx={{ ml: "auto" }}>
              Cancel
            </Button>
            <Button onClick={save} disabled={!selected}>
              Save
            </Button>
          </Space>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default LinkSignalModal;
