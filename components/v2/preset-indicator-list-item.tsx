import { EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Stack,
} from "@mui/joy";
import noop from "lodash.noop";
import { ITVIndicator } from "../tv-components/types";

type Props = {
  indicator: ITVIndicator;
  onRemove?: (i: ITVIndicator) => void;
};
export const V2PresetIndicatorListItem = ({
  indicator,
  onRemove = noop,
}: Props) => {
  return (
    <ListItem
      endAction={
        <IconButton variant="plain" onClick={() => onRemove(indicator)}>
          <XMarkIcon width={16} />
        </IconButton>
      }
    >
      <ListItemDecorator>
        <Avatar size="sm">{indicator.scriptName?.[0]}</Avatar>
      </ListItemDecorator>
      <ListItemContent>{indicator.scriptName}</ListItemContent>
    </ListItem>
  );
};
