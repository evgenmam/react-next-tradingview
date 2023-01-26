import { Box, colors, Typography, typographyClasses } from "@mui/joy";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useRows, useStrategies } from "../../hooks/data.hook";
import { useTradeStats } from "../../hooks/trade.hoosk";
import { calculateStrategy, withRunningTotal } from "../../utils/calculations";
import { HumanDate } from "../utils/human-date";
import * as R from "ramda";
import XScrollbar from "../utils/scrollbars";
export const TradeStats = () => {
  const { rows: targetRows } = useRows("target");
  const { rows: targetRows2 } = useRows("target2");
  const { strategies } = useStrategies();
  const { rows: source } = useRows("source");
  // const stats1 = .map(calculateStrategy(source, target));
  const { target = [], target2 = [] } = R.groupBy(
    R.propOr("target", "dataset"),
    strategies
  );
  const stats1 = target.map(calculateStrategy(source, targetRows));
  const stats2 = target2.map(calculateStrategy(source, targetRows2));

  const stats = R.pipe(
    R.concat(stats2),
    R.unnest,
    R.sortBy(R.prop("opened")),
    withRunningTotal
  )(stats1);
  return (
    <Stack spacing={1}>
      <Stack direction={"row"} spacing={2} alignItems="center">
        <Typography fontSize={20}>Trade Statistics</Typography>
      </Stack>
      <XScrollbar>
        <Table size="small" sx={{ th: { width: "1px" } }}>
          <TableHead>
            <TableRow>
              <TableCell component="th"></TableCell>
              <TableCell component="th">Opened</TableCell>
              <TableCell component="th">Closed</TableCell>
              <TableCell>PNL</TableCell>
              <TableCell>Run Up </TableCell>
              <TableCell>Drawdown</TableCell>
              <TableCell>Running Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((s) => (
              <TableRow
                key={`${s.openPrice}${s.opened}${s.closePrice}${s.closed}${s.strategy.dataset}`}
                onMouseEnter={() => {
                }}
              >
                <TableCell>
                  <Typography
                    level="body3"
                    color={!s?.short ? "success" : "danger"}
                  >
                    {s?.short ? "Short" : "Long"}
                  </Typography>
                  <Typography level="body2">
                    {s.strategy?.dataset === "target" ? "Target 1" : "Target 2"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <HumanDate level="body3" time={s.opened} />
                  <Typography> ${s.openPrice}</Typography>
                </TableCell>
                <TableCell>
                  <HumanDate level="body3" time={s.closed} />
                  <Typography> ${s.closePrice}</Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    level="body3"
                    color={(s?.pnl || 0) > 0 ? "success" : "danger"}
                  >
                    {s.pnlRate}%
                  </Typography>
                  <Typography> ${s.pnl}</Typography>
                </TableCell>
                <TableCell>
                  <Typography level="body3">{s.runupRate}%</Typography>
                  <Typography> ${s.runup}</Typography>
                </TableCell>
                <TableCell>
                  <Typography level="body3">{s.drawdownRate}%</Typography>
                  <Typography> ${s.drawdown}</Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    level="body3"
                    color={(s?.totalPnl || 0) > 0 ? "success" : "danger"}
                  >
                    ${s.totalPnl}
                  </Typography>
                  {s.moneyIn}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </XScrollbar>
    </Stack>
  );
};
