import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  CircularProgress,
  Divider,
  Input,
  inputClasses,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  MenuList,
  Sheet,
  Typography,
} from "@mui/joy";
import { Box } from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import XScrollbar from "../utils/scrollbars";
import { ISearchType, TVSearchTypeSelect } from "./helpers/search-type-select";
import { ITVSearchData, ITVSearchResult } from "./types";
import * as R from "ramda";
import { useKeyboardNav } from "./hooks/keyboard-nav.hook";
import { CBox } from "./helpers/c-box";
import { useSearchData, useSplitText } from "./hooks/search-data.hook";
import noop from "lodash.noop";

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
  const [results, setResults] = useState<ITVSearchData>({
    symbols: [],
    symbols_remaining: 0,
  });

  const { hl, setHl, onKeyDown, listRef } = useKeyboardNav({
    max: results.symbols?.length,
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
    const d = r.prefix || r.exchange + ":" + r.symbol;
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
                {results?.symbols.map((r, idx) => (
                  <>
                    <ListItem
                      key={r.symbol + r.description + r.exchange + r.country}
                    >
                      <ListItemButton
                        onClick={() => {
                          commit(r);
                          onSelect(r);
                        }}
                        {...(idx === hl
                          ? { selected: true, variant: "soft" }
                          : {})}
                      >
                        <ListItemDecorator>
                          <Avatar
                            src={r.logoid && getLogo(`${r.logoid}`)}
                            size="sm"
                            variant="solid"
                          >
                            {r.symbol.slice(0, 1)}
                          </Avatar>
                        </ListItemDecorator>
                        <ListItemContent>
                          <Stack
                            direction="row"
                            spacing={1}
                            px={1}
                            alignItems="center"
                          >
                            <Typography
                              minWidth={50}
                              pr={1}
                              fontWeight={600}
                              level="body1"
                            >
                              {r.symbol}
                            </Typography>
                            <Typography level="body2">
                              {r.description}
                            </Typography>
                          </Stack>
                        </ListItemContent>
                        <ListItemDecorator>
                          {" "}
                          <ListItemDecorator>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Typography level="body2">{r.type}</Typography>
                              <Typography>{r.exchange}</Typography>
                              {r.country ? (
                                <Avatar
                                  src={getLogo(`country/${r.country}`)}
                                  size="sm"
                                  variant="solid"
                                />
                              ) : (
                                <Avatar
                                  src={getLogo(`provider/${r.provider_id}`)}
                                  size="sm"
                                  variant="solid"
                                />
                              )}
                            </Stack>
                          </ListItemDecorator>
                        </ListItemDecorator>
                      </ListItemButton>
                    </ListItem>
                  </>
                ))}
              </List>
            )}
          </XScrollbar>
        </Box>
      </Stack>
    </Sheet>
  );
};
