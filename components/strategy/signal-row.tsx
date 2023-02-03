import {
  EyeIcon,
  EyeSlashIcon,
  StopIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/joy";
import { ListItemAvatar, ListItemSecondaryAction } from "@mui/material";
import { capitalCase, sentenceCase } from "change-case";
import { useSignals } from "../../hooks/data.hook";
import { ISignal } from "../../types/app.types";
import { XJson } from "../json";

type Props = {
  signal: ISignal;
};
export const SignalRow = ({ signal }: Props) => {
  const { removeSignal, updateSignal } = useSignals();

  const toggle = () => {
    updateSignal({ ...signal, hide: !signal.hide });
  };
  return (
    <List>
      {signal.condition.map((c, idx) => (
        <ListItem key={idx}>
          <Stack direction={"row"} spacing={0.5} alignItems="start">
            <StopIcon color={signal.color} width={18} />

            <Stack>
              <Typography fontWeight={700} lineHeight={1}>
                {c.a.field}[{c.a.offset}]
              </Typography>
              <Typography lineHeight={1}>{sentenceCase(c.operator)}</Typography>
              <Typography fontWeight={700} lineHeight={1}>
                {c.b?.field}[{c.b?.offset}]
              </Typography>
            </Stack>
          </Stack>
          <ListItemSecondaryAction>
            <IconButton
              size="sm"
              variant="plain"
              onClick={() => {
                toggle();
              }}
            >
              {signal.hide ? (
                <EyeSlashIcon width={18} />
              ) : (
                <EyeIcon width={18} />
              )}
            </IconButton>
            <IconButton
              size="sm"
              color="danger"
              variant="plain"
              onClick={() => {
                removeSignal(signal.id);
              }}
            >
              <TrashIcon width={18} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};
