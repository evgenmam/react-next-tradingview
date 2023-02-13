import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Box,
  Chip,
  Divider,
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
import { FC, useDebugValue, useMemo } from "react";
import { CLOSING } from "ws";
import { useRows } from "../../../hooks/data.hook";
import { useSettings } from "../../../hooks/settings.hook";
import { IStrategy, ITrade } from "../../../types/app.types";
import {
  applyStrategy,
  calculateStrategy,
  ITVStats,
  strategyStats,
} from "../../../utils/calculations";
import { XJson } from "../../json";
import { JSONDetails } from "../../utils/json-details";
import { Space } from "../../utils/row";
import { XStats, XStatsCol } from "../../utils/stats";
import { XTable } from "../../utils/table";
import { MySignalRow } from "../signals/my-signal-row";
import * as R from "ramda";
import * as D from "date-fns";
import { MyStrategyStats } from "./my-strategy-stats";

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

  return (
    <Sheet
      sx={{
        borderRadius: 1,
        overflow: "hidden",
        ...(onSelect ? { cursor: "pointer" } : {}),
        transition: "all 0.2s ease-in-out",
        ...(selected ? { transform: "scale(1.02)" } : {}),
      }}
      // variant={selected ? "outlined" : "plain"}
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
        <Stack spacing={2}>
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
                {strategy?.usd ? (
                  <Chip size="sm">${strategy?.usd}</Chip>
                ) : (
                  <Chip size="sm">
                    {strategy?.entry}{" "}
                    {c[strategy?.dataset as keyof typeof c]?.split?.(":")[1]}
                  </Chip>
                )}{" "}
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
                  <Grid2 flexShrink={0} maxWidth="100%">
                    <Typography level="body2" pl={1.5}>
                      Open
                    </Typography>
                    <MySignalRow signal={strategy?.openSignal} />
                  </Grid2>
                )}
                {strategy?.closeSignal && (
                  <Grid2 flexShrink={0} maxWidth="100%">
                    <Typography level="body2" pl={1.5}>
                      Close
                    </Typography>
                    <MySignalRow signal={strategy?.closeSignal} />
                  </Grid2>
                )}
              </Grid2>
            </Box>
            <MyStrategyStats strategy={strategy} />
          </Stack>
          {c.reverseStrategies && (
            <>
              <Divider></Divider>
              <Space s={1} alignItems="center">
                {strategy?.dataset && (
                  <Typography>
                    {
                      c?.[
                        (strategy?.dataset === "target"
                          ? "target2"
                          : "target") as keyof typeof c
                      ]
                    }
                  </Typography>
                )}
                <Chip
                  color={strategy?.direction === "long" ? "danger" : "success"}
                  size="sm"
                >
                  {strategy?.direction === "short" ? "LONG" : "SHORT"}
                </Chip>
                {strategy?.usd ? (
                  <Chip size="sm">${strategy?.usd}</Chip>
                ) : (
                  <Chip size="sm">
                    {strategy?.entry}{" "}
                    {
                      c[
                        strategy?.dataset === "target" ? "target2" : "target"
                      ]?.split?.(":")[1]
                    }
                  </Chip>
                )}
              </Space>
              <MyStrategyStats
                strategy={{
                  ...strategy,
                  dataset:
                    strategy?.dataset === "target" ? "target2" : "target",
                  direction: strategy?.direction === "short" ? "long" : "short",
                  openSignal: strategy?.closeSignal,
                  closeSignal: strategy?.openSignal,
                }}
              />
            </>
          )}
        </Stack>
      </Stack>
    </Sheet>
  );
};
