import { Card } from "@mui/joy";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Box, Stack } from "@mui/system";
import { useEventEmitter } from "ahooks";
import { FC } from "react";
import { CLOSING } from "ws";
import { useRows, useSettings } from "../../hooks/data.hook";
import { getReversalStrategy } from "../../utils/strategy.utils";
import { XJson } from "../json";
import { DetailsTable } from "./details-table";
import { useSignalEvents } from "./hooks/signal-events";
import { useStrategyDetails } from "./hooks/strategy-details";
import { useStrategyTrades } from "./hooks/strategy-trades";
import { StrategyChart } from "./strategy-chart";

type Props = {
  id: number;
};

export const StrategyData: FC<Props> = ({ id }) => {
  const emitter = useEventEmitter<string[]>();
  const clicker = useEventEmitter<string>();
  const { strategy } = useStrategyDetails({ id });
  const events = useSignalEvents(strategy);
  const { rows, dataset } = useRows(strategy?.dataset);
  const trades = useStrategyTrades(events, rows, strategy);

  const rStrat = getReversalStrategy(strategy);
  const { rows: rRows, dataset: rDataset } = useRows(rStrat?.dataset);
  const rTrades = useStrategyTrades(events, rRows, rStrat);
  const { reverseStrategies } = useSettings();
  return (
    <Card>
      <Stack overflow="hidden">
        <Grid2 container>
          <Grid2 xs={12} sm={reverseStrategies ? 6 : 12}>
            <StrategyChart
              emitter={emitter}
              rows={rows}
              open={events?.open}
              close={events?.close}
              trades={trades}
              clicker={clicker}
              dataset={dataset}
            />
          </Grid2>
          {reverseStrategies && (
            <Grid2 xs={12} sm={6}>
              <StrategyChart
                emitter={emitter}
                rows={rRows}
                open={events?.open}
                close={events?.close}
                trades={rTrades}
                clicker={clicker}
                dataset={rDataset}
              />
            </Grid2>
          )}
        </Grid2>
        <Stack spacing={4}>
          <Box>
            <DetailsTable
              strategy={strategy}
              trades={trades}
              emitter={emitter}
              clicker={clicker}
            />
          </Box>
          {reverseStrategies && (
            <Box>
              <DetailsTable
                strategy={rStrat}
                trades={rTrades}
                emitter={emitter}
                clicker={clicker}
              />
            </Box>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};
