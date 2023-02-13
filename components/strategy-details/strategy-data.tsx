import { Card } from "@mui/joy";
import { FC } from "react";
import { CLOSING } from "ws";
import { useRows } from "../../hooks/data.hook";
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
  return (
    <Card>
      <StrategyChart
        rows={rows}
        open={events?.open}
        close={events?.close}
        trades={trades}
      />
      <DetailsTable strategy={strategy} trades={trades} />
    </Card>
  );
};
