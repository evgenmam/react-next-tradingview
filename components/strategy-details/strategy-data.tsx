import { Card } from "@mui/joy";
import { Box, Stack } from "@mui/system";
import { FC } from "react";
import { CLOSING } from "ws";
import { useRows } from "../../hooks/data.hook";
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
  const { strategy } = useStrategyDetails({ id });
  const events = useSignalEvents(strategy);
  const { rows } = useRows(strategy?.dataset);
  const trades = useStrategyTrades(events, rows, strategy);

  const rStrat = getReversalStrategy(strategy);
  const { rows: rRows } = useRows(rStrat?.dataset);
  const rTrades = useStrategyTrades(events, rRows, rStrat);

  return (
    <Card>
      <StrategyChart
        rows={rows}
        open={events?.open}
        close={events?.close}
        trades={trades}
      />
      <Stack spacing={4}>
        <Box>
          <DetailsTable strategy={strategy} trades={trades} />
        </Box>
        <Box>
          <DetailsTable strategy={rStrat} trades={rTrades} />
        </Box>
      </Stack>
    </Card>
  );
};
