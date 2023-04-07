import {
  CheckIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/joy";
import axios from "axios";
import { useState } from "react";
import { useRows, useSettings } from "../../../hooks/data.hook";
import { IStrategy } from "../../../types/app.types";
import { getReversalStrategy } from "../../../utils/strategy.utils";
import { useSignalEvents } from "../../strategy-details/hooks/signal-events";
import { useStrategyStats } from "../../strategy-details/hooks/strategy-stats";
import { useStrategyTrades } from "../../strategy-details/hooks/strategy-trades";
import { XStats } from "../../utils/stats";
import { useStrategy } from "../../v2/hooks/v2-data.hook";

type Props = {
  strategy: IStrategy;
  reversed?: boolean;
  useTpLs?: boolean;
};

export const MyStrategyStats = ({ strategy, reversed, useTpLs }: Props) => {
  const { updateStrategy } = useStrategy(strategy.id);
  const { source, takeProfit, stopLoss } = useSettings();
  const ds = reversed
    ? strategy?.dataset === "target"
      ? "target2"
      : "target"
    : strategy?.dataset;
  const { rows, dataset } = useRows(ds);

  const events = useSignalEvents(strategy);
  const trades = useStrategyTrades(
    events,
    rows,
    reversed ? getReversalStrategy(strategy) : strategy,
    useTpLs ? takeProfit : undefined,
    useTpLs ? stopLoss : undefined
  );
  const stats = useStrategyStats(trades);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const uploadTrades = async () => {
    if (!success && !error && !uploading) {
      try {
        setSuccess(false);
        setError(false);
        setUploading(true);
        const { data } = await axios.post("/api/scripts/strategy", {
          trades,
          strategy,
          source,
          dataset,
        });
        if (data?.data?.success) {
          setSuccess(true);
          updateStrategy({
            scripts: {
              ...strategy?.scripts,
              [dataset]: data?.data?.result?.metaInfo?.scriptIdPart,
            },
          });
        }
      } catch (error) {
        setError(true);
      } finally {
        setUploading(false);
      }
      setTimeout(() => {
        setSuccess(false);
        setError(false);
      }, 3000);
    }
  };
  return (
    <Box position="relative">
      <Box position="absolute" top={-32} right={0}>
        <Tooltip title="Upload to TradingView">
          <IconButton
            size="sm"
            onClick={uploadTrades}
            color={
              error
                ? "danger"
                : success || strategy?.scripts?.[dataset]
                ? "success"
                : "primary"
            }
          >
            {uploading ? (
              <CircularProgress />
            ) : success ? (
              <CheckIcon />
            ) : error ? (
              <ExclamationTriangleIcon width={16} />
            ) : (
              <CloudArrowUpIcon width={20} />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <XStats
        table
        stats={[
          { label: "Total", value: stats.totalTrades },
          { label: "Open", value: stats.openTrades },
          {
            label: "Winning",
            value: stats.winningTrades,
            success: true,
            split: true,
          },
          {
            label: "Losing",
            value: stats.losingTrades,
            failure: true,
          },
          { label: "Total In", value: stats.totalIn, split: true, cur: true },
          { label: "Total Out", value: stats.totalOut, cur: true },
          { label: "Max In", value: stats.maxIn, split: true, cur: true },
          { label: "ROI", value: stats.roi, dynamic: true, per: true },
          {
            label: "PNL",
            value: stats.pnl,
            dynamic: true,
            split: true,
            cur: true,
          },
          { label: "PNL % ", value: stats.pnlRate, dynamic: true, per: true },
        ]}
      />
    </Box>
  );
};
