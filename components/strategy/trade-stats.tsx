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
import { calculateStrategy } from "../utils/calculations";
import { HumanDate } from "../utils/human-date";

export const TradeStats = () => {
  const { rows } = useRows("target");
  const { strategies } = useStrategies();
  const dataset = strategies[0]?.openSignal?.dataset || "source";
  const { rows: source } = useRows(dataset);
  const stats = strategies.map(calculateStrategy(source, rows));

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
