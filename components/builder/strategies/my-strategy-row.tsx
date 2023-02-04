import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Box,
  Chip,
  IconButton,
  Link,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
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
};

export const MyStrategyRow: FC<Props> = ({ strategy, onDelete = noop }) => {
  const c = useSettings();
  const { rows: source } = useRows("source");
  const { rows: target } = useRows(strategy?.dataset || "target");
  const trades = useMemo(
    () => calculateStrategy(source, target)(strategy),
    [source, target, strategy]
  );
  console.log(trades);
  const stats = useMemo(() => strategyStats(trades), [trades]);
  return (
    <Sheet
      sx={{
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Stack
        p={1}
        justifyContent="space-between"
        direction="row"
        spacing={1}
        sx={{
          borderLeftWidth: 10,
          borderColor: strategy.color,
          borderLeftStyle: "solid",
        }}
      >
        <Stack spacing={1}>
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
            <Link href={`/strategy?id=${strategy.id}`} target="_blank">
              <ArrowTopRightOnSquareIcon width={16} />
            </Link>
          </Space>
          <Space s={1}>
            {strategy?.openSignal && (
              <Stack spacing={0.5}>
                <Typography level="body2" textAlign="center">
                  Open
                </Typography>
                <MySignalRow signal={strategy?.openSignal} />
              </Stack>
            )}
            {strategy?.closeSignal && (
              <Stack spacing={0.5}>
                <Typography level="body2" textAlign="center">
                  Close
                </Typography>
                <MySignalRow signal={strategy?.closeSignal} />
              </Stack>
            )}
          </Space>
        </Stack>
        <JSONDetails data={stats} />
        <Box ml="auto" justifySelf="flex-end">
          <IconButton
            color="danger"
            size="sm"
            onClick={() => onDelete(strategy?.id)}
          >
            <TrashIcon width={16} />
          </IconButton>
        </Box>
      </Stack>
    </Sheet>
  );
};
