import {
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { Stack } from "@mui/system";
import noop from "lodash.noop";
import { ITVIndicator } from "./types";

type Props = {
  script: ITVIndicator;
  onClick?: (i: ITVIndicator) => void;
};

export const TVScriptListRow = ({ script, onClick = noop }: Props) => {
  return (
    <ListItem>
      <ListItemButton onClick={() => onClick(script)}>
        <ListItemContent>
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <Typography>{script.scriptName}</Typography>
            <Typography level="body2">{script.author?.username}</Typography>
          </Stack>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  );
};
