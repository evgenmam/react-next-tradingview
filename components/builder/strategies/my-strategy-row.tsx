import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Box,
  Chip,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import noop from "lodash.noop";
import { FC, useMemo } from "react";
import { CLOSING } from "ws";
import { useRows } from "../../../hooks/data.hook";
import { useSettings } from "../../../hooks/settings.hook";
import { IStrategy } from "../../../types/app.types";
import {
  applyStrategy,
  calculateStrategy,
  strategyStats,
} from "../../../utils/calculations";
import { XJson } from "../../json";
import { JSONDetails } from "../../utils/json-details";
import { Space } from "../../utils/row";
import { MySignalRow } from "../signals/my-signal-row";

type Props = {
  strategy: IStrategy;
  onDelete?: (id: number) => void;
  onSelect?: (id: number) => void;
  withLink?: boolean;
  selected?: boolean;
};

export const MyStrategyRow: FC<Props> = ({
  strategy,
  onDelete = noop,
  withLink,
  selected,
  onSelect,
}) => {
  const c = useSettings();
  const { rows: source } = useRows("source");
  const { rows: target } = useRows(strategy?.dataset || "target");
  const trades = useMemo(
    () => calculateStrategy(source, target)(strategy),
    [source, target, strategy]
  );

  const stats = useMemo(() => strategyStats(trades), [trades]);
  return (
    <Sheet
      sx={{
        borderRadius: 1,
        overflow: "hidden",
        ...(onSelect ? { cursor: "pointer" } : {}),
        transition: "all 0.2s ease-in-out",
      }}
      variant={selected ? "solid" : "plain"}
      onClick={() => onSelect?.(strategy.id!)}
    >
      <Stack
        p={1}
        justifyContent="space-between"
        direction="row"
        spacing={1}
        sx={{
          borderWidth: 0,
          borderLeftWidth: 10,
          borderColor: strategy.color,
          borderStyle: "solid",
        }}
      >
        <Stack spacing={1}>
          <Space s={1} sb>
            <Space s={1} alignItems="center">
              {strategy?.dataset && (
                <Typography>
                  {c?.[strategy?.dataset as keyof typeof c]}
                </Typography>
              )}
              <Chip
                color={strategy?.direction === "long" ? "success" : "danger"}
                size="sm"
              >
                {strategy?.direction?.toUpperCase()}
              </Chip>
              <Chip size="sm">{strategy?.entry}ct</Chip>
              {withLink && (
                <Link href={`/strategy?id=${strategy.id}`} target="_blank">
                  <ArrowTopRightOnSquareIcon width={16} />
                </Link>
              )}
            </Space>
            <Box ml="auto" justifySelf="flex-end">
              <IconButton
                color="danger"
                size="sm"
                onClick={() => onDelete(strategy?.id)}
              >
                <TrashIcon width={16} />
              </IconButton>
            </Box>
          </Space>
          <Box>
            <Grid2 container spacing={0.5} p={0}>
              {strategy?.openSignal && (
                <Grid2 flexShrink={0}>
                  <Typography level="body2" pl={1.5}>
                    Open
                  </Typography>
                  <MySignalRow signal={strategy?.openSignal} />
                </Grid2>
              )}
              {strategy?.closeSignal && (
                <Grid2 flexShrink={0}>
                  <Typography level="body2" pl={1.5}>
                    Close
                  </Typography>
                  <MySignalRow signal={strategy?.closeSignal} />
                </Grid2>
              )}
            </Grid2>
          </Box>
          <List>
            <ListItem>
              <ListItemContent>PNL</ListItemContent>
              <Typography>{stats?.totalPnl}</Typography>
            </ListItem>
            {/* <ListItem>
              <ListItemContent>Winning/Losing</ListItemContent>
              <Typography>{stats?.totalTrades}</Typography>
            </ListItem> */}
          </List>
        </Stack>
      </Stack>
      <JSONDetails data={stats} />
    </Sheet>
  );
};
