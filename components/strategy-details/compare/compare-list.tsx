import { List, Stack } from "@mui/joy";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";
import { useLists } from "../../../hooks/data.hook";
import { useV2BulkData } from "../../v2/hooks/v2-bulk-data.hook";
import { ISStats } from "../hooks/strategy-stats";
import CompareListItem from "./compare-list-item";

type CompareListProps = {
  w1?: number;
  w2?: number;
};

export const CompareList = ({ w1, w2 }: CompareListProps) => {
  const { lists } = useLists();
  const l1 = lists.find((l) => l.id === w1);
  const l2 = lists.find((l) => l.id === w2);
  const { loading } = useV2BulkData(w1, w2);

  return (
    <Box overflow="hidden" height="100%">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Pair</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Open</TableCell>
            <TableCell align="right">Winning</TableCell>
            <TableCell align="right">Losing</TableCell>
            <TableCell align="right">Total In</TableCell>
            <TableCell align="right">Total Out</TableCell>
            <TableCell align="right">Max In</TableCell>
            <TableCell align="right">ROI</TableCell>
            <TableCell align="right">PNL</TableCell>
            <TableCell align="right">PNL % </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {l2?.symbols?.map((s2) =>
            l1?.symbols.map((s1) => (
              <CompareListItem key={s1.symbol} num={s1} den={s2} />
            ))
          )}
          <TableRow>
            <TableCell colSpan={10} align="right">
              Total:
            </TableCell>
            <TableCell align="right">-</TableCell>
            <TableCell align="right">-</TableCell>
            <TableCell align="right">-</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default CompareList;
