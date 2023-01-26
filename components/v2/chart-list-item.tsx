import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Stack,
  Typography,
} from "@mui/joy";
import { Box } from "@mui/system";
import noop from "lodash.noop";
import { useActiveList } from "../../hooks/data.hook";
import { XJson } from "../json";
import { ITVSymbol } from "../tv-components/types";
import { getSymbolKey } from "../tv-components/utils/symbol.utils";

const getLogo = (path: string) =>
  `https://s3-symbol-logo.tradingview.com/${path}.svg`;

type Props = {
  symbol: ITVSymbol;
  selected?: boolean;
  onClick?: (symbol: ITVSymbol) => void;
  onRemove?: (symbol: ITVSymbol) => void;
};

export const V2ChartListItem = ({
  symbol,
  selected,
  onClick = noop,
  onRemove = noop,
}: Props) => {
  return (
    <ListItem
      variant={selected ? "soft" : "plain"}
      endAction={
        !selected && (
          <IconButton onClick={() => onRemove(symbol)}>
            <XMarkIcon width={16} />
          </IconButton>
        )
      }
    >
      <ListItemButton selected={selected} onClick={() => onClick(symbol)}>
        <ListItemDecorator>
          <Avatar src={getLogo(symbol.logoid)} size="sm">
            {symbol.symbol?.[0]}
          </Avatar>
        </ListItemDecorator>
        <ListItemContent>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>{symbol.symbol}</Typography>
            <Typography level="body2">{symbol.exchange}</Typography>
          </Stack>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  );
};
