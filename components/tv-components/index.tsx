import {
  CssVarsProvider,
  Grid,
  List,
  ListItem,
  Sheet,
  Typography,
  IconButton,
  ListItemButton,
  ListItemContent,
} from "@mui/joy";
import { Container, Stack } from "@mui/system";
import { useState } from "react";
import { Theme, ThemeWrapper } from "../theme";
import { TVIndicatorSearch } from "./indicator-search";
import { TVMarket } from "./market";
import { TVSearch } from "./search";
import { ITVIndicator } from "./types";
import * as R from "ramda";
import { TrashIcon } from "@heroicons/react/24/outline";

const TVComponents = () => {
  const [selected, setSelected] = useState<string>("NASDAQ:AAPL");
  const [indicators, setIndicators] = useState<ITVIndicator[]>([]);
  return (
    <CssVarsProvider theme={Theme}>
      {/* <ThemeWrapper /> */}
      <Sheet>
        <Container>
          <Grid container spacing={2} pt={2}>
            <Grid xs={12}>
              <Typography level="h3">TradingView SDK</Typography>
            </Grid>
            <Grid xs={12} sm={6}>
              <Stack>
                <Stack spacing={1}>
                  <Typography level="h5">Search</Typography>
                  <TVSearch value={selected} />
                </Stack>
              </Stack>
            </Grid>
            <Grid xs={12} sm={6}>
              <Stack spacing={4}>
                <Stack spacing={2}>
                  <Typography level="h5">Indicators</Typography>
                  <TVIndicatorSearch
                    onSelect={(v) => {
                      setIndicators(R.append(v));
                    }}
                  />
                  <List>
                    {indicators.map((i) => (
                      <ListItem
                        key={i.scriptIdPart}
                        endAction={
                          <IconButton
                            onClick={() => {
                              setIndicators(R.without([i]));
                            }}
                          >
                            <TrashIcon width={12} />
                          </IconButton>
                        }
                      >
                        <ListItemContent>{i.scriptName}</ListItemContent>
                      </ListItem>
                    ))}
                  </List>
                </Stack>
                <Stack spacing={2}>
                  <Typography>{selected}</Typography>
                  <TVMarket symbol={selected} indicators={indicators} />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Sheet>
    </CssVarsProvider>
  );
};

export default TVComponents;
