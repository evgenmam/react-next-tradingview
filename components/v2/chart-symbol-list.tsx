import { Button, List } from "@mui/joy";
import { V2ChartListItem } from "./chart-list-item";
import { useV2Chart, useV2List } from "./hooks/v2-data.hook";
import { IChartConfig } from "./v2.types";
import { Box, Stack } from "@mui/system";
import { PlusIcon } from "@heroicons/react/24/solid";
import { TVSymbolSearchDialog } from "../tv-components/dialogs/symbol-search-dialog";
import { useState } from "react";
import * as R from "ramda";

type Props = {
  config: IChartConfig;
};
export const V2ChartSymbolList = ({ config }: Props) => {
  const { list, addSymbol, removeSymbol } = useV2List(config?.list);
  const { setSymbol } = useV2Chart(config);
  const [open, setOpen] = useState(false);
  return (
    <Stack>
      <List>
        {list?.symbols.map((s) => (
          <V2ChartListItem
            key={s?.symbol + s.provider_id + s.prefix}
            symbol={s}
            selected={R.equals(s, config?.symbol)}
            onClick={setSymbol}
            onRemove={(v) => removeSymbol(list?.id!, v)}
          />
        ))}
      </List>
      <Box px={1}>
        <Button
          fullWidth
          startDecorator={<PlusIcon width={12} />}
          variant="plain"
          onClick={() => setOpen(true)}
        >
          Add Symbol
        </Button>
      </Box>
      <TVSymbolSearchDialog
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(v) => {
          setOpen(false);
          if (v && !R.includes(v, list?.symbols || [])) {
            addSymbol(list?.id!, v);
            setSymbol(v);
          }
        }}
      />
    </Stack>
  );
};
