import { TrashIcon } from "@heroicons/react/24/outline";
import { Box, Divider, IconButton, Sheet, Stack, Typography } from "@mui/joy";
import noop from "lodash.noop";

import { FC } from "react";

import { useSettings } from "../../../hooks/settings.hook";
import { IStrategy } from "../../../types/app.types";
import { Space } from "../../utils/row";
import MySignalPopper from "../signals/my-signal-popper";
import MyStrategyRowItem from "./my-strategy-row-item";

type Props = {
  strategy: IStrategy;
  onDelete?: (id: number) => void;
  onSelect?: (id: number) => void;
  withLink?: boolean;
  selected?: boolean;
  useTpLs?: boolean;
  small?: boolean;
};
export const MyStrategyRow: FC<Props> = ({
  strategy,
  onDelete = noop,
  withLink,
  selected,
  onSelect,
  useTpLs,
  small,
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
        spacing={1}
        sx={{
          borderWidth: 0,
          borderLeftWidth: 10,
          borderColor: strategy.color,
          borderStyle: "solid",
        }}
      >
        <Stack spacing={2} pb={1}>
          <Space spacing={2} sb>
            <Typography>{`Strategy ${strategy?.id}`}</Typography>
            <Box>
              <Space s={2}>
                {strategy?.openSignal && (
                  <Space s={0.5} c>
                    <Typography level="body2">Open on:</Typography>
                    <MySignalPopper signal={strategy?.openSignal} />
                  </Space>
                )}
                {strategy?.closeSignal && (
                  <Space s={0.5} c>
                    <Typography level="body2">Close on:</Typography>
                    <MySignalPopper signal={strategy?.closeSignal} />
                  </Space>
                )}
                {/* {!!strategy?.stopLoss && (
                  <Space s={0.5} c>
                    <Typography level="body2">Stop Loss:</Typography>
                    <Typography>{strategy.stopLoss}%</Typography>
                  </Space>
                )}
                {!!strategy?.takeProfit && (
                  <Space s={0.5} c>
                    <Typography level="body2">Take Profit:</Typography>
                    <Typography>{strategy.takeProfit}%</Typography>
                  </Space>
                )} */}
              </Space>
            </Box>
            {!small && (
              <IconButton
                color="danger"
                size="sm"
                onClick={() => onDelete(strategy?.id)}
              >
                <TrashIcon width={16} />
              </IconButton>
            )}
          </Space>
          {!small && (
            <>
              {" "}
              <MyStrategyRowItem
                strategy={strategy}
                withLink={withLink}
                useTpLs={useTpLs}
              />
              {c.reverseStrategies && strategy && (
                <>
                  <Divider></Divider>
                  <MyStrategyRowItem
                    strategy={strategy}
                    reversed
                    useTpLs={useTpLs}
                  />
                </>
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Sheet>
  );
};
