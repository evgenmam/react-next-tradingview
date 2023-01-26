import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";
import { Box } from "@mui/system";
import noop from "lodash.noop";
import { useActiveList } from "../../hooks/data.hook";
import { XJson } from "../json";
import { ITVSymbol } from "../tv-components/types";

const getLogo = (path: string) =>
  `https://s3-symbol-logo.tradingview.com/${path}.svg`;

type Props = {
  symbol: ITVSymbol;
};

export const TVSymbolListItem = ({ symbol }: Props) => {
  const { removeSymbol } = useActiveList();
  return (
    <ListItem
      endAction={
        <IconButton
          onClick={() => {
            removeSymbol(symbol);
          }}
        >
          <XMarkIcon width={16} />
        </IconButton>
      }
    >
      <ListItemButton
        onClick={() => {
          // onClick(symbol);
        }}
      >
        <ListItemDecorator>
          <Avatar src={getLogo(symbol.logoid)} size="sm">
            {symbol.symbol?.[0]}
          </Avatar>
        </ListItemDecorator>
        <ListItemContent>{symbol.symbol}</ListItemContent>
        <ListItemDecorator>{symbol.exchange}</ListItemDecorator>
      </ListItemButton>
    </ListItem>
  );
};
