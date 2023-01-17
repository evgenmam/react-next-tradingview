import { Box, colors, Typography, typographyClasses } from "@mui/joy";
import {
  ButtonBase,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useRows, useStrategies } from "../../hooks/data.hook";
import { useTradeStats } from "../../hooks/trade.hoosk";
import { calculateStrategy } from "../../utils/calculations";
import { HumanDate } from "../utils/human-date";
import * as R from "ramda";
export const TradeStats = () => {
  const { rows: targetRows } = useRows("target");
  const { rows: targetRows2 } = useRows("target");
  const { strategies } = useStrategies();
  const { rows: source } = useRows("source");
  // const stats1 = .map(calculateStrategy(source, target));
  const { target, target2 } = R.groupBy(
    R.propOr("target", "dataset"),
    strategies
  );
  console.log(strategies);
  return;
  const stats1 = target.map(calculateStrategy(source, targetRows));
  const stats2 = target2.map(calculateStrategy(source, targetRows2));

  const stats = R.pipe(R.concat(stats2), R.sortBy(R.prop("opened")))(stats1);
  return (
    <Stack spacing={1}>
      <Stack direction={"row"} spacing={2} alignItems="center">
        <Typography fontSize={20}>Trade Statistics</Typography>
      </Stack>
      <Table size="small" sx={{ th: { width: "1px" } }}>
        <TableHead>
          <TableRow>
            <TableCell component="th">Opened</TableCell>
            <TableCell component="th">Closed</TableCell>
            <TableCell>PNL</TableCell>
            <TableCell>Running Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.flatMap((stat) =>
            stat.map((s) => (
              <TableRow
                key={`${s.openPrice}${s.opened}${s.closePrice}${s.closed}`}
              >
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Stack>
  );
};
