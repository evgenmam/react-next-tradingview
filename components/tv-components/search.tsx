import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  Button,
  CircularProgress,
  Divider,
  Input,
  List,
  Sheet,
} from "@mui/joy";
import { Box } from "@mui/material";
import { Stack } from "@mui/system";
import { KeyboardEvent, useEffect, useState } from "react";
import XScrollbar from "../utils/scrollbars";
import { ISearchType, TVSearchTypeSelect } from "./helpers/search-type-select";
import { ITVSearchData, ITVSearchResult } from "./types";
import { useKeyboardNav } from "./hooks/keyboard-nav.hook";
import { CBox } from "./helpers/c-box";
import { useSearchData, useSplitText } from "./hooks/search-data.hook";
import noop from "lodash.noop";
import { TVSearchListItem } from "./search-list-item";

const getLogo = (path: string) =>
  `https://s3-symbol-logo.tradingview.com/${path}.svg`;

type Props = {
  onSelect?: (e: ITVSearchResult) => void;
  value?: string;
  autoSearch?: boolean;
};

export const TVSearch = ({
  value = "",
  onSelect = noop,
  autoSearch,
}: Props) => {
  const [skip, setSkip] = useState(false);
  const [type, setType] = useState<ISearchType>("");
  const [expanded, setExpanded] = useState(-1);
  const [results, setResults] = useState<ITVSearchData>({
    symbols: [],
    symbols_remaining: 0,
  });

  const { hl, setHl, onKeyDown, listRef } = useKeyboardNav({
    max: results.symbols?.length,
    expanded,
  });

  const { text, onTextChange, onCursorChange, setSplitText, splitText } =
    useSplitText("/");

  const searchType = splitText?.split(":")[1] || splitText;
  const { loading } = useSearchData<ITVSearchData>({
    params: { text: searchType, type },
    url: "/api/search",
    onResult: (v) => {
      setHl(-1);
      setResults(v);
    },
    skip: skip || (!autoSearch && !text),
  });

  const commit = (r?: ITVSearchResult) => () => {
    if (!r) return;
    const symbol = r.contracts ? r.contracts[0].symbol : r.symbol;
    const d = r.prefix || r.exchange + ":" + symbol;
    setSplitText(d);
    return d;
  };

  const onEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      onSelect(results.symbols[hl]);
    }
  };

  useEffect(() => {
    setSkip(true);
    commit(results.symbols[hl] || results.symbols[0])();
  }, [hl]);

  return (
    <Sheet variant="outlined" onKeyDown={onKeyDown}>
      <Stack
        sx={{
          ".ps__rail-y": {
            zIndex: 10,
          },
        }}
        onKeyDown={onEnter}
      >
        <Box py={1}>
          <Input
            autoFocus
            sx={{
              bgcolor: "transparent",
              border: "none",
              ":before": {
                display: "none !important",
              },
            }}
            onSelect={onCursorChange}
            value={text}
            onChange={(e) => {
              onTextChange(e as any);
              setSkip(false);
            }}
            startDecorator={<MagnifyingGlassIcon width={24} />}
            endDecorator={<Button variant="plain">Set</Button>}
          />
        </Box>
        <Divider />
        <Box p={1}>
          <TVSearchTypeSelect value={type} onChange={setType} />
        </Box>
        <Box height={600} overflow="hidden">
          <XScrollbar>
            {loading ? (
              <CBox>
                <CircularProgress determinate={false} />
              </CBox>
            ) : (
              <List size="sm" ref={listRef} sx={{ py: 0 }}>
                {results?.symbols?.map((r, idx) => (
                  <TVSearchListItem
                    key={r.symbol + r.description + r.exchange + r.country}
                    selected={hl === idx}
                    commit={commit}
                    onSelect={onSelect}
                    expanded={expanded === idx}
                    onExpand={() => {
                      setExpanded((v) => (v === idx ? -1 : idx));
                    }}
                    r={r}
                  />
                ))}
              </List>
            )}
          </XScrollbar>
        </Box>
      </Stack>
    </Sheet>
  );
};
