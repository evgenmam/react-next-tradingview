import { Box, Divider, List, Stack } from "@mui/joy";
import { memo } from "react";
import { useActiveList } from "../../hooks/data.hook";
import { ITVSymbolList } from "../tv-components/types";
import { IChartConfig } from "../v2/v2.types";
import { TVSymbolListItem } from "./symbol-list-item";
import { SymbolListSelect } from "./symbol-list-select";

type Props = { config: IChartConfig };

export const SymbolListL = ({ config }: Props) => {
  return (
    <Stack direction="row">
      <Divider orientation="vertical" />
      <Stack
        divider={<Divider />}
        height="100vh"
        minWidth={400}
        boxSizing="border-box"
      >
        <SymbolListSelect />
        {/* <List>
          {useActiveList().list?.symbols.map((s) => (
            <TVSymbolListItem key={s.symbol + s.exchange} symbol={s} />
          ))}
        </List> */}
      </Stack>
    </Stack>
  );
};

export const SymbolList = memo(SymbolListL);
